"use client"

import { Button } from "@/components/ui/button"
import { LogIn, LogOut, User, Menu } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { ThemeSwitcher } from "@/components/theme-switcher"

interface NavbarProps {
  isLoggedIn: boolean
  userRole: "user" | "admin" | null
  onLoginClick: () => void
  onLogout: () => void
  activePage?: string
}

export default function Navbar({ isLoggedIn, userRole, onLoginClick, onLogout, activePage = "home" }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-background border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="FurniCraft logo" className="w-10 h-10 rounded-md object-cover" />
            <span className="text-xl font-bold">FurniCraft</span>
          </Link>

          <nav className="hidden md:flex ml-8">
            <ul className="flex gap-6">
              <li>
                <Link
                  href="/"
                  className={`${activePage === "home" ? "text-amber-600 font-medium" : "text-foreground"} hover:text-amber-600`}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className={`${activePage === "products" ? "text-amber-600 font-medium" : "text-foreground"} hover:text-amber-600`}
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  href="/gallery"
                  className={`${activePage === "gallery" ? "text-amber-600 font-medium" : "text-foreground"} hover:text-amber-600`}
                >
                  Gallery
                </Link>
              </li>
              <li>
                <Link
                  href="/canvas"
                  className={`${activePage === "canvas" ? "text-amber-600 font-medium" : "text-foreground"} hover:text-amber-600`}
                >
                  2D Designer
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className={`${activePage === "about" ? "text-amber-600 font-medium" : "text-foreground"} hover:text-amber-600`}
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className={`${activePage === "contact" ? "text-amber-600 font-medium" : "text-foreground"} hover:text-amber-600`}
                >
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <ThemeSwitcher />

          {isLoggedIn ? (
            <div className="hidden md:flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>{userRole === "admin" ? "Administrator" : "User"}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={onLogout} className="flex items-center gap-1">
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" onClick={onLoginClick} className="hidden md:flex items-center gap-1">
              <LogIn className="h-4 w-4" />
              <span>Login</span>
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background border-t py-4 px-4 shadow-md">
          <nav className="space-y-4">
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className={`${activePage === "home" ? "text-amber-600 font-medium" : "text-foreground"} hover:text-amber-600 block`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className={`${activePage === "products" ? "text-amber-600 font-medium" : "text-foreground"} hover:text-amber-600 block`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  href="/gallery"
                  className={`${activePage === "gallery" ? "text-amber-600 font-medium" : "text-foreground"} hover:text-amber-600 block`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Gallery
                </Link>
              </li>
              <li>
                <Link
                  href="/canvas"
                  className={`${activePage === "canvas" ? "text-amber-600 font-medium" : "text-foreground"} hover:text-amber-600 block`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  2D Designer
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className={`${activePage === "about" ? "text-amber-600 font-medium" : "text-foreground"} hover:text-amber-600 block`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className={`${activePage === "contact" ? "text-amber-600 font-medium" : "text-foreground"} hover:text-amber-600 block`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
                </Link>
              </li>
            </ul>

            {isLoggedIn ? (
              <div className="pt-3 border-t flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>{userRole === "admin" ? "Administrator" : "User"}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onLogout}
                  className="flex items-center gap-1 w-full justify-center"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </div>
            ) : (
              <div className="pt-3 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onLoginClick}
                  className="flex items-center gap-1 w-full justify-center"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
