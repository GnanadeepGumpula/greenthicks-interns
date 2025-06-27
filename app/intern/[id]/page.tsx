import { notFound } from "next/navigation"
import { InternProfile } from "@/components/intern-profile"
import type { InternData } from "@/components/intern-profile"
import { getInternById } from "@/lib/google-sheets"

async function getInternData(id: string): Promise<InternData | null> {
  try {
    const intern = await getInternById(id)

    if (typeof intern.internshipFields === "string") {
      intern.internshipFields = JSON.parse(intern.internshipFields)
    }

    return intern
  } catch (error) {
    console.error("Error fetching intern data:", error)
    return null
  }
}

export default async function InternPage({ params }: { params: { id: string } }) {
  const intern = await getInternData(params.id)

  if (!intern) return notFound() // ✅ fixes null issue

  return <InternProfile intern={intern} />
}
