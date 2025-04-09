"use client"

import type React from "react"

import { useRef, useEffect, useState } from "react"

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

interface Canvas2DProps {
  width: number
  height: number
  backgroundColor: string
  backgroundImage: string | null
  furniture: FurnitureItem2D[]
  selectedFurnitureId: string | null
  onSelectFurniture: (id: string | null) => void
  onMoveFurniture: (id: string, x: number, y: number) => void
}

export default function Canvas2D({
  width,
  height,
  backgroundColor,
  backgroundImage,
  furniture,
  selectedFurnitureId,
  onSelectFurniture,
  onMoveFurniture,
}: Canvas2DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartX, setDragStartX] = useState(0)
  const [dragStartY, setDragStartY] = useState(0)
  const [draggedItemInitialX, setDraggedItemInitialX] = useState(0)
  const [draggedItemInitialY, setDraggedItemInitialY] = useState(0)

  // Load background image
  const backgroundImageObj = useRef<HTMLImageElement | null>(null)

  useEffect(() => {
    if (backgroundImage) {
      const img = new Image()
      img.src = backgroundImage
      img.onload = () => {
        backgroundImageObj.current = img
        drawCanvas()
      }
    } else {
      backgroundImageObj.current = null
      drawCanvas()
    }
  }, [backgroundImage])

  // Draw the canvas
  const drawCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Draw background
    ctx.fillStyle = backgroundColor
    ctx.fillRect(0, 0, width, height)

    // Draw background image if available
    if (backgroundImageObj.current) {
      const img = backgroundImageObj.current
      // Calculate dimensions to maintain aspect ratio and cover the canvas
      const imgRatio = img.width / img.height
      const canvasRatio = width / height

      let drawWidth,
        drawHeight,
        offsetX = 0,
        offsetY = 0

      if (imgRatio > canvasRatio) {
        // Image is wider than canvas (relative to height)
        drawHeight = height
        drawWidth = height * imgRatio
        offsetX = (width - drawWidth) / 2
      } else {
        // Image is taller than canvas (relative to width)
        drawWidth = width
        drawHeight = width / imgRatio
        offsetY = (height - drawHeight) / 2
      }

      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight)
    }

    // Sort furniture by zIndex
    const sortedFurniture = [...furniture].sort((a, b) => a.zIndex - b.zIndex)

    // Draw furniture
    sortedFurniture.forEach((item) => {
      ctx.save()

      // Translate to the center of the item for rotation
      ctx.translate(item.x + item.width / 2, item.y + item.height / 2)
      ctx.rotate((item.rotation * Math.PI) / 180)

      // Draw the item
      ctx.fillStyle = item.color

      // Draw different shapes based on furniture type
      switch (item.type) {
        case "sofa":
          // Draw sofa
          ctx.fillRect(-item.width / 2, -item.height / 2, item.width, item.height)

          // Draw sofa back
          ctx.fillStyle = adjustColor(item.color, -20)
          ctx.fillRect(-item.width / 2, -item.height / 2, item.width, item.height / 3)

          // Draw sofa arms
          ctx.fillRect(-item.width / 2, -item.height / 2, item.width / 8, item.height)
          ctx.fillRect(item.width / 2 - item.width / 8, -item.height / 2, item.width / 8, item.height)
          break

        case "table":
          // Draw table top
          ctx.fillRect(-item.width / 2, -item.height / 2, item.width, item.height)

          // Draw table legs
          ctx.fillStyle = adjustColor(item.color, -30)
          const legWidth = item.width / 10
          const legHeight = item.height / 10

          // Top-left leg
          ctx.fillRect(-item.width / 2, -item.height / 2, legWidth, legHeight)
          // Top-right leg
          ctx.fillRect(item.width / 2 - legWidth, -item.height / 2, legWidth, legHeight)
          // Bottom-left leg
          ctx.fillRect(-item.width / 2, item.height / 2 - legHeight, legWidth, legHeight)
          // Bottom-right leg
          ctx.fillRect(item.width / 2 - legWidth, item.height / 2 - legHeight, legWidth, legHeight)
          break

        case "lamp":
          // Draw lamp base
          ctx.fillStyle = adjustColor(item.color, -20)
          ctx.beginPath()
          ctx.arc(0, item.height / 4, item.width / 4, 0, Math.PI * 2)
          ctx.fill()

          // Draw lamp pole
          ctx.fillStyle = adjustColor(item.color, -10)
          ctx.fillRect(-item.width / 16, -item.height / 4, item.width / 8, item.height / 2)

          // Draw lamp shade
          ctx.fillStyle = item.color
          ctx.beginPath()
          ctx.arc(0, -item.height / 4, item.width / 3, 0, Math.PI * 2)
          ctx.fill()
          break

        case "chair":
          // Draw chair seat
          ctx.fillRect(-item.width / 2, -item.height / 2, item.width, item.height / 2)

          // Draw chair back
          ctx.fillStyle = adjustColor(item.color, -15)
          ctx.fillRect(-item.width / 2, -item.height / 2, item.width / 4, item.height)

          // Draw chair legs
          ctx.fillStyle = adjustColor(item.color, -30)
          const chairLegWidth = item.width / 16

          // Front-left leg
          ctx.fillRect(-item.width / 2 + item.width / 8, 0, chairLegWidth, item.height / 2)
          // Front-right leg
          ctx.fillRect(item.width / 2 - item.width / 8 - chairLegWidth, 0, chairLegWidth, item.height / 2)
          // Back-left leg
          ctx.fillRect(-item.width / 2, 0, chairLegWidth, item.height / 2)
          // Back-right leg
          ctx.fillRect(-item.width / 2 + item.width / 4 - chairLegWidth, 0, chairLegWidth, item.height / 2)
          break

        default:
          // Default rectangle
          ctx.fillRect(-item.width / 2, -item.height / 2, item.width, item.height)
      }

      // Draw selection outline if selected
      if (item.id === selectedFurnitureId) {
        ctx.strokeStyle = "#2563eb"
        ctx.lineWidth = 2
        ctx.strokeRect(-item.width / 2 - 2, -item.height / 2 - 2, item.width + 4, item.height + 4)

        // Draw rotation handle
        ctx.fillStyle = "#2563eb"
        ctx.beginPath()
        ctx.arc(0, -item.height / 2 - 15, 5, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.restore()
    })
  }

  // Helper function to adjust color brightness
  const adjustColor = (color: string, amount: number): string => {
    // Convert hex to RGB
    let r = Number.parseInt(color.substring(1, 3), 16)
    let g = Number.parseInt(color.substring(3, 5), 16)
    let b = Number.parseInt(color.substring(5, 7), 16)

    // Adjust RGB values
    r = Math.max(0, Math.min(255, r + amount))
    g = Math.max(0, Math.min(255, g + amount))
    b = Math.max(0, Math.min(255, b + amount))

    // Convert back to hex
    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`
  }

  // Handle mouse down
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Check if clicked on a furniture item
    const clickedItem = findClickedItem(x, y)

    if (clickedItem) {
      onSelectFurniture(clickedItem.id)
      setIsDragging(true)
      setDragStartX(x)
      setDragStartY(y)
      setDraggedItemInitialX(clickedItem.x)
      setDraggedItemInitialY(clickedItem.y)

      // Bring the clicked item to the front
      const updatedFurniture = furniture.map((item) => {
        if (item.id === clickedItem.id) {
          return { ...item, zIndex: Math.max(...furniture.map((i) => i.zIndex)) + 1 }
        }
        return item
      })

      // This will trigger a re-render with the updated zIndex
      if (JSON.stringify(updatedFurniture) !== JSON.stringify(furniture)) {
        // We need to update the parent component's state
        // This is a bit of a hack since we don't have a direct way to update zIndex
        const selectedItem = updatedFurniture.find((item) => item.id === clickedItem.id)
        if (selectedItem) {
          onMoveFurniture(selectedItem.id, selectedItem.x, selectedItem.y)
        }
      }
    } else {
      onSelectFurniture(null)
    }
  }

  // Handle mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas || !isDragging || !selectedFurnitureId) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const dx = x - dragStartX
    const dy = y - dragStartY

    const newX = Math.max(
      0,
      Math.min(
        width - (furniture.find((item) => item.id === selectedFurnitureId)?.width || 0),
        draggedItemInitialX + dx,
      ),
    )
    const newY = Math.max(
      0,
      Math.min(
        height - (furniture.find((item) => item.id === selectedFurnitureId)?.height || 0),
        draggedItemInitialY + dy,
      ),
    )

    onMoveFurniture(selectedFurnitureId, newX, newY)
  }

  // Handle mouse up
  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Find clicked item
  const findClickedItem = (x: number, y: number): FurnitureItem2D | null => {
    // Check in reverse order (top to bottom in z-index)
    for (let i = furniture.length - 1; i >= 0; i--) {
      const item = furniture[i]

      // Simple bounding box check (doesn't account for rotation)
      if (x >= item.x && x <= item.x + item.width && y >= item.y && y <= item.y + item.height) {
        return item
      }
    }
    return null
  }

  // Update canvas when props change
  useEffect(() => {
    drawCanvas()
  }, [width, height, backgroundColor, furniture, selectedFurnitureId])

  return (
    <div className="relative flex items-center justify-center p-4 bg-gray-100 min-h-[600px]">
      <canvas
        id="furniture-canvas"
        ref={canvasRef}
        width={width}
        height={height}
        className="border border-gray-300 shadow-md"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
    </div>
  )
}
