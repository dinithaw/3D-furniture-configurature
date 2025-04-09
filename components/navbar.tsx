"use client"

import { Button } from "@/components/ui/button"
import { LogIn, LogOut, User } from "lucide-react"
import Link from "next/link"

interface NavbarProps {
  isLoggedIn: boolean
  userRole: "user" | "admin" | null
  onLoginClick: () => void
  onLogout: () => void
  activePage?: string
}

export default function Navbar({ isLoggedIn, userRole, onLoginClick, onLogout, activePage = "home" }: NavbarProps) {
  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-700 rounded-md flex items-center justify-center text-white font-bold text-xl">
              FC
            </div>
            <span className="text-xl font-bold">FurniCraft</span>
          </Link>

          <nav className="hidden md:flex ml-8">
            <ul className="flex gap-6">
              <li>
                <Link
                  href="/"
                  className={`${activePage === "home" ? "text-amber-600 font-medium" : "text-gray-600"} hover:text-amber-600`}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className={`${activePage === "products" ? "text-amber-600 font-medium" : "text-gray-600"} hover:text-amber-600`}
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  href="/gallery"
                  className={`${activePage === "gallery" ? "text-amber-600 font-medium" : "text-gray-600"} hover:text-amber-600`}
                >
                  Gallery
                </Link>
              </li>
              <li>
                <Link
                  href="/canvas"
                  className={`${activePage === "canvas" ? "text-amber-600 font-medium" : "text-gray-600"} hover:text-amber-600`}
                >
                  2D Canvas
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className={`${activePage === "about" ? "text-amber-600 font-medium" : "text-gray-600"} hover:text-amber-600`}
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className={`${activePage === "contact" ? "text-amber-600 font-medium" : "text-gray-600"} hover:text-amber-600`}
                >
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span>{userRole === "admin" ? "Administrator" : "User"}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={onLogout} className="flex items-center gap-1">
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" onClick={onLoginClick} className="flex items-center gap-1">
              <LogIn className="h-4 w-4" />
              <span>Login</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
