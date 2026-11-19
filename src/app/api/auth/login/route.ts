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

    const upstream = await fetch(`${userCfg.baseUrl}/api/v1/auth/login`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    const data = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      return NextResponse.json(data, { status: upstream.status });
    }

    const token: string | undefined = data?.token;
    const user = data?.data;

    const response = NextResponse.json({ data: user }, { status: 200 });
    if (token) {
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax" as const,
        path: "/",
        maxAge: 60 * 60 * 24,
      };
      response.cookies.set("authToken", token, cookieOptions);
      if (user?.role) {
        response.cookies.set("userRole", String(user.role), cookieOptions);
      }
    }

    return response;
  } catch {
    return NextResponse.json({ message: "Login failed" }, { status: 500 });
  }
}
