import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, Search } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-green-600 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Intern Not Found</h2>
          <p className="text-gray-600 dark:text-gray-300">
            The intern profile you're looking for doesn't exist or may have been removed.
          </p>
        </div>

        <div className="space-y-4">
          <Button asChild className="w-full bg-green-600 hover:bg-green-700">
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="w-full bg-white text-green-600 border-green-600 hover:bg-green-50"
          >
            <Link href="/#search">
              <Search className="h-4 w-4 mr-2" />
              Search Again
            </Link>
          </Button>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>
            Need help?{" "}
            <Link href="/#support" className="text-green-600 hover:text-green-700">
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
