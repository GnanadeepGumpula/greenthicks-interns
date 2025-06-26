import { NextResponse } from "next/server"
import { getInternById, searchInterns, addIntern } from "@/lib/google-sheets"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")

  try {
    if (!query) {
      return NextResponse.json({
        success: false,
        message: "Search query is required",
      })
    }

    // Search by ID first (exact match)
    if (query.length === 6 && /^\d+$/.test(query)) {
      const intern = await getInternById(query)
      if (intern) {
        return NextResponse.json({
          success: true,
          data: intern,
        })
      }
    }

    // Search by other criteria
    const results = await searchInterns(query)
    if (results.length > 0) {
      return NextResponse.json({
        success: true,
        data: results[0], // Return first match for single intern lookup
      })
    }

    return NextResponse.json({
      success: false,
      message: "No intern found",
    })
  } catch (error) {
    console.error("Error searching interns:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to search interns. Please check your Google Sheets configuration.",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Generate unique 6-digit ID
    const uniqueId = Math.floor(100000 + Math.random() * 900000).toString()

    const internData = {
      ...data,
      id: uniqueId,
    }

    await addIntern(internData)

    return NextResponse.json({
      success: true,
      data: internData,
    })
  } catch (error) {
    console.error("Error creating intern:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create intern. Please check your Google Sheets configuration.",
      },
      { status: 500 },
    )
  }
}
