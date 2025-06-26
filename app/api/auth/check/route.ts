import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  const authCookie = cookies().get("admin-auth")
  const isAuthenticated = authCookie?.value === "authenticated"

  return NextResponse.json({ authenticated: isAuthenticated })
}
