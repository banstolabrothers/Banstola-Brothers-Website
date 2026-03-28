import { NextRequest, NextResponse } from "next/server";

const PND_BASE = "https://app-t.pickndropnepal.com";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path: pathSegments } = await params;
  const path = pathSegments.join("/");
  const url = `${PND_BASE}/api/method/logi360.api.${path}${req.nextUrl.search}`;

  const res = await fetch(url, {
    headers: {
      Authorization: req.headers.get("Authorization") ?? "",
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path: pathSegments } = await params;
  const path = pathSegments.join("/");
  const url = `${PND_BASE}/api/method/logi360.api.${path}`;
  const body = await req.text();

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: req.headers.get("Authorization") ?? "",
      "Content-Type": "application/json",
    },
    body,
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path: pathSegments } = await params;
  const path = pathSegments.join("/");
  const url = `${PND_BASE}/api/method/logi360.api.${path}`;
  const body = await req.text();

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: req.headers.get("Authorization") ?? "",
      "Content-Type": "application/json",
    },
    body,
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
