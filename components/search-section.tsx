"use client"

import { useState } from "react"
import { Search, User, Phone, Hash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export function SearchSection() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Search Required",
        description: "Please enter a search term",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      // Simulate API call - replace with actual Google Sheets API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // For demo purposes, redirect to a sample intern profile
      if (searchQuery.toLowerCase().includes("john") || searchQuery === "123456") {
        window.location.href = "/intern/123456"
      } else {
        toast({
          title: "No Results Found",
          description: "No intern found with the provided search criteria",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Search Error",
        description: "An error occurred while searching. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section id="search" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Search Intern Certificates</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Find and verify internship certificates by searching with name, unique ID, phone number, or any other
            details
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-12">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by name, ID, phone number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch} disabled={isLoading} className="bg-green-600 hover:bg-green-700">
              {isLoading ? "Searching..." : "Search"}
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card className="text-center">
            <CardHeader>
              <User className="h-8 w-8 mx-auto text-green-600 mb-2" />
              <CardTitle className="text-lg">By Name</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Search using full name or partial name matches</CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Hash className="h-8 w-8 mx-auto text-green-600 mb-2" />
              <CardTitle className="text-lg">By Unique ID</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Use the 6-digit unique identification number</CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Phone className="h-8 w-8 mx-auto text-green-600 mb-2" />
              <CardTitle className="text-lg">By Phone</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Search using registered phone number</CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
