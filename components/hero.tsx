import { Button } from "@/components/ui/button"
import { ArrowDown } from "lucide-react"

export function Hero() {
  return (
    <section className="relative py-20 lg:py-32 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Green Thicks
            <span className="block text-2xl lg:text-3xl font-normal text-green-600 dark:text-green-400 mt-2">
              Internship Program
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Fresh from Farm to Table - Verify internship certificates and explore our comprehensive training programs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-green-600 hover:bg-green-700">
              Search Certificates
            </Button>
            <Button variant="outline" size="lg" className="bg-white text-green-600 border-green-600 hover:bg-green-50">
              Learn More
            </Button>
          </div>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ArrowDown className="h-6 w-6 text-green-600" />
      </div>
    </section>
  )
}
