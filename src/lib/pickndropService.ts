// ── Env vars (Next.js uses NEXT_PUBLIC_ prefix for client-side) ──────────────
const API_KEY = process.env.NEXT_PUBLIC_PND_API_KEY ?? "";
const API_SECRET = process.env.NEXT_PUBLIC_PND_API_SECRET ?? "";
const BASE_URL = "/api/pnd"; // Next.js API route proxy

// ── Types ────────────────────────────────────────────────────────────────────
export interface PndBranch {
  branch_name: string;
  area?: string[];
  branch_code?: string;
  status?: string;
  deliveryAmount?: number;
}

export interface VendorBranch {
  branch_name: string;
  location: string;
}

export interface DeliveryRate {
  deliveryAmount: number;
  totalDelivery: number;
  surgePrice: number;
}

export interface OrderPayload {
  customerName: string;
  primaryMobileNo: string;
  destinationBranch: string;
  destinationCityArea: string;
  orderDescription: string;
  codAmount: number;
  instruction: string;
  orderType: string;
  landmark?: string;
}

export interface OrderResult {
  orderID: string;
  delivery_charge?: number;
  status?: string;
  vendor_tracking_number?: string;
  tracking_url?: string;
}

// ── Core fetch wrapper ───────────────────────────────────────────────────────
async function pndFetch(endpoint: string, options: RequestInit = {}) {
  const res = await fetch(endpoint, {
    ...options,
    headers: {
      Authorization: `token ${API_KEY}:${API_SECRET}`,
      "Content-Type": "application/json",
      Accept: "*/*",
      ...(options.headers ?? {}),
    },
  });

  const data = await res.json();

  if (!res.ok || data?.message?.status === "error") {
    throw new Error(
      data?.message?.message ?? data?.exc ?? `Request failed (${res.status})`,
    );
  }

  return data.message;
}

// ── API functions ────────────────────────────────────────────────────────────
export async function getBranches(): Promise<PndBranch[]> {
  const result = await pndFetch(`${BASE_URL}/get_branches`);
  return result?.data?.branches ?? [];
}

export async function getBusinessAddress(): Promise<{
  vendor_name: string;
  addresses: string[];
}> {
  const result = await pndFetch(`${BASE_URL}/business_address`);
  return result?.data ?? {};
}

export async function getVendorBranch(): Promise<VendorBranch> {
  const [branches, business] = await Promise.all([
    getBranches(),
    getBusinessAddress(),
  ]);

  const addresses: string[] = business?.addresses ?? [];
  const firstAddress = addresses[0] ?? "";

  if (!firstAddress) {
    return { branch_name: branches[0]?.branch_name ?? "", location: "" };
  }

  const upper = firstAddress.toUpperCase().trim();

  const exactMatch = branches.find(
    (b) => b.branch_name.toUpperCase().trim() === upper,
  );
  if (exactMatch)
    return { branch_name: exactMatch.branch_name, location: firstAddress };

  const areaMatch = branches.find((b) =>
    (b.area ?? []).some((area) => area.toUpperCase().trim() === upper),
  );
  if (areaMatch)
    return { branch_name: areaMatch.branch_name, location: firstAddress };

  const partialMatch = branches.find(
    (b) =>
      b.branch_name.toUpperCase().includes(upper) ||
      upper.includes(b.branch_name.toUpperCase()),
  );
  if (partialMatch)
    return { branch_name: partialMatch.branch_name, location: firstAddress };

  for (let i = 1; i < addresses.length; i++) {
    const u = addresses[i].toUpperCase().trim();
    const m = branches.find((b) => b.branch_name.toUpperCase().trim() === u);
    if (m) return { branch_name: m.branch_name, location: addresses[0] };
    const am = branches.find((b) =>
      (b.area ?? []).some((area) => area.toUpperCase().trim() === u),
    );
    if (am) return { branch_name: am.branch_name, location: addresses[0] };
  }

  return {
    branch_name: branches[0]?.branch_name ?? "",
    location: firstAddress,
  };
}

export async function getDeliveryRate({
  pickupBranch,
  destinationBranch,
  location,
  cityArea,
  weight = 1,
}: {
  pickupBranch: string;
  destinationBranch: string;
  location: string;
  cityArea: string;
  weight?: number;
}): Promise<DeliveryRate> {
  const result = await pndFetch(`${BASE_URL}/get_delivery_rate`, {
    method: "POST",
    body: JSON.stringify({
      pickup_branch: pickupBranch,
      destination_branch: destinationBranch,
      location,
      city_area: cityArea,
      package_weight: weight,
      package_width: 1,
      package_height: 1,
      package_length: 1,
      size_uom: "cm",
      weight_uom: "kg",
    }),
  });

  return {
    deliveryAmount: result?.data?.delivery_amount ?? 0,
    totalDelivery: result?.total_delivery_sum ?? 0,
    surgePrice: result?.surge_price ?? 0,
  };
}

export async function createOrder(payload: OrderPayload): Promise<OrderResult> {
  const result = await pndFetch(`${BASE_URL}/create_order`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return result?.data ?? {};
}
