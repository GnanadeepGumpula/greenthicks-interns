"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Search, Eye, Edit, Trash2, Download } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Intern {
  id: string
  name: string
  email: string
  phone: string
  dateOfBirth: string
  fatherName: string
  motherName: string
  photo: string
  linkedinProfile: string
  internshipFields: Array<{
    field: string
    startDate: string
    endDate: string
    mode: "online" | "offline"
    projectVideos: string[]
  }>
  totalMonthsCompleted: number
  onlineMonthsCompleted: number
  offlineMonthsCompleted: number
  certificateIssueDate: string
}

export function InternsView() {
  const [interns, setInterns] = useState<Intern[]>([])
  const [filteredInterns, setFilteredInterns] = useState<Intern[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchInterns()
  }, [])

  useEffect(() => {
    filterInterns()
  }, [searchQuery, interns])

  const fetchInterns = async () => {
    try {
      const response = await fetch("/api/sheets/interns")
      const data = await response.json()

      if (data.success) {
        setInterns(data.data)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch interns data",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch interns data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filterInterns = () => {
    if (!searchQuery.trim()) {
      setFilteredInterns(interns)
      return
    }

    const filtered = interns.filter(
      (intern) =>
        intern.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        intern.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        intern.phone.includes(searchQuery) ||
        intern.id.includes(searchQuery) ||
        intern.internshipFields.some((field) => field.field.toLowerCase().includes(searchQuery.toLowerCase())),
    )
    setFilteredInterns(filtered)
  }

  const deleteIntern = async (id: string) => {
    if (!confirm("Are you sure you want to delete this intern?")) return

    try {
      const response = await fetch(`/api/sheets/interns/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setInterns(interns.filter((intern) => intern.id !== id))
        toast({
          title: "Success",
          description: "Intern deleted successfully",
        })
      } else {
        throw new Error("Failed to delete")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete intern",
        variant: "destructive",
      })
    }
  }

  const exportData = () => {
    const csvContent = [
      [
        "ID",
        "Name",
        "Email",
        "Phone",
        "Date of Birth",
        "Father Name",
        "Mother Name",
        "LinkedIn",
        "Fields",
        "Total Months",
        "Online Months",
        "Offline Months",
      ],
      ...filteredInterns.map((intern) => [
        intern.id,
        intern.name,
        intern.email,
        intern.phone,
        intern.dateOfBirth,
        intern.fatherName,
        intern.motherName,
        intern.linkedinProfile,
        intern.internshipFields.map((f) => `${f.field} (${f.mode})`).join("; "),
        intern.totalMonthsCompleted.toString(),
        intern.onlineMonthsCompleted.toString(),
        intern.offlineMonthsCompleted.toString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "interns-data.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p>Loading interns data...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>All Interns</CardTitle>
              <CardDescription>View and manage all intern profiles</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={exportData}
                variant="outline"
                className="bg-white text-green-600 border-green-600 hover:bg-green-50"
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by name, email, phone, ID, or field..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Showing {filteredInterns.length} of {interns.length} interns
          </div>

          <div className="grid gap-4">
            {filteredInterns.map((intern) => (
              <Card key={intern.id} className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-shrink-0">
                    <Image
                      src={intern.photo || "/placeholder.svg"}
                      alt={intern.name}
                      width={80}
                      height={80}
                      className="rounded-full border-2 border-green-200"
                    />
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{intern.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">ID: {intern.id}</p>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                          Total: {intern.totalMonthsCompleted}m
                        </Badge>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                          Online: {intern.onlineMonthsCompleted}m
                        </Badge>
                        <Badge variant="secondary" className="bg-orange-100 text-orange-800 text-xs">
                          Offline: {intern.offlineMonthsCompleted}m
                        </Badge>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-600 dark:text-gray-300">Email:</span> {intern.email}
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-300">Phone:</span> {intern.phone}
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-300">Father:</span> {intern.fatherName}
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-300">Mother:</span> {intern.motherName}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mt-2">
                      {intern.internshipFields.map((field, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {field.field} ({field.mode})
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 md:flex-row md:items-center">
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="bg-white text-blue-600 border-blue-600 hover:bg-blue-50"
                    >
                      <Link href={`/intern/${intern.id}`} target="_blank">
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-white text-orange-600 border-orange-600 hover:bg-orange-50"
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-white text-red-600 border-red-600 hover:bg-red-50"
                      onClick={() => deleteIntern(intern.id)}
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))}

            {filteredInterns.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No interns found matching your search criteria.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
