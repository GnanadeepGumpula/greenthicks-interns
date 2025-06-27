import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Mail, Phone, User, Users, ExternalLink, Award } from "lucide-react"
import { InternshipStats } from "@/components/internship-stats"

interface InternshipField {
  field: string
  startDate: string
  endDate: string
  duration: number // or string
  mode: "online" | "offline"
  projectVideos: string[]
}

interface InternData {
  id: string
  name: string
  email: string
  phone: string
  dateOfBirth: string
  fatherName: string
  motherName: string
  photo: string
  linkedinProfile: string
  internshipFields: InternshipField[]
  totalMonthsCompleted: number
  onlineMonthsCompleted: number
  offlineMonthsCompleted: number
  certificateIssueDate: string
}

interface InternProfileProps {
  intern: InternData
}

function calculateDuration(start: string, end: string): number {
  const startDate = new Date(start)
  const endDate = new Date(end)
  const months =
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    (endDate.getMonth() - startDate.getMonth())
  return months + 1 // include the starting month
}

export function InternProfile({ intern }: InternProfileProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header Card */}
        <Card className="mb-8">
          <CardHeader className="text-center">
            <div className="flex flex-col items-center space-y-4">
              <Image
                src={intern.photo || "/placeholder.svg"}
                alt={intern.name}
                width={150}
                height={150}
                className="rounded-full border-4 border-green-200"
              />
              <div>
                <CardTitle className="text-3xl font-bold text-green-800 dark:text-green-200">{intern.name}</CardTitle>
                <CardDescription className="text-lg">Intern ID: {intern.id}</CardDescription>
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                <Badge variant="secondary" className="bg-green-100 text-green-800 text-sm px-4 py-2">
                  <Award className="h-4 w-4 mr-2" />
                  Total: {intern.totalMonthsCompleted} Months
                </Badge>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-sm px-4 py-2">
                  Online: {intern.onlineMonthsCompleted} Months
                </Badge>
                <Badge variant="secondary" className="bg-orange-100 text-orange-800 text-sm px-4 py-2">
                  Offline: {intern.offlineMonthsCompleted} Months
                </Badge>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Personal Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2 text-green-600" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">Email:</span>
                  <span className="font-medium">{intern.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">Phone:</span>
                  <span className="font-medium">{intern.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">Date of Birth:</span>
                  <span className="font-medium">{new Date(intern.dateOfBirth).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">Father's Name:</span>
                  <span className="font-medium">{intern.fatherName}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">Mother's Name:</span>
                  <span className="font-medium">{intern.motherName}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <ExternalLink className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">LinkedIn:</span>
                  <Link
                    href={intern.linkedinProfile}
                    target="_blank"
                    className="font-medium text-blue-600 hover:text-blue-800"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Internship Statistics */}
        <InternshipStats
          totalMonths={intern.totalMonthsCompleted}
          onlineMonths={intern.onlineMonthsCompleted}
          offlineMonths={intern.offlineMonthsCompleted}
          fields={intern.internshipFields}
        />

        {/* Internship Fields */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="h-5 w-5 mr-2 text-green-600" />
              Internship Experience
            </CardTitle>
            <CardDescription>
              Completed {intern.totalMonthsCompleted} months across {intern.internshipFields.length} different fields (
              {intern.onlineMonthsCompleted} online, {intern.offlineMonthsCompleted} offline)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {intern.internshipFields.map((field, index) => (
                <div key={index} className="border rounded-lg p-6 bg-gray-50 dark:bg-gray-800">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <h3 className="text-xl font-semibold text-green-700 dark:text-green-300">{field.field}</h3>
                    <div className="flex gap-2 mt-2 md:mt-0">
                      <Badge variant="outline" className="w-fit">
                        {field.duration ? `${field.duration} months` : "Duration not available"}
                      </Badge>

                      <Badge
                        variant="outline"
                        className={`w-fit ${field.mode === "online" ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-orange-50 text-orange-700 border-orange-200"}`}
                      >
                        {field.mode === "online" ? "🌐 Online" : "🏢 Offline"}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-300">Start Date:</span>
                      <p className="font-medium">{new Date(field.startDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-300">End Date:</span>
                      <p className="font-medium">{new Date(field.endDate).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {field.projectVideos.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-3">Project Videos:</h4>
                      <div className="flex flex-wrap gap-2">
                        {field.projectVideos.map((video, videoIndex) => (
                          <Button
                            key={videoIndex}
                            variant="outline"
                            size="sm"
                            asChild
                            className="bg-white text-blue-600 border-blue-600 hover:bg-blue-50"
                          >
                            <Link href={video} target="_blank">
                              <ExternalLink className="h-3 w-3 mr-1" />
                              Project {videoIndex + 1}
                            </Link>
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Certificate Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="h-5 w-5 mr-2 text-green-600" />
              Certificate Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-green-50 dark:bg-green-950 rounded-lg p-6 text-center">
              <h3 className="text-lg font-semibold mb-2">Certificate Verified ✓</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                This certificate was issued on {new Date(intern.certificateIssueDate).toLocaleDateString()}
                and has been verified through our secure QR code system.
              </p>
              <div className="flex justify-center">
                <Badge className="bg-green-600 text-white px-4 py-2">Authentic Certificate</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
