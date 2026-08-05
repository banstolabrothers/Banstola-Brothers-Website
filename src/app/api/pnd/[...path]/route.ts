import { NextRequest, NextResponse } from "next/server";

const PND_BASE = process.env.PND_BASE_URL ?? "https://app-t.pickndropnepal.com";

// Server-only credentials — NOT prefixed with NEXT_PUBLIC_, so they never
// reach the browser bundle. The client no longer builds its own
// Authorization header (see src/lib/pickndropService.ts); this route is the
// only place that ever sees the API key/secret.
const API_KEY = process.env.PND_API_KEY ?? "";
const API_SECRET = process.env.PND_API_SECRET ?? "";
const AUTH_HEADER = `token ${API_KEY}:${API_SECRET}`;

// create_order is the one endpoint Pick & Drop serves under /api/v2/ — every
// other method (get_branches, business_address, get_delivery_rate, ...) is
// under /api/ (v1). See https://pickndrop.apidog.io/create-order-20060151e0
const V2_METHODS = new Set(["create_order"]);

function apiVersionSegment(path: string): string {
  return V2_METHODS.has(path) ? "v2/method" : "method";
}

function buildHeaders() {
  return {
    Authorization: AUTH_HEADER,
    "Content-Type": "application/json",
  };
}

function guardCredentials() {
  if (!API_KEY || !API_SECRET) {
    return NextResponse.json(
      {
        message: {
          status: "error",
          message:
            "Pick & Drop credentials are not configured on the server (PND_API_KEY / PND_API_SECRET).",
        },
      },
      { status: 500 },
    );
  }
  return null;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const missing = guardCredentials();
  if (missing) return missing;

  const { path: pathSegments } = await params;
  const path = pathSegments.join("/");
  const url = `${PND_BASE}/api/${apiVersionSegment(path)}/logi360.api.${path}${req.nextUrl.search}`;

  const res = await fetch(url, { headers: buildHeaders() });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const missing = guardCredentials();
  if (missing) return missing;

  const { path: pathSegments } = await params;
  const path = pathSegments.join("/");
  const url = `${PND_BASE}/api/${apiVersionSegment(path)}/logi360.api.${path}`;
  const body = await req.text();

  const res = await fetch(url, {
    method: "POST",
    headers: buildHeaders(),
    body,
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const missing = guardCredentials();
  if (missing) return missing;

  const { path: pathSegments } = await params;
  const path = pathSegments.join("/");
  const url = `${PND_BASE}/api/${apiVersionSegment(path)}/logi360.api.${path}`;
  const body = await req.text();

  const res = await fetch(url, {
    method: "PUT",
    headers: buildHeaders(),
    body,
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
