"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Download, QrCode, Copy } from "lucide-react"

export function QRCodeGenerator() {
  const { toast } = useToast()
  const [internId, setInternId] = useState("")
  const [qrCodeUrl, setQrCodeUrl] = useState("")
  const [profileUrl, setProfileUrl] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const generateQRCode = async () => {
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

    setIsGenerating(true)
    try {
      const profileUrl = `${window.location.origin}/intern/${internId}`
      setProfileUrl(profileUrl)

      // Generate QR code using QR Server API
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&format=png&data=${encodeURIComponent(profileUrl)}&bgcolor=FFFFFF&color=000000&margin=10`

      setQrCodeUrl(qrUrl)

      toast({
        title: "QR Code Generated",
        description: "QR code has been generated successfully",
      })
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate QR code. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadQRCode = async () => {
    if (!qrCodeUrl) return

    try {
      const response = await fetch(qrCodeUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `qr-code-intern-${internId}.png`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: "Download Started",
        description: "QR code download has started",
      })
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download QR code. Please try again.",
        variant: "destructive",
      })
    }
  }

  const copyProfileUrl = async () => {
    if (!profileUrl) return

    try {
      await navigator.clipboard.writeText(profileUrl)
      toast({
        title: "URL Copied",
        description: "Profile URL copied to clipboard",
      })
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy URL to clipboard",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <QrCode className="h-5 w-5 mr-2" />
            Generate QR Code
          </CardTitle>
          <CardDescription>
            Create a QR code for an intern's certificate that links to their profile page
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="internId">Intern Unique ID</Label>
            <Input
              id="internId"
              value={internId}
              onChange={(e) => setInternId(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="Enter 6-digit intern ID"
              maxLength={6}
            />
            <p className="text-xs text-gray-500 mt-1">Only numbers allowed, exactly 6 digits</p>
          </div>

          <Button onClick={generateQRCode} disabled={isGenerating} className="w-full bg-green-600 hover:bg-green-700">
            {isGenerating ? "Generating..." : "Generate QR Code"}
          </Button>

          {profileUrl && (
            <div className="space-y-2">
              <Label>Profile URL</Label>
              <div className="flex gap-2">
                <Input value={profileUrl} readOnly className="text-xs" />
                <Button onClick={copyProfileUrl} size="sm" variant="outline">
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
          )}

          {qrCodeUrl && (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">QR Code for Intern ID: {internId}</p>
                <div className="bg-white p-4 rounded-lg inline-block">
                  <img
                    src={qrCodeUrl || "/placeholder.svg"}
                    alt="Generated QR Code"
                    className="mx-auto"
                    width={300}
                    height={300}
                  />
                </div>
              </div>

              <Button
                onClick={downloadQRCode}
                variant="outline"
                className="w-full bg-white text-green-600 border-green-600 hover:bg-green-50"
              >
                <Download className="h-4 w-4 mr-2" />
                Download QR Code (PNG)
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>QR Code Instructions</CardTitle>
          <CardDescription>How to use the generated QR codes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3 text-sm">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold">
                1
              </div>
              <div>
                <p className="font-medium">Enter Intern ID</p>
                <p className="text-gray-600 dark:text-gray-300">Input the unique 6-digit ID assigned to the intern</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold">
                2
              </div>
              <div>
                <p className="font-medium">Generate QR Code</p>
                <p className="text-gray-600 dark:text-gray-300">
                  Click generate to create a QR code that links to their profile
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold">
                3
              </div>
              <div>
                <p className="font-medium">Download & Use</p>
                <p className="text-gray-600 dark:text-gray-300">Download the QR code and embed it in the certificate</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold">
                4
              </div>
              <div>
                <p className="font-medium">Verification</p>
                <p className="text-gray-600 dark:text-gray-300">
                  Anyone can scan the QR code to verify the certificate authenticity
                </p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
            <p className="text-sm text-green-800 dark:text-green-200">
              <strong>Tip:</strong> The QR code will direct users to the intern's profile page where they can view all
              certificate details and verify authenticity.
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Quality:</strong> QR codes are generated in high resolution (300x300px) suitable for printing on
              certificates.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
