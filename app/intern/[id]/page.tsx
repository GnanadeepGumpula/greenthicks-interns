import { notFound } from "next/navigation"
import { InternProfile } from "@/components/intern-profile"
import { getInternById } from "@/lib/google-sheets"

async function getInternData(id: string) {
  try {
    return await getInternById(id)
  } catch (error) {
    console.error("Error fetching intern data:", error)
    return null
  }
}

export default async function InternPage({ params }: { params: { id: string } }) {
  const intern = await getInternData(params.id)

  if (!intern) {
    notFound()
  }

  return <InternProfile intern={intern} />
}
