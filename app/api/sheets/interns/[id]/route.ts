import { NextResponse } from "next/server"
import { deleteIntern } from "@/lib/google-sheets"

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const success = await deleteIntern(id)

    if (success) {
      return NextResponse.json({
        success: true,
        message: "Intern deleted successfully",
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Intern not found",
        },
        { status: 404 },
      )
    }
  } catch (error) {
    console.error("Error deleting intern:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete intern. Please check your Google Sheets configuration.",
      },
      { status: 500 },
    )
  }
}
