"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Navbar from "@/components/navbar"
import { useRouter } from "next/navigation"

export default function ProductsPage() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState<"user" | "admin" | null>(null)
  const [showLogin, setShowLogin] = useState(false)

  // Move localStorage access to useEffect
  useEffect(() => {
    // Check localStorage for login state
    const storedUser = localStorage.getItem("furnicraft_user")
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser)
        setIsLoggedIn(true)
        setUserRole(user.role)
      } catch (e) {
        console.error("Error parsing user data from localStorage", e)
      }
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("furnicraft_user")
    setIsLoggedIn(false)
    setUserRole(null)
  }

  const products = [
    {
      id: 1,
      name: "Modern Sofa",
      description: "A comfortable modern sofa with customizable fabric options.",
      image: "/placeholder.svg?height=200&width=300",
      price: "$899",
      category: "Living Room",
    },
    {
      id: 2,
      name: "Dining Table",
      description: "Elegant dining table with solid wood construction.",
      image: "/placeholder.svg?height=200&width=300",
      price: "$649",
      category: "Dining Room",
    },
    {
      id: 3,
      name: "Bedside Lamp",
      description: "Stylish lamp with adjustable brightness settings.",
      image: "/placeholder.svg?height=200&width=300",
      price: "$129",
      category: "Bedroom",
    },
    {
      id: 4,
      name: "Office Chair",
      description: "Ergonomic chair with lumbar support and adjustable height.",
      image: "/placeholder.svg?height=200&width=300",
      price: "$349",
      category: "Office",
    },
    {
      id: 5,
      name: "Coffee Table",
      description: "Modern coffee table with storage compartments.",
      image: "/placeholder.svg?height=200&width=300",
      price: "$299",
      category: "Living Room",
    },
    {
      id: 6,
      name: "Bookshelf",
      description: "Spacious bookshelf with adjustable shelves.",
      image: "/placeholder.svg?height=200&width=300",
      price: "$249",
      category: "Living Room",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar
        isLoggedIn={isLoggedIn}
        userRole={userRole}
        onLoginClick={() => setShowLogin(true)}
        onLogout={handleLogout}
        activePage="products"
      />

      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Our Products</h1>
        <p className="text-gray-600 mb-8">Browse our collection of high-quality furniture</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <img src={product.image || "/placeholder.svg"} alt={product.name} className="w-full h-48 object-cover" />
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{product.name}</CardTitle>
                    <CardDescription>{product.category}</CardDescription>
                  </div>
                  <div className="text-lg font-bold text-amber-600">{product.price}</div>
                </div>
              </CardHeader>
              <CardContent>
                <p>{product.description}</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Details</Button>
                <Button>Add to Cart</Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button size="lg" className="bg-amber-600 hover:bg-amber-700" onClick={() => router.push("/")}>
            Try Our Furniture Configurator
          </Button>
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">FurniCraft</h3>
              <p className="text-gray-300">Quality furniture for every home and office.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <p className="text-gray-300">123 Furniture Lane</p>
              <p className="text-gray-300">Design District, CA 90210</p>
              <p className="text-gray-300">contact@furnicraft.com</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-white">
                  Instagram
                </a>
                <a href="#" className="text-gray-300 hover:text-white">
                  Facebook
                </a>
                <a href="#" className="text-gray-300 hover:text-white">
                  Twitter
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-300">
            <p>© 2023 FurniCraft. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
