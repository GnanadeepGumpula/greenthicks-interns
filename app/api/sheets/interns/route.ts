import { NextResponse } from "next/server"
import { getAllInterns } from "@/lib/google-sheets"

export async function GET() {
  try {
    const interns = await getAllInterns()

    return NextResponse.json({
      success: true,
      data: interns,
    })
  } catch (error) {
    console.error("Error fetching interns:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch interns. Please check your Google Sheets configuration.",
      },
      { status: 500 },
    )
  }
}
