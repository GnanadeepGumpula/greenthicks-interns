import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    // In production, use environment variables
    const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin"
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123"

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // Set authentication cookie
      cookies().set("admin-auth", "authenticated", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24, // 24 hours
      })

      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 })
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}
