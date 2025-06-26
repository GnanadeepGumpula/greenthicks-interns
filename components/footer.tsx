import Link from "next/link"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Image src="/logo.png" alt="Green Thicks Logo" width={32} height={32} className="h-8 w-auto" />
              <span className="font-bold text-lg">Green Thicks</span>
            </div>
            <p className="text-gray-400 text-sm">
              Fresh from Farm to Table - Building careers through comprehensive internship programs.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/#about" className="text-gray-400 hover:text-white">
                  About
                </Link>
              </li>
              <li>
                <Link href="/#support" className="text-gray-400 hover:text-white">
                  Support
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-gray-400 hover:text-white">
                  Admin
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="text-gray-400">Certificate Verification</span>
              </li>
              <li>
                <span className="text-gray-400">Internship Programs</span>
              </li>
              <li>
                <span className="text-gray-400">Career Development</span>
              </li>
              <li>
                <span className="text-gray-400">Fresh Produce</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>support@greenthicks.com</li>
              <li>+1 (555) 123-4567</li>
              <li>
                123 Farm Street
                <br />
                Green Valley, CA 90210
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2024 Green Thicks. All rights reserved. Fresh from Farm to Table.</p>
        </div>
      </div>
    </footer>
  )
}
