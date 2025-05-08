"use client"

import type React from "react"

import { useState, useEffect, useRef, Suspense, useCallback } from "react"
import { Canvas, useThree } from "@react-three/fiber"
import { OrbitControls, Environment, Grid, ContactShadows } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Sofa, Table, Lamp, Armchair, Save, Undo, Redo, Download, Camera, Upload } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import Room from "@/components/room"
import FurnitureItemComponent from "@/components/furniture-item"
import ColorPicker from "@/components/color-picker"
import { FurnitureControls } from "@/components/furniture-controls"
import Navbar from "@/components/navbar"
import LoginForm from "@/components/login-form"
import FloorTextureSelector from "@/components/floor-texture-selector"

// Define types for our state
interface FurnitureItem {
  id: string
  type: string
  position: [number, number, number]
  rotation: [number, number, number]
  scale: [number, number, number]
  color: string
}

interface RoomConfig {
  dimensions: {
    width: number
    length: number
    height: number
  }
  wallColor: string
  floorColor: string
  floorPattern: "solid" | "tiles" | "wood" | "marble"
  floorTextureScale: number
  floorTextureRotation: number
}

interface AppState {
  furniture: FurnitureItem[]
  room: RoomConfig
  selectedFurnitureId: string | null
}

interface SavedDesign {
  name: string
  timestamp: number
  state: AppState
}

// Component to capture screenshot
function ScreenshotButton({ onScreenshotTaken }: { onScreenshotTaken: (dataUrl: string) => void }) {
  const { gl, scene, camera } = useThree()

  useEffect(() => {
    // Render scene
    gl.render(scene, camera)

    // Get canvas data
    const screenshot = gl.domElement.toDataURL("image/png")

    // Pass the screenshot data to the parent component
    onScreenshotTaken(screenshot)
  }, [gl, scene, camera, onScreenshotTaken])

  return null
}

