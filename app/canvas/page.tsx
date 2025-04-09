"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/hooks/use-toast"
import { Sofa, Table, Lamp, Save, Download, Trash2, Square, RectangleVerticalIcon as Rectangle } from "lucide-react"
import ColorPicker from "@/components/color-picker"
import Canvas2D from "@/components/canvas-2d"

// Define furniture item type
interface FurnitureItem2D {
  id: string
  type: string
  x: number
  y: number
  width: number
  height: number
  color: string
  rotation: number
  zIndex: number
}

export default function Canvas2DPage() {
  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState<"user" | "admin" | null>(null)
  const [showLogin, setShowLogin] = useState(false)

  // Canvas state
  const [canvasShape, setCanvasShape] = useState<"square" | "rectangle">("square")
  const [canvasWidth, setCanvasWidth] = useState(600)
  const [canvasHeight, setCanvasHeight] = useState(600)
  const [canvasColor, setCanvasColor] = useState("#FFFFFF")
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null)

  // Furniture state
  const [furnitureItems, setFurnitureItems] = useState<FurnitureItem2D[]>([])
  const [selectedFurnitureId, setSelectedFurnitureId] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  // File input ref
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Toast notifications
  const { toast } = useToast()

  // Check localStorage for login state on client side
  useEffect(() => {
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

  // Handle canvas shape change
  const handleShapeChange = (shape: "square" | "rectangle") => {
    setCanvasShape(shape)
    if (shape === "square") {
      setCanvasHeight(canvasWidth)
    } else {
      setCanvasHeight(Math.floor(canvasWidth * 0.75)) // 4:3 aspect ratio
    }
  }

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const img = new Image()
        img.onload = () => {
          setBackgroundImage(event.target?.result as string)
          toast({
            title: "Image Uploaded",
            description: "Background image has been set",
          })
        }
        img.src = event.target?.result as string
      }
      reader.readAsDataURL(file)
    }
  }

  // Add furniture to canvas
  const addFurniture = (type: string) => {
    const newItem: FurnitureItem2D = {
      id: `${type}-${Date.now()}`,
      type,
      x: canvasWidth / 2 - 50,
      y: canvasHeight / 2 - 50,
      width: type === "sofa" ? 150 : type === "table" ? 120 : 60,
      height: type === "sofa" ? 80 : type === "table" ? 120 : 60,
      color: type === "sofa" ? "#8B4513" : type === "table" ? "#A0522D" : "#FFD700",
      rotation: 0,
      zIndex: furnitureItems.length + 1,
    }

    setFurnitureItems([...furnitureItems, newItem])
    setSelectedFurnitureId(newItem.id)

    toast({
      title: "Furniture Added",
      description: `Added ${type} to canvas`,
    })
  }

  // Update furniture position
  const updateFurniturePosition = (id: string, x: number, y: number) => {
    setFurnitureItems(furnitureItems.map((item) => (item.id === id ? { ...item, x, y } : item)))
  }

  // Update furniture color
  const updateFurnitureColor = (id: string, color: string) => {
    setFurnitureItems(furnitureItems.map((item) => (item.id === id ? { ...item, color } : item)))
  }

  // Delete selected furniture
  const deleteSelectedFurniture = () => {
    if (selectedFurnitureId) {
      setFurnitureItems(furnitureItems.filter((item) => item.id !== selectedFurnitureId))
      setSelectedFurnitureId(null)

      toast({
        title: "Furniture Removed",
        description: "Item has been removed from canvas",
      })
    }
  }

  // Save canvas as image
  const saveCanvasAsImage = () => {
    const canvas = document.getElementById("furniture-canvas") as HTMLCanvasElement
    if (canvas) {
      const link = document.createElement("a")
      link.download = `furniture-design-${new Date().toISOString().slice(0, 10)}.png`
      link.href = canvas.toDataURL("image/png")
      link.click()

      toast({
        title: "Design Saved",
        description: "Your design has been saved as an image",
      })
    }
  }

  // Get selected furniture
  const selectedFurniture = selectedFurnitureId ? furnitureItems.find((item) => item.id === selectedFurnitureId) : null

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar
        isLoggedIn={isLoggedIn}
        userRole={userRole}
        onLoginClick={() => setShowLogin(true)}
        onLogout={handleLogout}
        activePage="canvas"
      />

      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">2D Canvas Designer</h1>
        <p className="text-gray-600 mb-8">Create a 2D layout of your furniture design</p>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Canvas Controls */}
          <div className="w-full lg:w-1/4">
            <Card>
              <CardContent className="p-6">
                <Tabs defaultValue="canvas" className="w-full">
                  <TabsList className="grid grid-cols-3 mb-4">
                    <TabsTrigger value="canvas">Canvas</TabsTrigger>
                    <TabsTrigger value="furniture">Furniture</TabsTrigger>
                    <TabsTrigger value="edit">Edit</TabsTrigger>
                  </TabsList>

                  {/* Canvas Tab */}
                  <TabsContent value="canvas" className="space-y-4">
                    <div className="space-y-2">
                      <Label>Canvas Shape</Label>
                      <div className="flex gap-2">
                        <Button
                          variant={canvasShape === "square" ? "default" : "outline"}
                          className="flex-1 flex items-center justify-center gap-2"
                          onClick={() => handleShapeChange("square")}
                        >
                          <Square className="h-4 w-4" />
                          <span>Square</span>
                        </Button>
                        <Button
                          variant={canvasShape === "rectangle" ? "default" : "outline"}
                          className="flex-1 flex items-center justify-center gap-2"
                          onClick={() => handleShapeChange("rectangle")}
                        >
                          <Rectangle className="h-4 w-4" />
                          <span>Rectangle</span>
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Canvas Color</Label>
                      <ColorPicker color={canvasColor} onChange={setCanvasColor} />
                    </div>

                    <div className="space-y-2">
                      <Label>Background Image</Label>
                      <div className="flex flex-col gap-2">
                        <input
                          type="file"
                          ref={fileInputRef}
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                        <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="w-full">
                          Upload Image
                        </Button>
                        {backgroundImage && (
                          <Button
                            variant="outline"
                            onClick={() => setBackgroundImage(null)}
                            className="w-full text-red-500"
                          >
                            Remove Image
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-2">
                      <Button variant="outline" className="flex items-center gap-2" onClick={saveCanvasAsImage}>
                        <Download className="h-4 w-4" />
                        <span>Export</span>
                      </Button>
                      <Button
                        className="flex items-center gap-2"
                        onClick={() => {
                          localStorage.setItem(
                            "canvas2d",
                            JSON.stringify({
                              shape: canvasShape,
                              width: canvasWidth,
                              height: canvasHeight,
                              color: canvasColor,
                              furniture: furnitureItems,
                            }),
                          )
                          toast({
                            title: "Design Saved",
                            description: "Your design has been saved",
                          })
                        }}
                      >
                        <Save className="h-4 w-4" />
                        <span>Save</span>
                      </Button>
                    </div>
                  </TabsContent>

                  {/* Furniture Tab */}
                  <TabsContent value="furniture" className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <Card className="cursor-pointer hover:bg-gray-50" onClick={() => addFurniture("sofa")}>
                        <CardContent className="p-4 flex flex-col items-center">
                          <Sofa className="h-12 w-12 mb-2 text-gray-700" />
                          <span>Sofa</span>
                        </CardContent>
                      </Card>
                      <Card className="cursor-pointer hover:bg-gray-50" onClick={() => addFurniture("table")}>
                        <CardContent className="p-4 flex flex-col items-center">
                          <Table className="h-12 w-12 mb-2 text-gray-700" />
                          <span>Table</span>
                        </CardContent>
                      </Card>
                      <Card className="cursor-pointer hover:bg-gray-50" onClick={() => addFurniture("lamp")}>
                        <CardContent className="p-4 flex flex-col items-center">
                          <Lamp className="h-12 w-12 mb-2 text-gray-700" />
                          <span>Lamp</span>
                        </CardContent>
                      </Card>
                      <Card className="cursor-pointer hover:bg-gray-50" onClick={() => addFurniture("chair")}>
                        <CardContent className="p-4 flex flex-col items-center">
                          <div className="h-12 w-12 mb-2 text-gray-700 flex items-center justify-center">🪑</div>
                          <span>Chair</span>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  {/* Edit Tab */}
                  <TabsContent value="edit" className="space-y-4">
                    {selectedFurniture ? (
                      <>
                        <div className="space-y-2">
                          <Label>Item Color</Label>
                          <ColorPicker
                            color={selectedFurniture.color}
                            onChange={(color) => updateFurnitureColor(selectedFurniture.id, color)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Rotation</Label>
                          <Slider
                            value={[selectedFurniture.rotation]}
                            min={0}
                            max={360}
                            step={5}
                            onValueChange={(value) => {
                              setFurnitureItems(
                                furnitureItems.map((item) =>
                                  item.id === selectedFurniture.id ? { ...item, rotation: value[0] } : item,
                                ),
                              )
                            }}
                          />
                          <div className="text-right text-sm text-gray-500">{selectedFurniture.rotation}°</div>
                        </div>
                        <Button
                          variant="destructive"
                          className="w-full mt-4 flex items-center justify-center gap-2"
                          onClick={deleteSelectedFurniture}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Delete Item</span>
                        </Button>
                      </>
                    ) : (
                      <div className="text-center text-gray-500 py-8">
                        Select a furniture item to edit its properties
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Canvas Area */}
          <div className="w-full lg:w-3/4 bg-white rounded-lg shadow-md overflow-hidden">
            <Canvas2D
              width={canvasWidth}
              height={canvasHeight}
              backgroundColor={canvasColor}
              backgroundImage={backgroundImage}
              furniture={furnitureItems}
              selectedFurnitureId={selectedFurnitureId}
              onSelectFurniture={setSelectedFurnitureId}
              onMoveFurniture={updateFurniturePosition}
            />
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-8 mt-8">
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
