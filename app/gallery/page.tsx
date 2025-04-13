"use client"

import { useState, useEffect } from "react"
import Navbar from "@/components/navbar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

export default function GalleryPage() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState<"user" | "admin" | null>(null)
  const [showLogin, setShowLogin] = useState(false)
  const [selectedGalleryItem, setSelectedGalleryItem] = useState<any>(null)
  const [showGalleryDetails, setShowGalleryDetails] = useState(false)

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

  const galleryItems = [
    {
      id: 1,
      title: "Modern Living Room",
      category: "living-room",
      image: "/placeholder.svg?height=400&width=600",
      description: "A contemporary living room with minimalist furniture and natural lighting.",
    },
    {
      id: 2,
      title: "Rustic Dining Area",
      category: "dining-room",
      image: "/placeholder.svg?height=400&width=600",
      description: "Farmhouse-style dining room with wooden table and vintage accessories.",
    },
    {
      id: 3,
      title: "Cozy Bedroom",
      category: "bedroom",
      image: "/placeholder.svg?height=400&width=600",
      description: "Warm and inviting bedroom with plush bedding and ambient lighting.",
    },
    {
      id: 4,
      title: "Home Office Setup",
      category: "office",
      image: "/placeholder.svg?height=400&width=600",
      description: "Productive workspace with ergonomic furniture and smart organization.",
    },
    {
      id: 5,
      title: "Scandinavian Kitchen",
      category: "kitchen",
      image: "/placeholder.svg?height=400&width=600",
      description: "Clean and functional kitchen with light wood and white accents.",
    },
    {
      id: 6,
      title: "Outdoor Patio",
      category: "outdoor",
      image: "/placeholder.svg?height=400&width=600",
      description: "Comfortable outdoor seating area perfect for entertaining guests.",
    },
    {
      id: 7,
      title: "Minimalist Apartment",
      category: "living-room",
      image: "/placeholder.svg?height=400&width=600",
      description: "Space-efficient design with multi-functional furniture pieces.",
    },
    {
      id: 8,
      title: "Executive Office",
      category: "office",
      image: "/placeholder.svg?height=400&width=600",
      description: "Professional office space with premium desk and storage solutions.",
    },
  ]

  const viewGalleryDetails = (item: any) => {
    setSelectedGalleryItem(item)
    setShowGalleryDetails(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar
        isLoggedIn={isLoggedIn}
        userRole={userRole}
        onLoginClick={() => setShowLogin(true)}
        onLogout={handleLogout}
        activePage="gallery"
      />

      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Design Gallery</h1>
        <p className="text-gray-600 mb-8">Explore our curated collection of interior designs</p>

        <Tabs defaultValue="all" className="mb-8">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="living-room">Living Room</TabsTrigger>
            <TabsTrigger value="dining-room">Dining Room</TabsTrigger>
            <TabsTrigger value="bedroom">Bedroom</TabsTrigger>
            <TabsTrigger value="office">Office</TabsTrigger>
            <TabsTrigger value="kitchen">Kitchen</TabsTrigger>
            <TabsTrigger value="outdoor">Outdoor</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              >
                <img src={item.image || "/placeholder.svg"} alt={item.title} className="w-full h-64 object-cover" />
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-600 mb-4">{item.description}</p>
                  <Button variant="outline" size="sm" onClick={() => viewGalleryDetails(item)}>
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </TabsContent>

          {["living-room", "dining-room", "bedroom", "office", "kitchen", "outdoor"].map((category) => (
            <TabsContent
              key={category}
              value={category}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {galleryItems
                .filter((item) => item.category === category)
                .map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                  >
                    <img src={item.image || "/placeholder.svg"} alt={item.title} className="w-full h-64 object-cover" />
                    <div className="p-4">
                      <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                      <p className="text-gray-600 mb-4">{item.description}</p>
                      <Button variant="outline" size="sm" onClick={() => viewGalleryDetails(item)}>
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
            </TabsContent>
          ))}
        </Tabs>

        <div className="mt-12 text-center">
          <Button size="lg" className="bg-amber-600 hover:bg-amber-700" onClick={() => router.push("/")}>
            Create Your Own Design
          </Button>
        </div>

        {/* Gallery Item Details Dialog */}
        {selectedGalleryItem && (
          <Dialog open={showGalleryDetails} onOpenChange={setShowGalleryDetails}>
            <DialogContent className="sm:max-w-[700px]">
              <DialogHeader>
                <DialogTitle>{selectedGalleryItem.title}</DialogTitle>
                <DialogDescription>Design Showcase</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                <div>
                  <img
                    src={selectedGalleryItem.image || "/placeholder.svg"}
                    alt={selectedGalleryItem.title}
                    className="w-full rounded-md shadow-md"
                  />
                </div>
                <div className="space-y-4">
                  <p className="text-gray-700">{selectedGalleryItem.description}</p>

                  <div className="pt-4 border-t mt-4">
                    <h4 className="font-medium mb-2">Design Elements</h4>
                    <ul className="text-sm space-y-2">
                      <li className="flex items-start">
                        <span className="bg-amber-100 text-amber-800 rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5">
                          1
                        </span>
                        <span>Premium materials selected for durability and style</span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-amber-100 text-amber-800 rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5">
                          2
                        </span>
                        <span>Ergonomic design for maximum comfort</span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-amber-100 text-amber-800 rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5">
                          3
                        </span>
                        <span>Carefully balanced color palette for visual harmony</span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-4 flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowGalleryDetails(false)}>
                      Close
                    </Button>
                    <Button
                      onClick={() => {
                        router.push("/")
                        setShowGalleryDetails(false)
                      }}
                    >
                      Try This Design
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
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