export default function FurnitureConfigurator() {
  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState<"user" | "admin" | null>(null)
  const [showLogin, setShowLogin] = useState(false)

  // Main state
  const [selectedFurniture, setSelectedFurniture] = useState<string | null>(null)
  const [furnitureItems, setFurnitureItems] = useState<FurnitureItem[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [roomDimensions, setRoomDimensions] = useState({ width: 10, length: 10, height: 3 })
  const [wallColor, setWallColor] = useState("#F5F5F5")
  const [floorColor, setFloorColor] = useState("#e0d2c0")
  const [floorPattern, setFloorPattern] = useState<"solid" | "tiles" | "wood" | "marble">("solid")
  const [floorTextureScale, setFloorTextureScale] = useState(1)
  const [floorTextureRotation, setFloorTextureRotation] = useState(0)

  // State for save dialog
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [designName, setDesignName] = useState("")

  // State for undo/redo
  const [history, setHistory] = useState<AppState[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [isUndoRedoAction, setIsUndoRedoAction] = useState(false)

  // State for screenshot
  const [takingScreenshot, setTakingScreenshot] = useState(false)

  // File input ref for import
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Toast notifications
  const { toast } = useToast()

  // Ref to track if we should add to history
  const shouldAddToHistory = useRef(true)

  // Initialize history with initial state
  useEffect(() => {
    const initialState: AppState = {
      furniture: [],
      room: {
        dimensions: roomDimensions,
        wallColor,
        floorColor,
        floorPattern: "solid",
        floorTextureScale: 1,
        floorTextureRotation: 0,
      },
      selectedFurnitureId: null,
    }
    setHistory([initialState])
    setHistoryIndex(0)

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

  // Handle login
  const handleLogin = (username: string, password: string) => {
    if (username === "admin" && password === "admin123") {
      setIsLoggedIn(true)
      setUserRole("admin")
      setShowLogin(false)
      // Store login state in localStorage
      localStorage.setItem("furnicraft_user", JSON.stringify({ username, role: "admin" }))
      toast({
        title: "Logged In",
        description: "Welcome, Administrator!",
      })
    } else if (username === "user" && password === "user123") {
      setIsLoggedIn(true)
      setUserRole("user")
      setShowLogin(false)
      // Store login state in localStorage
      localStorage.setItem("furnicraft_user", JSON.stringify({ username, role: "user" }))
      toast({
        title: "Logged In",
        description: "Welcome! You're logged in as a user.",
      })
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid username or password",
        variant: "destructive",
      })
    }
  }

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("furnicraft_user")
    setIsLoggedIn(false)
    setUserRole(null)
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
    })
  }

  // Update history when state changes (except during undo/redo)
  useEffect(() => {
    if (!isUndoRedoAction && shouldAddToHistory.current) {
      const currentState: AppState = {
        furniture: furnitureItems,
        room: {
          dimensions: roomDimensions,
          wallColor,
          floorColor,
          floorPattern,
          floorTextureScale,
          floorTextureRotation,
        },
        selectedFurnitureId: selectedFurniture,
      }

      // Add new state to history, removing any future states if we're not at the end
      setHistory((prevHistory) => {
        const newHistory = prevHistory.slice(0, historyIndex + 1)
        return [...newHistory, currentState]
      })
      setHistoryIndex((prevIndex) => prevIndex + 1)
    }

    // Reset the flag
    setIsUndoRedoAction(false)
  }, [furnitureItems, roomDimensions, wallColor, floorColor, floorPattern, floorTextureScale, floorTextureRotation])

  // Undo function
  const handleUndo = () => {
    if (historyIndex > 0) {
      setIsUndoRedoAction(true)
      const newIndex = historyIndex - 1
      const previousState = history[newIndex]

      // Apply the previous state
      setFurnitureItems(previousState.furniture)
      setRoomDimensions(previousState.room.dimensions)
      setWallColor(previousState.room.wallColor)
      setFloorColor(previousState.room.floorColor)
      setFloorPattern(previousState.room.floorPattern || "solid")
      setFloorTextureScale(previousState.room.floorTextureScale || 1)
      setFloorTextureRotation(previousState.room.floorTextureRotation || 0)
      setSelectedFurniture(previousState.selectedFurnitureId)

      setHistoryIndex(newIndex)

      toast({
        title: "Undo",
        description: "Previous action undone",
      })
    } else {
      toast({
        title: "Cannot Undo",
        description: "No more actions to undo",
        variant: "destructive",
      })
    }
  }

  // Redo function
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setIsUndoRedoAction(true)
      const newIndex = historyIndex + 1
      const nextState = history[newIndex]

      // Apply the next state
      setFurnitureItems(nextState.furniture)
      setRoomDimensions(nextState.room.dimensions)
      setWallColor(nextState.room.wallColor)
      setFloorColor(nextState.room.floorColor)
      setFloorPattern(nextState.room.floorPattern || "solid")
      setFloorTextureScale(nextState.room.floorTextureScale || 1)
      setFloorTextureRotation(nextState.room.floorTextureRotation || 0)
      setSelectedFurniture(nextState.selectedFurnitureId)

      setHistoryIndex(newIndex)

      toast({
        title: "Redo",
        description: "Action redone",
      })
    } else {
      toast({
        title: "Cannot Redo",
        description: "No more actions to redo",
        variant: "destructive",
      })
    }
  }

  // Save design function
  const saveDesign = () => {
    if (!designName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name for your design",
        variant: "destructive",
      })
      return
    }

    const currentState: AppState = {
      furniture: furnitureItems,
      room: {
        dimensions: roomDimensions,
        wallColor,
        floorColor,
        floorPattern,
        floorTextureScale,
        floorTextureRotation,
      },
      selectedFurnitureId: selectedFurniture,
    }

    const design: SavedDesign = {
      name: designName,
      timestamp: Date.now(),
      state: currentState,
    }

    // Get existing saved designs
    const savedDesignsJSON = localStorage.getItem("furnitureDesigns")
    let savedDesigns: SavedDesign[] = []

    if (savedDesignsJSON) {
      savedDesigns = JSON.parse(savedDesignsJSON)
    }

    // Add new design
    savedDesigns.push(design)

    // Save back to localStorage
    localStorage.setItem("furnitureDesigns", JSON.stringify(savedDesigns))

    // Close dialog and reset name
    setSaveDialogOpen(false)
    setDesignName("")

    toast({
      title: "Design Saved",
      description: `"${designName}" has been saved successfully`,
    })
  }

  // Export/Download function
  const exportDesign = () => {
    const currentState: AppState = {
      furniture: furnitureItems,
      room: {
        dimensions: roomDimensions,
        wallColor,
        floorColor,
        floorPattern,
        floorTextureScale,
        floorTextureRotation,
      },
      selectedFurnitureId: null, // Don't include selection in export
    }

    // Create a Blob with the JSON data
    const blob = new Blob([JSON.stringify(currentState, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)

    // Create a link and trigger download
    const a = document.createElement("a")
    a.href = url
    a.download = `furniture-design-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(a)
    a.click()

    // Clean up
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Design Exported",
      description: "Your design has been exported as JSON",
    })
  }

  // Import function
  const handleImport = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  // Handle file selection for import
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const importedState = JSON.parse(event.target?.result as string) as AppState

        // Validate the imported state
        if (!importedState.furniture || !importedState.room) {
          throw new Error("Invalid design file format")
        }

        // Apply the imported state
        setFurnitureItems(importedState.furniture)
        setRoomDimensions(importedState.room.dimensions)
        setWallColor(importedState.room.wallColor)
        setFloorColor(importedState.room.floorColor)
        setFloorPattern(importedState.room.floorPattern || "solid")
        setFloorTextureScale(importedState.room.floorTextureScale || 1)
        setFloorTextureRotation(importedState.room.floorTextureRotation || 0)

        // Add to history
        shouldAddToHistory.current = true

        toast({
          title: "Design Imported",
          description: "Your design has been imported successfully",
        })
      } catch (error) {
        toast({
          title: "Import Failed",
          description: "The selected file is not a valid design file",
          variant: "destructive",
        })
      }
    }
    reader.readAsText(file)

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Screenshot function
  const takeScreenshot = () => {
    setTakingScreenshot(true)
  }

  // Handle screenshot taken
  const handleScreenshotTaken = useCallback(
    (dataUrl: string) => {
      // Create a link and trigger download
      const link = document.createElement("a")
      link.href = dataUrl
      link.download = `furniture-design-${new Date().toISOString().slice(0, 10)}.png`
      link.click()

      setTakingScreenshot(false)

      toast({
        title: "Screenshot Taken",
        description: "Your design has been saved as an image",
      })
    },
    [toast],
  )

  // Update the addFurniture function to provide better default scales for the new models
  const addFurniture = (type: string) => {
    shouldAddToHistory.current = true

    // Set appropriate default positions and scales based on furniture type
    let defaultPosition: [number, number, number] = [0, 0, 0]
    let defaultScale: [number, number, number] = [1, 1, 1]

    switch (type) {
      case "sofa":
        defaultPosition = [0, 0, 0]
        defaultScale = [0.5, 0.5, 0.5]
        break
      case "table":
        defaultPosition = [0, 0, 0]
        defaultScale = [0.5, 0.5, 0.5]
        break
      case "chair":
        defaultPosition = [0, 0, 0]
        defaultScale = [0.5, 0.5, 0.5]
        break
      case "lamp":
        defaultPosition = [0, 0, 0]
        defaultScale = [0.5, 0.5, 0.5]
        break
    }

    const newItem = {
      id: `${type}-${Date.now()}`,
      type,
      position: defaultPosition,
      rotation: [0, 0, 0] as [number, number, number],
      scale: defaultScale,
      color: "#8B4513",
    }

    setFurnitureItems([...furnitureItems, newItem])
    setSelectedFurniture(newItem.id)
  }

  const updateFurniture = (id: string, updates: any) => {
    shouldAddToHistory.current = true
    setFurnitureItems(furnitureItems.map((item) => (item.id === id ? { ...item, ...updates } : item)))
  }

  const selectedItem = furnitureItems.find((item) => item.id === selectedFurniture)

  // Add a delete furniture function
  const deleteFurniture = (id: string) => {
    shouldAddToHistory.current = true
    setFurnitureItems(furnitureItems.filter((item) => item.id !== id))
    setSelectedFurniture(null)
  }

  // If not logged in, show login prompt
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar
          isLoggedIn={isLoggedIn}
          userRole={userRole}
          onLoginClick={() => setShowLogin(true)}
          onLogout={handleLogout}
          activePage="home"
        />
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)]">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold text-center mb-6">Welcome to FurniCraft</h2>
              <p className="text-center mb-6 text-gray-600 dark:text-gray-300">
                Please log in to use the furniture configurator
              </p>
              <div className="flex flex-col gap-4">
                <Button onClick={() => setShowLogin(true)}>Log In</Button>
                <div className="text-sm text-gray-500 dark:text-gray-300 text-center">
                  <p className="mb-1">For demo purposes:</p>
                  <p>Admin login: admin / admin123</p>
                  <p>User login: user / user123</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {showLogin && (
          <Dialog open={showLogin} onOpenChange={setShowLogin}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Log In</DialogTitle>
                <DialogDescription>Enter your credentials to access the furniture configurator</DialogDescription>
              </DialogHeader>
              <LoginForm onLogin={handleLogin} />
            </DialogContent>
          </Dialog>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <Navbar
        isLoggedIn={isLoggedIn}
        userRole={userRole}
        onLoginClick={() => setShowLogin(true)}
        onLogout={handleLogout}
        activePage="home"
      />

      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          className={`bg-card border-r relative ${
            sidebarOpen ? "h-auto md:w-80" : "h-0 md:w-0"
          } transition-all duration-300 overflow-hidden ${sidebarOpen ? "border-b md:border-b-0" : ""}`}
        >
          <div className="p-4 h-full flex flex-col">
            <h1 className="text-2xl font-bold mb-6">Furniture Configurator</h1>

            <Tabs defaultValue="furniture" className="flex-1 flex flex-col">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="furniture">Furniture</TabsTrigger>
                <TabsTrigger value="materials">Materials</TabsTrigger>
                <TabsTrigger value="room">Room</TabsTrigger>
              </TabsList>

              <TabsContent value="furniture" className="flex-1 overflow-auto">
                <div className="grid grid-cols-2 gap-4">
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
                      <Armchair className="h-12 w-12 mb-2 text-gray-700" />
                      <span>Chair</span>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="materials" className="flex-1 overflow-auto">
                {selectedItem ? (
                  <div className="space-y-4">
                    <h3 className="font-medium">Color</h3>
                    <ColorPicker
                      color={selectedItem.color}
                      onChange={(color) => updateFurniture(selectedItem.id, { color })}
                    />
                  </div>
                ) : (
                  <div className="text-center text-gray-500 dark:text-gray-300 mt-8">
                    Select a furniture item to customize materials
                  </div>
                )}
              </TabsContent>

              <TabsContent value="room" className="flex-1 overflow-auto">
                <div className="space-y-4">
                  <h3 className="font-medium">Room Size</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Width</span>
                      <span>{roomDimensions.width}m</span>
                    </div>
                    <Slider
                      value={[roomDimensions.width]}
                      max={20}
                      step={0.5}
                      onValueChange={(value) => {
                        shouldAddToHistory.current = true
                        setRoomDimensions({ ...roomDimensions, width: value[0] })
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Length</span>
                      <span>{roomDimensions.length}m</span>
                    </div>
                    <Slider
                      value={[roomDimensions.length]}
                      max={20}
                      step={0.5}
                      onValueChange={(value) => {
                        shouldAddToHistory.current = true
                        setRoomDimensions({ ...roomDimensions, length: value[0] })
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Height</span>
                      <span>{roomDimensions.height}m</span>
                    </div>
                    <Slider
                      value={[roomDimensions.height]}
                      max={5}
                      step={0.1}
                      onValueChange={(value) => {
                        shouldAddToHistory.current = true
                        setRoomDimensions({ ...roomDimensions, height: value[0] })
                      }}
                    />
                  </div>

                  <h3 className="font-medium mt-6">Wall Color</h3>
                  <ColorPicker
                    color={wallColor}
                    onChange={(color) => {
                      shouldAddToHistory.current = true
                      setWallColor(color)
                    }}
                  />

                  <h3 className="font-medium mt-6">Floor</h3>
                  <FloorTextureSelector
                    floorColor={floorColor}
                    floorPattern={floorPattern}
                    floorTextureScale={floorTextureScale}
                    floorTextureRotation={floorTextureRotation}
                    onColorChange={(color) => {
                      shouldAddToHistory.current = true
                      setFloorColor(color)
                    }}
                    onPatternChange={(pattern) => {
                      shouldAddToHistory.current = true
                      setFloorPattern(pattern)
                    }}
                    onScaleChange={(scale) => {
                      shouldAddToHistory.current = true
                      setFloorTextureScale(scale)
                    }}
                    onRotationChange={(rotation) => {
                      shouldAddToHistory.current = true
                      setFloorTextureRotation(rotation)
                    }}
                  />
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-4 pt-4 border-t flex flex-wrap gap-2">
              <Button variant="outline" size="icon" onClick={handleUndo} disabled={historyIndex <= 0} title="Undo">
                <Undo className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleRedo}
                disabled={historyIndex >= history.length - 1}
                title="Redo"
              >
                <Redo className="h-4 w-4" />
              </Button>
              <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="icon" title="Save Design">
                    <Save className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Save Design</DialogTitle>
                    <DialogDescription>Give your design a name to save it for later.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Name
                      </Label>
                      <Input
                        id="name"
                        value={designName}
                        onChange={(e) => setDesignName(e.target.value)}
                        className="col-span-3"
                        placeholder="My Living Room"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" onClick={saveDesign}>
                      Save Design
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button variant="outline" size="icon" onClick={exportDesign} title="Export Design">
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleImport} title="Import Design">
                <Upload className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={takeScreenshot} title="Save as Image">
                <Camera className="h-4 w-4" />
              </Button>

              {/* Hidden file input for import */}
              <input
                type="file"
                ref={fileInputRef}
                accept=".json"
                style={{ display: "none" }}
                onChange={handleFileSelect}
              />

              {/* Admin-only buttons would go here */}
              {userRole === "admin" && (
                <div className="ml-auto">
                  <Button variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
                    Admin Panel
                  </Button>
                </div>
              )}
            </div>
          </div>

          <Button
            variant="secondary"
            size="icon"
            className="absolute md:-right-4 md:top-1/2 bottom-0 right-0 md:bottom-auto md:transform md:-translate-y-1/2 rounded-full shadow-md z-10"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? (
              <ChevronLeft className="h-4 w-4 hidden md:block" />
            ) : (
              <ChevronRight className="h-4 w-4 hidden md:block" />
            )}
            <span className="md:hidden">{sidebarOpen ? "Close" : "Open"} Controls</span>
          </Button>
        </div>

        {/* 3D Canvas */}
        <div className="flex-1 relative">
          <Canvas shadows camera={{ position: [5, 5, 5], fov: 50 }}>
            <Suspense fallback={null}>
              <ambientLight intensity={0.5} />
              <directionalLight
                position={[10, 10, 5]}
                intensity={1}
                castShadow
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
              />

              <Room
                dimensions={roomDimensions}
                wallColor={wallColor}
                floorColor={floorColor}
                floorPattern={floorPattern}
                floorTextureScale={floorTextureScale}
                floorTextureRotation={floorTextureRotation}
              />

              {furnitureItems.map((item) => (
                <FurnitureItemComponent
                  key={item.id}
                  item={item}
                  isSelected={selectedFurniture === item.id}
                  onClick={() => setSelectedFurniture(item.id)}
                  onUpdate={(updates) => updateFurniture(item.id, updates)}
                />
              ))}

              <ContactShadows position={[0, -0.01, 0]} opacity={0.4} scale={20} blur={1.5} far={4.5} />
              <Grid infiniteGrid fadeDistance={30} />
              <Environment preset="apartment" />
              <OrbitControls enableDamping dampingFactor={0.05} minPolarAngle={0} maxPolarAngle={Math.PI / 2} />

              {takingScreenshot && <ScreenshotButton onScreenshotTaken={handleScreenshotTaken} />}
            </Suspense>
          </Canvas>

          {selectedItem && (
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4">
              <FurnitureControls
                item={selectedItem}
                onUpdate={(updates) => updateFurniture(selectedItem.id, updates)}
                onDelete={() => deleteFurniture(selectedItem.id)}
              />
            </div>
          )}
        </div>

        {/* Toast for successful actions */}
        <div id="toast-container" className="fixed bottom-4 right-4 z-50"></div>
      </div>
    </div>
  )
}
