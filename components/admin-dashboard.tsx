"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Users, QrCode, FileText, LogOut, Eye, Monitor, Building } from "lucide-react"
import { InternForm } from "@/components/intern-form"
import { QRCodeGenerator } from "@/components/qr-code-generator"
import { CertificateGenerator } from "@/components/certificate-generator"
import { InternsView } from "@/components/interns-view"
import { useToast } from "@/hooks/use-toast"

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/check")
      const data = await response.json()

      if (!data.authenticated) {
        router.push("/login")
        return
      }

      setIsAuthenticated(true)
    } catch (error) {
      router.push("/login")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out",
      })
      router.push("/login")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to logout",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Manage internship program, generate certificates, and create QR codes
            </p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="bg-white text-red-600 border-red-600 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="interns">Manage Interns</TabsTrigger>
            <TabsTrigger value="view">View All Interns</TabsTrigger>
            <TabsTrigger value="qrcodes">QR Codes</TabsTrigger>
            <TabsTrigger value="certificates">Certificates</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Interns</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24</div>
                  <p className="text-xs text-muted-foreground">+2 from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Online Months</CardTitle>
                  <Monitor className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">89</div>
                  <p className="text-xs text-muted-foreground">Total online training</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Offline Months</CardTitle>
                  <Building className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">67</div>
                  <p className="text-xs text-muted-foreground">Total offline training</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Certificates Issued</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">15</div>
                  <p className="text-xs text-muted-foreground">+3 this week</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common administrative tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline" onClick={() => setActiveTab("interns")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Intern
                  </Button>
                  <Button className="w-full justify-start" variant="outline" onClick={() => setActiveTab("view")}>
                    <Eye className="h-4 w-4 mr-2" />
                    View All Interns
                  </Button>
                  <Button className="w-full justify-start" variant="outline" onClick={() => setActiveTab("qrcodes")}>
                    <QrCode className="h-4 w-4 mr-2" />
                    Generate QR Code
                  </Button>
                  <Button
                    className="w-full justify-start"
                    variant="outline"
                    onClick={() => setActiveTab("certificates")}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Create Certificate
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest system activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>New intern added: John Doe</span>
                      <span className="text-gray-500">2 hours ago</span>
                    </div>
                    <div className="flex justify-between">
                      <span>QR code generated for ID: 123456</span>
                      <span className="text-gray-500">4 hours ago</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Certificate issued to Jane Smith</span>
                      <span className="text-gray-500">1 day ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="interns">
            <InternForm />
          </TabsContent>

          <TabsContent value="view">
            <InternsView />
          </TabsContent>

          <TabsContent value="qrcodes">
            <QRCodeGenerator />
          </TabsContent>

          <TabsContent value="certificates">
            <CertificateGenerator />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
