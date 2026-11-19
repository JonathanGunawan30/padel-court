import { NextRequest, NextResponse } from "next/server";
import { serverApiConfig, isValidService, getServerAuthHeaders } from "@/config/server-api";

async function handleProxy(
  req: NextRequest,
  context: { params: Promise<{ service: string; path: string[] }> }
) {
  const { service, path } = await context.params;
  if (!isValidService(service)) {
    return NextResponse.json({ message: "Invalid service" }, { status: 400 });
  }

  const serviceCfg = serverApiConfig[service];
  if (!serviceCfg.baseUrl) {
    return NextResponse.json({ message: `Service ${service} URL not configured` }, { status: 500 });
  }

  // Prevent path traversal segments
  if (path.some((seg) => seg === ".." || seg === ".")) {
    return NextResponse.json({ message: "Invalid path" }, { status: 400 });
  }

  const token = req.cookies.get("authToken")?.value;
  const headers = getServerAuthHeaders(serviceCfg, token);
  const targetUrl = `${serviceCfg.baseUrl.replace(/\/$/, "")}/${path.join("/")}${req.nextUrl.search}`;

  const contentType = req.headers.get("content-type") || "";
  const hasBody = req.method !== "GET" && req.method !== "HEAD";
  let body: BodyInit | undefined;

  if (hasBody) {
    if (contentType.includes("multipart/form-data")) {
      body = await req.formData();
      // Let fetch set the multipart boundary automatically
    } else if (contentType.includes("application/json")) {
      const text = await req.text();
      if (text) {
        body = text;
        headers["Content-Type"] = "application/json";
      }
    } else {
      const text = await req.text();
      if (text) {
        body = text;
        if (contentType) headers["Content-Type"] = contentType;
      }
    }
  }

  try {
    const upstream = await fetch(targetUrl, {
      method: req.method,
      headers,
      body,
    });

    const resContentType = upstream.headers.get("content-type") || "";
    if (resContentType.includes("application/json")) {
      const data = await upstream.json().catch(() => ({}));
      return NextResponse.json(data, { status: upstream.status });
    }

    const text = await upstream.text();
    return new NextResponse(text, {
      status: upstream.status,
      headers: { "Content-Type": resContentType || "text/plain" },
    });
  } catch {
    return NextResponse.json({ message: "Upstream service unavailable" }, { status: 502 });
  }
}

export const GET = handleProxy;
export const POST = handleProxy;
export const PUT = handleProxy;
export const PATCH = handleProxy;
export const DELETE = handleProxy;
