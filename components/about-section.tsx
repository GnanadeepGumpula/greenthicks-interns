import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf, Users, Award, Target } from "lucide-react"

export function AboutSection() {
  return (
    <section id="about" className="py-16 bg-green-50 dark:bg-green-950">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">About Green Thicks</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            We are committed to bridging the gap between fresh farm produce and your table, while nurturing the next
            generation of professionals through our comprehensive internship programs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="text-center">
            <CardHeader>
              <Leaf className="h-8 w-8 mx-auto text-green-600 mb-2" />
              <CardTitle className="text-lg">Fresh & Natural</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Direct from farm to table, ensuring the freshest produce for our customers
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="h-8 w-8 mx-auto text-green-600 mb-2" />
              <CardTitle className="text-lg">Internship Program</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Comprehensive training programs in various fields including technology and agriculture
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Award className="h-8 w-8 mx-auto text-green-600 mb-2" />
              <CardTitle className="text-lg">Certified Training</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Industry-recognized certificates with QR code verification for authenticity
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Target className="h-8 w-8 mx-auto text-green-600 mb-2" />
              <CardTitle className="text-lg">Career Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Focused on building careers and providing real-world experience</CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg">
          <h3 className="text-2xl font-bold mb-4 text-center">Our Mission</h3>
          <p className="text-gray-600 dark:text-gray-300 text-center max-w-3xl mx-auto">
            To provide sustainable, fresh agricultural products while empowering young professionals through hands-on
            internship experiences in technology, agriculture, and business development. We believe in nurturing talent
            and creating opportunities for growth in the modern agricultural landscape.
          </p>
        </div>
      </div>
    </section>
  )
}
