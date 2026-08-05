// The API key/secret live server-side only (src/app/api/pnd/[...path]/route.ts)
// and are attached there. The browser never sees them — it just calls this
// same-origin proxy path.
const BASE_URL = "/api/pnd"; // Next.js API route proxy

// ── Types ────────────────────────────────────────────────────────────────────
export interface PndBranch {
  branch_name: string;
  area?: string[];
  branch_code?: string;
  status?: string;
  deliveryAmount?: number;
}

// One selectable branch, with its individual localities parsed out.
//
// IMPORTANT: Pick & Drop's `area` field is NOT one clean string per
// locality despite what their docs example shows. In practice a branch's
// `area` array can contain a single entry that is itself a giant
// comma-joined blob, e.g.:
//   area: ["Thamel,Basantapur,New Road,Swayambhu,Lazimpat,Durbar Marg,..."]
// So every entry in `area` must be split on "," and trimmed to get the
// real list of individual locality names — see parseAreaNames() in
// usePicknDrop.ts, which builds `areas` below.
export interface PndDestination {
  key: string; // unique React key (== branchName)
  label: string; // shown in the "Delivery Branch" dropdown — branch name ONLY
  branchName: string; // real branch_name — goes to destinationBranch
  areas: string[]; // parsed individual localities under this branch, for the separate "Area / Locality" field
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
  // ── Temporary override ──────────────────────────────────────────────────
  // The Pick & Drop account currently on file may have the wrong business
  // address registered (e.g. a demo/test address in a different city than
  // where this vendor actually operates from). Rather than silently
  // computing delivery rates from the wrong pickup point, set this env var
  // to force the correct branch until the account's registered address is
  // corrected with Pick & Drop directly.
  //
  // NEXT_PUBLIC_ is safe here — a branch/city name isn't a secret, and this
  // runs client-side inside usePicknDrop.
  const override = process.env.NEXT_PUBLIC_PND_PICKUP_BRANCH_OVERRIDE;
  if (override) {
    return { branch_name: override, location: override };
  }

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
