"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Monitor, Building, Award, Calendar } from "lucide-react"

interface InternshipStatsProps {
  totalMonths: number
  onlineMonths: number
  offlineMonths: number
  fields: Array<{
    field: string
    mode: "online" | "offline"
    startDate: string
    endDate: string
  }>
}

export function InternshipStats({ totalMonths, onlineMonths, offlineMonths, fields }: InternshipStatsProps) {
  const onlineFields = fields.filter((f) => f.mode === "online")
  const offlineFields = fields.filter((f) => f.mode === "offline")

  const onlinePercentage = totalMonths > 0 ? Math.round((onlineMonths / totalMonths) * 100) : 0
  const offlinePercentage = totalMonths > 0 ? Math.round((offlineMonths / totalMonths) * 100) : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Award className="h-5 w-5 mr-2 text-green-600" />
          Internship Statistics
        </CardTitle>
        <CardDescription>Breakdown of online vs offline internship experience</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Online Stats */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Monitor className="h-5 w-5 mr-2 text-blue-600" />
                <span className="font-medium">Online Internships</span>
              </div>
              <Badge className="bg-blue-100 text-blue-800">
                {onlineMonths} months ({onlinePercentage}%)
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Fields completed online: {onlineFields.length}
              </div>
              <div className="flex flex-wrap gap-1">
                {onlineFields.map((field, index) => (
                  <Badge key={index} variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                    {field.field}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Offline Stats */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Building className="h-5 w-5 mr-2 text-orange-600" />
                <span className="font-medium">Offline Internships</span>
              </div>
              <Badge className="bg-orange-100 text-orange-800">
                {offlineMonths} months ({offlinePercentage}%)
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Fields completed offline: {offlineFields.length}
              </div>
              <div className="flex flex-wrap gap-1">
                {offlineFields.map((field, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="text-xs bg-orange-50 text-orange-700 border-orange-200"
                  >
                    {field.field}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between text-sm mb-2">
            <span>Online vs Offline Distribution</span>
            <span>{totalMonths} total months</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div className="h-full flex">
              <div className="bg-blue-500 transition-all duration-300" style={{ width: `${onlinePercentage}%` }}></div>
              <div
                className="bg-orange-500 transition-all duration-300"
                style={{ width: `${offlinePercentage}%` }}
              ></div>
            </div>
          </div>
          <div className="flex justify-between text-xs mt-1 text-gray-500">
            <span>🌐 Online ({onlinePercentage}%)</span>
            <span>🏢 Offline ({offlinePercentage}%)</span>
          </div>
        </div>

        {/* Summary */}
        <div className="mt-6 bg-green-50 dark:bg-green-950 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <Calendar className="h-4 w-4 mr-2 text-green-600" />
            <span className="font-medium text-green-800 dark:text-green-200">Experience Summary</span>
          </div>
          <p className="text-sm text-green-700 dark:text-green-300">
            Completed a total of <strong>{totalMonths} months</strong> of internship experience across{" "}
            <strong>{fields.length} different fields</strong>, with a balanced mix of{" "}
            <strong>{onlineMonths} months online</strong> and <strong>{offlineMonths} months offline</strong> training.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
