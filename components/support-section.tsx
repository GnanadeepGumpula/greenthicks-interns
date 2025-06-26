import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Phone, MapPin, Clock } from "lucide-react"

export function SupportSection() {
  return (
    <section id="support" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Support & Contact</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Need help with certificate verification or have questions about our internship program? We're here to assist
            you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="text-center">
            <CardHeader>
              <Mail className="h-8 w-8 mx-auto text-green-600 mb-2" />
              <CardTitle className="text-lg">Email Support</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">Get help via email</CardDescription>
              <Button
                variant="outline"
                size="sm"
                className="bg-white text-green-600 border-green-600 hover:bg-green-50"
              >
                support@greenthicks.com
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Phone className="h-8 w-8 mx-auto text-green-600 mb-2" />
              <CardTitle className="text-lg">Phone Support</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">Call us directly</CardDescription>
              <Button
                variant="outline"
                size="sm"
                className="bg-white text-green-600 border-green-600 hover:bg-green-50"
              >
                +1 (555) 123-4567
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <MapPin className="h-8 w-8 mx-auto text-green-600 mb-2" />
              <CardTitle className="text-lg">Office Location</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                123 Farm Street
                <br />
                Green Valley, CA 90210
                <br />
                United States
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Clock className="h-8 w-8 mx-auto text-green-600 mb-2" />
              <CardTitle className="text-lg">Business Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Monday - Friday
                <br />
                9:00 AM - 6:00 PM PST
                <br />
                Weekend: By appointment
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="bg-green-50 dark:bg-green-950 rounded-lg p-8 text-center">
          <h3 className="text-xl font-bold mb-4">Certificate Verification Issues?</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            If you're having trouble verifying a certificate or accessing intern information, please contact our support
            team with the certificate details.
          </p>
          <Button className="bg-green-600 hover:bg-green-700">Contact Support</Button>
        </div>
      </div>
    </section>
  )
}
