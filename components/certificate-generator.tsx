"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { FileText, Download, Eye } from "lucide-react"

export function CertificateGenerator() {
  const { toast } = useToast()
  const [internId, setInternId] = useState("")
  const [templateFile, setTemplateFile] = useState<File | null>(null)
  const [templatePreview, setTemplatePreview] = useState<string>("")
  const [certificateText, setCertificateText] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedCertificate, setGeneratedCertificate] = useState<string>("")

  const handleTemplateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file size (5MB limit for templates)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select a template smaller than 5MB",
        variant: "destructive",
      })
      return
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid File Type",
        description: "Please select an image file (PNG, JPG, etc.)",
        variant: "destructive",
      })
      return
    }

    setTemplateFile(file)

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setTemplatePreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    toast({
      title: "Template Uploaded",
      description: "Certificate template uploaded successfully",
    })
  }

  const fetchInternData = async (id: string) => {
    try {
      const response = await fetch(`/api/sheets?q=${id}`)
      const data = await response.json()

      if (data.success) {
        return data.data
      } else {
        throw new Error("Intern not found")
      }
    } catch (error) {
      throw new Error("Failed to fetch intern data")
    }
  }

  const generateQRCode = async (internId: string) => {
    const profileUrl = `${window.location.origin}/intern/${internId}`
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&format=png&data=${encodeURIComponent(profileUrl)}&bgcolor=FFFFFF&color=000000&margin=5`
  }

  const generateCertificate = async () => {
    if (!internId.trim()) {
      toast({
        title: "ID Required",
        description: "Please enter an intern ID",
        variant: "destructive",
      })
      return
    }

    if (internId.length !== 6) {
      toast({
        title: "Invalid ID",
        description: "Intern ID must be exactly 6 digits",
        variant: "destructive",
      })
      return
    }

    if (!templateFile) {
      toast({
        title: "Template Required",
        description: "Please upload a certificate template",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    try {
      // Fetch intern data
      const internData = await fetchInternData(internId)

      // Generate QR code
      const qrCodeUrl = await generateQRCode(internId)

      // In a real application, you would:
      // 1. Use Canvas API or a library like fabric.js to overlay text and QR code
      // 2. Position elements based on template layout
      // 3. Generate final certificate as PDF or high-res image

      // For demo purposes, we'll simulate the process
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Set a mock generated certificate URL
      setGeneratedCertificate(templatePreview)

      toast({
        title: "Certificate Generated",
        description: `Certificate created successfully for ${internData.name}`,
      })
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate certificate",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadCertificate = async () => {
    if (!generatedCertificate) return

    try {
      // In production, this would download the actual generated certificate
      const link = document.createElement("a")
      link.href = generatedCertificate
      link.download = `certificate-${internId}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "Download Started",
        description: "Certificate download has started",
      })
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download certificate",
        variant: "destructive",
      })
    }
  }

  const previewInternProfile = () => {
    if (!internId.trim()) {
      toast({
        title: "ID Required",
        description: "Please enter an intern ID to preview",
        variant: "destructive",
      })
      return
    }

    window.open(`/intern/${internId}`, "_blank")
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Certificate Generator
          </CardTitle>
          <CardDescription>Create certificates with QR codes using custom templates</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="certInternId">Intern Unique ID</Label>
            <div className="flex gap-2">
              <Input
                id="certInternId"
                value={internId}
                onChange={(e) => setInternId(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="Enter 6-digit intern ID"
                maxLength={6}
              />
              <Button onClick={previewInternProfile} size="sm" variant="outline" disabled={!internId.trim()}>
                <Eye className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-1">Click the eye icon to preview intern profile</p>
          </div>

          <div>
            <Label htmlFor="templateFile">Certificate Template</Label>
            <Input id="templateFile" type="file" accept="image/*" onChange={handleTemplateUpload} className="mt-1" />
            <p className="text-xs text-gray-500 mt-1">Upload PNG, JPG, or other image formats (Max 5MB)</p>
          </div>

          <div>
            <Label htmlFor="certificateText">Additional Certificate Text</Label>
            <Textarea
              id="certificateText"
              value={certificateText}
              onChange={(e) => setCertificateText(e.target.value)}
              placeholder="Enter any additional text to include on the certificate..."
              rows={4}
            />
          </div>

          <Button
            onClick={generateCertificate}
            disabled={isGenerating || !templateFile || !internId.trim()}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {isGenerating ? "Generating Certificate..." : "Generate Certificate"}
          </Button>

          {generatedCertificate && (
            <Button
              onClick={downloadCertificate}
              variant="outline"
              className="w-full bg-white text-green-600 border-green-600 hover:bg-green-50"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Certificate
            </Button>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Certificate Preview</CardTitle>
          <CardDescription>Preview of the certificate template</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center min-h-[400px] flex items-center justify-center">
            {templatePreview ? (
              <div className="space-y-4 w-full">
                <img
                  src={templatePreview || "/placeholder.svg"}
                  alt="Certificate Template"
                  className="max-w-full h-auto rounded-lg shadow-lg"
                  onError={(e) => {
                    e.currentTarget.style.display = "none"
                    e.currentTarget.nextElementSibling?.classList.remove("hidden")
                  }}
                />
                <div className="hidden text-red-500">Failed to load template image</div>
                {isGenerating && (
                  <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
                      <p className="text-sm">Generating certificate...</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-gray-500">
                <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>Certificate preview will appear here</p>
                <p className="text-sm">Upload a template to see the preview</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Certificate Generation Process</CardTitle>
          <CardDescription>How the certificate generation works</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-3">
                1
              </div>
              <h4 className="font-medium mb-2">Fetch Data</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Retrieve intern information from Google Sheets using the provided ID
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-3">
                2
              </div>
              <h4 className="font-medium mb-2">Generate QR</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Create a QR code that links to the intern's verification page
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-3">
                3
              </div>
              <h4 className="font-medium mb-2">Apply Template</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Overlay intern details and QR code on the certificate template
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-3">
                4
              </div>
              <h4 className="font-medium mb-2">Download</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Generate final certificate as PDF or high-resolution image
              </p>
            </div>
          </div>

          <div className="mt-6 bg-green-50 dark:bg-green-950 p-4 rounded-lg">
            <h4 className="font-medium mb-2 text-green-800 dark:text-green-200">Template Requirements:</h4>
            <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
              <li>• Recommended size: 1920x1080 pixels or A4 dimensions</li>
              <li>• Format: PNG, JPG, or PDF</li>
              <li>• Leave space for QR code (typically bottom right corner)</li>
              <li>• Include placeholders for name, dates, and other dynamic content</li>
              <li>• Maximum file size: 5MB</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
