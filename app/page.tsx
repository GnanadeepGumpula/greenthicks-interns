import { Suspense } from "react"
import { Hero } from "@/components/hero"
import { SearchSection } from "@/components/search-section"
import { AboutSection } from "@/components/about-section"
import { SupportSection } from "@/components/support-section"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Hero />
      <Suspense fallback={<div>Loading...</div>}>
        <SearchSection />
      </Suspense>
      <AboutSection />
      <SupportSection />
    </div>
  )
}
