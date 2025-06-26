"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Plus, Trash2, Upload, X } from "lucide-react"

interface InternshipField {
  field: string
  startDate: string
  endDate: string
  mode: "online" | "offline"
  projectVideos: string[]
}

export function InternForm() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string>("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    fatherName: "",
    motherName: "",
    linkedinProfile: "",
    photo: "",
  })
  const [internshipFields, setInternshipFields] = useState<InternshipField[]>([
    { field: "", startDate: "", endDate: "", mode: "online", projectVideos: [""] },
  ])

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file size (1MB = 1024 * 1024 bytes)
    if (file.size > 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select an image smaller than 1MB",
        variant: "destructive",
      })
      return
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid File Type",
        description: "Please select an image file",
        variant: "destructive",
      })
      return
    }

    setPhotoFile(file)

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPhotoPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const removePhoto = () => {
    setPhotoFile(null)
    setPhotoPreview("")
    setFormData({ ...formData, photo: "" })
  }

  const addInternshipField = () => {
    setInternshipFields([
      ...internshipFields,
      { field: "", startDate: "", endDate: "", mode: "online", projectVideos: [""] },
    ])
  }

  const removeInternshipField = (index: number) => {
    setInternshipFields(internshipFields.filter((_, i) => i !== index))
  }

  const updateInternshipField = (index: number, field: string, value: string) => {
    const updated = [...internshipFields]
    updated[index] = { ...updated[index], [field]: value }
    setInternshipFields(updated)
  }

  const addProjectVideo = (fieldIndex: number) => {
    const updated = [...internshipFields]
    updated[fieldIndex].projectVideos.push("")
    setInternshipFields(updated)
  }

  const updateProjectVideo = (fieldIndex: number, videoIndex: number, value: string) => {
    const updated = [...internshipFields]
    updated[fieldIndex].projectVideos[videoIndex] = value
    setInternshipFields(updated)
  }

  const removeProjectVideo = (fieldIndex: number, videoIndex: number) => {
    const updated = [...internshipFields]
    updated[fieldIndex].projectVideos = updated[fieldIndex].projectVideos.filter((_, i) => i !== videoIndex)
    setInternshipFields(updated)
  }

  const uploadPhoto = async (file: File): Promise<string> => {
    // In production, upload to cloud storage (Cloudinary, AWS S3, etc.)
    // For demo, we'll return a placeholder URL
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("/placeholder.svg?height=200&width=200")
      }, 1000)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      let photoUrl = formData.photo

      // Upload photo if selected
      if (photoFile) {
        photoUrl = await uploadPhoto(photoFile)
      }

      // Calculate total months and breakdown by mode
      const monthsBreakdown = internshipFields.reduce(
        (totals, field) => {
          if (field.startDate && field.endDate && field.mode) {
            const start = new Date(field.startDate)
            const end = new Date(field.endDate)
            const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())
            const validMonths = Math.max(0, months)

            if (field.mode === "online") {
              totals.online += validMonths
            } else {
              totals.offline += validMonths
            }
            totals.total += validMonths
          }
          return totals
        },
        { online: 0, offline: 0, total: 0 },
      )

      const internData = {
        ...formData,
        photo: photoUrl,
        internshipFields: internshipFields.filter((field) => field.field.trim()),
        totalMonthsCompleted: monthsBreakdown.total,
        onlineMonthsCompleted: monthsBreakdown.online,
        offlineMonthsCompleted: monthsBreakdown.offline,
        certificateIssueDate: new Date().toISOString().split("T")[0],
      }

      const response = await fetch("/api/sheets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(internData),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Intern Added Successfully",
          description: `Intern created with ID: ${result.data.id}`,
        })

        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          dateOfBirth: "",
          fatherName: "",
          motherName: "",
          linkedinProfile: "",
          photo: "",
        })
        setInternshipFields([{ field: "", startDate: "", endDate: "", mode: "online", projectVideos: [""] }])
        setPhotoFile(null)
        setPhotoPreview("")
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add intern. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Intern</CardTitle>
        <CardDescription>Create a new intern profile that will be saved to Google Sheets</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Photo Upload */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Photo Upload</h3>
            <div className="flex items-center gap-4">
              {photoPreview ? (
                <div className="relative">
                  <img
                    src={photoPreview || "/placeholder.svg"}
                    alt="Preview"
                    className="w-20 h-20 rounded-full object-cover border-2 border-green-200"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                    onClick={removePhoto}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                  <Upload className="h-8 w-8 text-gray-400" />
                </div>
              )}
              <div>
                <Label htmlFor="photo">Upload Photo (Max 1MB)</Label>
                <Input id="photo" type="file" accept="image/*" onChange={handlePhotoUpload} className="mt-1" />
                <p className="text-xs text-gray-500 mt-1">Supported formats: JPG, PNG, GIF (Max size: 1MB)</p>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Personal Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="fatherName">Father's Name *</Label>
                <Input
                  id="fatherName"
                  value={formData.fatherName}
                  onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="motherName">Mother's Name *</Label>
                <Input
                  id="motherName"
                  value={formData.motherName}
                  onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="linkedinProfile">LinkedIn Profile</Label>
                <Input
                  id="linkedinProfile"
                  value={formData.linkedinProfile}
                  onChange={(e) => setFormData({ ...formData, linkedinProfile: e.target.value })}
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
            </div>
          </div>

          {/* Internship Fields */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Internship Experience</h3>
              <Button type="button" onClick={addInternshipField} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Field
              </Button>
            </div>

            {internshipFields.map((field, fieldIndex) => (
              <Card key={fieldIndex} className="p-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Internship Field {fieldIndex + 1}</h4>
                    {internshipFields.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeInternshipField(fieldIndex)}
                        variant="outline"
                        size="sm"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid md:grid-cols-4 gap-4">
                    <div>
                      <Label>Field Name *</Label>
                      <Input
                        value={field.field}
                        onChange={(e) => updateInternshipField(fieldIndex, "field", e.target.value)}
                        placeholder="e.g., Frontend Development"
                        required
                      />
                    </div>
                    <div>
                      <Label>Mode *</Label>
                      <select
                        value={field.mode}
                        onChange={(e) => updateInternshipField(fieldIndex, "mode", e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        required
                      >
                        <option value="">Select Mode</option>
                        <option value="online">Online</option>
                        <option value="offline">Offline</option>
                      </select>
                    </div>
                    <div>
                      <Label>Start Date *</Label>
                      <Input
                        type="date"
                        value={field.startDate}
                        onChange={(e) => updateInternshipField(fieldIndex, "startDate", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label>End Date *</Label>
                      <Input
                        type="date"
                        value={field.endDate}
                        onChange={(e) => updateInternshipField(fieldIndex, "endDate", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Label>Project Video Links</Label>
                      <Button type="button" onClick={() => addProjectVideo(fieldIndex)} variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Video
                      </Button>
                    </div>
                    {field.projectVideos.map((video, videoIndex) => (
                      <div key={videoIndex} className="flex gap-2 mb-2">
                        <Input
                          value={video}
                          onChange={(e) => updateProjectVideo(fieldIndex, videoIndex, e.target.value)}
                          placeholder="https://linkedin.com/posts/project-video"
                        />
                        {field.projectVideos.length > 1 && (
                          <Button
                            type="button"
                            onClick={() => removeProjectVideo(fieldIndex, videoIndex)}
                            variant="outline"
                            size="sm"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Button type="submit" disabled={isLoading} className="w-full bg-green-600 hover:bg-green-700">
            {isLoading ? "Adding Intern..." : "Add Intern"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
