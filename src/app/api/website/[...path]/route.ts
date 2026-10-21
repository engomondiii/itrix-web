import { hasAllowedRequestOrigin } from '@/lib/server/request-origin';
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
const paths = /^(config|intake|unsubscribe)$/;
async function proxy(
  request: Request,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  const target = path.join("/");
  if (!paths.test(target))
    return NextResponse.json({ detail: "Not found" }, { status: 404 });
  if (
    request.method === "POST" &&
    !hasAllowedRequestOrigin(request)
  )
    return NextResponse.json({ detail: "Invalid origin" }, { status: 403 });
  const base = (
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    ""
  ).replace(/\/$/, "");
  if (!base)
    return NextResponse.json(
      { detail: "Service unavailable" },
      { status: 503 },
    );
  const body = request.method === "POST" ? await request.text() : undefined;
  if (body && body.length > 40000)
    return NextResponse.json({ detail: "Request too large" }, { status: 413 });
  try {
    const response = await fetch(
      `${base}/website/${target}/${new URL(request.url).search}`,
      {
        method: request.method,
        body,
        cache: "no-store",
        signal: AbortSignal.timeout(15000),
        headers: {
          "Content-Type": "application/json",
          "X-Website-Proxy-Key": process.env.WEBSITE_PROXY_KEY || "",
          "X-Website-Client-IP": request.headers.get("x-real-ip") || "",
        },
      },
    );
    const data = await response
      .json()
      .catch(() => ({ detail: "Service unavailable" }));
    return NextResponse.json(data, {
      status: response.status,
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json(
      { detail: "Service unavailable. Please try again." },
      { status: 503 },
    );
  }
}
export const GET = proxy;
export const POST = proxy;
