"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { useMobile } from "@/hooks/use-mobile"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const isMobile = useMobile()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Image src="/logo.png" alt="Green Thicks Logo" width={40} height={40} className="h-10 w-auto" />
          <span className="font-bold text-xl">Green Thicks</span>
        </Link>

        {isMobile ? (
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        ) : (
          <nav className="flex items-center space-x-6">
            <Link href="/" className="text-sm font-medium hover:text-primary">
              Home
            </Link>
            <Link href="/#about" className="text-sm font-medium hover:text-primary">
              About
            </Link>
            <Link href="/#support" className="text-sm font-medium hover:text-primary">
              Support
            </Link>
            <Link href="/admin" className="text-sm font-medium hover:text-primary">
              Admin
            </Link>
            <ThemeToggle />
          </nav>
        )}
      </div>

      {isMobile && isMenuOpen && (
        <div className="border-t bg-background p-4">
          <nav className="flex flex-col space-y-4">
            <Link href="/" className="text-sm font-medium hover:text-primary" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
            <Link
              href="/#about"
              className="text-sm font-medium hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/#support"
              className="text-sm font-medium hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Support
            </Link>
            <Link href="/admin" className="text-sm font-medium hover:text-primary" onClick={() => setIsMenuOpen(false)}>
              Admin
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
