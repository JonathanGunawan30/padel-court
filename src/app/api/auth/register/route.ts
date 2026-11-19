import { NextRequest, NextResponse } from "next/server";
import { serverApiConfig, getServerAuthHeaders } from "@/config/server-api";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userCfg = serverApiConfig.user;
    if (!userCfg.baseUrl) {
      return NextResponse.json({ message: "User service URL not configured" }, { status: 500 });
    }

    const headers = {
      ...getServerAuthHeaders(userCfg),
      "Content-Type": "application/json",
    };

    const upstream = await fetch(`${userCfg.baseUrl}/api/v1/auth/register`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    const data = await upstream.json().catch(() => ({}));
    return NextResponse.json(data, { status: upstream.status });
  } catch {
    return NextResponse.json({ message: "Registration failed" }, { status: 500 });
  }
}
