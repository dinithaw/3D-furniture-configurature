"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Navbar from "@/components/navbar"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"

export default function ProductsPage() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState<"user" | "admin" | null>(null)
  const [showLogin, setShowLogin] = useState(false)
  const [cart, setCart] = useState<Array<{ id: number; name: string; price: string; quantity: number }>>([])
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [showProductDetails, setShowProductDetails] = useState(false)
  const { toast } = useToast()

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
      image: "/images/products/modern_sofa.jpg",
      price: "$899",
      category: "Living Room",
    },
    {
      id: 2,
      name: "Dining Table",
      description: "Elegant dining table with solid wood construction.",
      image: "/images/products/dining_table.jpg",
      price: "$649",
      category: "Dining Room",
    },
    {
      id: 3,
      name: "Bedside Lamp",
      description: "Stylish lamp with adjustable brightness settings.",
      image: "/images/products/bedside_lamp.jpg",
      price: "$129",
      category: "Bedroom",
    },
    {
      id: 4,
      name: "Office Chair",
      description: "Ergonomic chair with lumbar support and adjustable height.",
      image: "/images/products/office_chair.jpg",
      price: "$349",
      category: "Office",
    },
    {
      id: 5,
      name: "Coffee Table",
      description: "Modern coffee table with storage compartments.",
      image: "/images/products/coffee_table.jpg",
      price: "$299",
      category: "Living Room",
    },
    {
      id: 6,
      name: "Bookshelf",
      description: "Spacious bookshelf with adjustable shelves.",
      image: "/images/products/book_shelf.jpg",
      price: "$249",
      category: "Living Room",
    },
  ]

  const addToCart = (product: any) => {
    const existingItem = cart.find((item) => item.id === product.id)

    if (existingItem) {
      // Update quantity if product already in cart
      setCart(cart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)))
    } else {
      // Add new product to cart
      setCart([...cart, { ...product, quantity: 1 }])
    }

    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart`,
    })
  }

  const viewProductDetails = (product: any) => {
    setSelectedProduct(product)
    setShowProductDetails(true)
  }

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
                <Button variant="outline" onClick={() => viewProductDetails(product)}>
                  Details
                </Button>
                <Button onClick={() => addToCart(product)}>Add to Cart</Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button size="lg" className="bg-amber-600 hover:bg-amber-700" onClick={() => router.push("/")}>
            Try Our Furniture Configurator
          </Button>
        </div>

        {/* Product Details Dialog */}
        {selectedProduct && (
          <Dialog open={showProductDetails} onOpenChange={setShowProductDetails}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{selectedProduct.name}</DialogTitle>
                <DialogDescription>{selectedProduct.category}</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                <div>
                  <img
                    src={selectedProduct.image || "/placeholder.svg"}
                    alt={selectedProduct.name}
                    className="w-full h-48 object-cover rounded-md"
                  />
                </div>
                <div className="space-y-4">
                  <p>{selectedProduct.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-amber-600">{selectedProduct.price}</span>
                    <Button
                      onClick={() => {
                        addToCart(selectedProduct)
                        setShowProductDetails(false)
                      }}
                    >
                      Add to Cart
                    </Button>
                  </div>
                  <div className="pt-4 border-t mt-4">
                    <h4 className="font-medium mb-2">Product Specifications</h4>
                    <ul className="text-sm space-y-1">
                      <li>
                        <span className="font-medium">Material:</span> Premium quality
                      </li>
                      <li>
                        <span className="font-medium">Dimensions:</span> Varies by model
                      </li>
                      <li>
                        <span className="font-medium">Warranty:</span> 2 years
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Cart Indicator */}
        {cart.length > 0 && (
          <div className="fixed bottom-4 right-4 bg-amber-600 text-white p-4 rounded-full shadow-lg z-10">
            <div className="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cart.reduce((total, item) => total + item.quantity, 0)}
              </span>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
