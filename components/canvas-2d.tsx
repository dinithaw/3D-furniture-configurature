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
  scale?: number // default 1
  shadowEnabled?: boolean
  shadowRotation?: number
  shadowOpacity?: number
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
  onUpdateFurniture?: (id: string, updates: Partial<FurnitureItem2D>) => void
}

// Add scale property to FurnitureItem2D interface
declare global {
  interface FurnitureItem2D {
    scale?: number // default 1
  }
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
  onUpdateFurniture,
}: Canvas2DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartX, setDragStartX] = useState(0)
  const [dragStartY, setDragStartY] = useState(0)
  const [draggedItemInitialX, setDraggedItemInitialX] = useState(0)
  const [draggedItemInitialY, setDraggedItemInitialY] = useState(0)

  // Load background image
  const backgroundImageObj = useRef<HTMLImageElement | null>(null)

  // State for image zoom and pan
  const [imgZoom, setImgZoom] = useState(1)
  const [imgPan, setImgPan] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const [panStart, setPanStart] = useState({ x: 0, y: 0 })
  const [imgPanStart, setImgPanStart] = useState({ x: 0, y: 0 })

  // Touch support for pan and pinch-to-zoom
  const lastTouchDist = useRef<number | null>(null)
  const lastTouchCenter = useRef<{ x: number; y: number } | null>(null)

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

  // Reset zoom/pan when image changes
  useEffect(() => {
    setImgZoom(1)
    setImgPan({ x: 0, y: 0 })
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
      // Calculate scale to fit the entire image within the canvas (contain)
      const imgRatio = img.width / img.height
      const canvasRatio = width / height

      let drawWidth, drawHeight
      if (imgRatio > canvasRatio) {
        drawWidth = width
        drawHeight = width / imgRatio
      } else {
        drawHeight = height
        drawWidth = height * imgRatio
      }

      // Apply zoom
      drawWidth *= imgZoom
      drawHeight *= imgZoom

      // Centered position with pan
      const offsetX = (width - drawWidth) / 2 + imgPan.x
      const offsetY = (height - drawHeight) / 2 + imgPan.y

      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight)
    }

    // Sort furniture by zIndex
    const sortedFurniture = [...furniture].sort((a, b) => a.zIndex - b.zIndex)

    // Draw furniture
    sortedFurniture.forEach((item) => {
      ctx.save()
      const scale = item.scale ?? 1
      ctx.translate(item.x + (item.width * scale) / 2, item.y + (item.height * scale) / 2)
      ctx.rotate((item.rotation * Math.PI) / 180)
      ctx.scale(scale, scale)
      // Draw custom shadow if enabled
      if (item.shadowEnabled) {
        ctx.save()
        // Calculate shadow orbit around the base, but always at or below the bottom of the model
        const angleRad = ((item.shadowRotation ?? 0) * Math.PI) / 180
        // Orbit radius for shadow
        const orbitRadius = item.height * 0.18
        // Calculate offset, but clamp Y so shadow never goes above the base (never in front)
        let shadowOffsetX = Math.cos(angleRad) * orbitRadius
        let shadowOffsetY = Math.max(0, Math.sin(angleRad) * orbitRadius)
        // Shadow length can be constant or slightly change for realism
        const shadowLength = item.height * 0.10
        ctx.globalAlpha = item.shadowOpacity ?? 0.3
        ctx.fillStyle = '#222'
        ctx.beginPath()
        ctx.ellipse(shadowOffsetX, item.height * 0.45 + shadowOffsetY, item.width * 0.38, shadowLength, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.globalAlpha = 1
        ctx.restore()
      }
      // Draw realistic furniture by type
      switch (item.type) {
        case "sofa": {
          // Realistic sofa: gradients, highlights, subtle shadow, plush look
          const sofaW = item.width
          const sofaH = item.height
          // --- SHADOW ---
          ctx.globalAlpha = 0.10
          ctx.fillStyle = '#222'
          ctx.beginPath()
          ctx.ellipse(0, sofaH * 0.43, sofaW * 0.36, sofaH * 0.07, 0, 0, Math.PI * 2)
          ctx.fill()
          ctx.globalAlpha = 1
          // --- BACK CUSHIONS ---
          const backCushionW = sofaW * 0.39
          const backCushionH = sofaH * 0.32
          const backCushionR = sofaH * 0.09
          const backCushionY = -sofaH * 0.28
          const backCushionGap = sofaW * 0.02
          // Left back cushion gradient
          let grad = ctx.createLinearGradient(0, backCushionY, 0, backCushionY + backCushionH)
          grad.addColorStop(0, adjustColor(item.color, 30))
          grad.addColorStop(1, adjustColor(item.color, -10))
          ctx.fillStyle = grad
          ctx.beginPath()
          ctx.moveTo(-backCushionW - backCushionGap/2 + backCushionR, backCushionY)
          ctx.lineTo(-backCushionGap/2 + backCushionW - backCushionR, backCushionY)
          ctx.quadraticCurveTo(-backCushionGap/2 + backCushionW, backCushionY, -backCushionGap/2 + backCushionW, backCushionY + backCushionR)
          ctx.lineTo(-backCushionGap/2 + backCushionW, backCushionY + backCushionH - backCushionR)
          ctx.quadraticCurveTo(-backCushionGap/2 + backCushionW, backCushionY + backCushionH, -backCushionGap/2 + backCushionW - backCushionR, backCushionY + backCushionH)
          ctx.lineTo(-backCushionW - backCushionGap/2 + backCushionR, backCushionY + backCushionH)
          ctx.quadraticCurveTo(-backCushionW - backCushionGap/2, backCushionY + backCushionH, -backCushionW - backCushionGap/2, backCushionY + backCushionH - backCushionR)
          ctx.lineTo(-backCushionW - backCushionGap/2, backCushionY + backCushionR)
          ctx.quadraticCurveTo(-backCushionW - backCushionGap/2, backCushionY, -backCushionW - backCushionGap/2 + backCushionR, backCushionY)
          ctx.closePath()
          ctx.fill()
          // Left back cushion highlight
          ctx.globalAlpha = 0.18
          ctx.fillStyle = '#fff'
          ctx.beginPath()
          ctx.ellipse(-sofaW*0.19, backCushionY + backCushionH*0.18, backCushionW*0.32, backCushionH*0.18, 0, Math.PI*1.1, Math.PI*1.9)
          ctx.fill()
          ctx.globalAlpha = 1
          // Right back cushion gradient
          grad = ctx.createLinearGradient(0, backCushionY, 0, backCushionY + backCushionH)
          grad.addColorStop(0, adjustColor(item.color, 30))
          grad.addColorStop(1, adjustColor(item.color, -10))
          ctx.fillStyle = grad
          ctx.beginPath()
          ctx.moveTo(backCushionGap/2 + backCushionR, backCushionY)
          ctx.lineTo(backCushionGap/2 + backCushionW - backCushionR, backCushionY)
          ctx.quadraticCurveTo(backCushionGap/2 + backCushionW, backCushionY, backCushionGap/2 + backCushionW, backCushionY + backCushionR)
          ctx.lineTo(backCushionGap/2 + backCushionW, backCushionY + backCushionH - backCushionR)
          ctx.quadraticCurveTo(backCushionGap/2 + backCushionW, backCushionY + backCushionH, backCushionGap/2 + backCushionW - backCushionR, backCushionY + backCushionH)
          ctx.lineTo(backCushionGap/2 + backCushionR, backCushionY + backCushionH)
          ctx.quadraticCurveTo(backCushionGap/2, backCushionY + backCushionH, backCushionGap/2, backCushionY + backCushionH - backCushionR)
          ctx.lineTo(backCushionGap/2, backCushionY + backCushionR)
          ctx.quadraticCurveTo(backCushionGap/2, backCushionY, backCushionGap/2 + backCushionR, backCushionY)
          ctx.closePath()
          ctx.fill()
          // Right back cushion highlight
          ctx.globalAlpha = 0.18
          ctx.fillStyle = '#fff'
          ctx.beginPath()
          ctx.ellipse(sofaW*0.19, backCushionY + backCushionH*0.18, backCushionW*0.32, backCushionH*0.18, 0, Math.PI*1.1, Math.PI*1.9)
          ctx.fill()
          ctx.globalAlpha = 1
          // --- SEAT CUSHION ---
          const seatW = sofaW * 0.8
          const seatH = sofaH * 0.19
          const seatR = sofaH * 0.09
          const seatY = 0
          grad = ctx.createLinearGradient(0, seatY, 0, seatY + seatH)
          grad.addColorStop(0, adjustColor(item.color, 20))
          grad.addColorStop(1, adjustColor(item.color, -15))
          ctx.fillStyle = grad
          ctx.beginPath()
          ctx.moveTo(-seatW/2 + seatR, seatY)
          ctx.lineTo(seatW/2 - seatR, seatY)
          ctx.quadraticCurveTo(seatW/2, seatY, seatW/2, seatY + seatR)
          ctx.lineTo(seatW/2, seatY + seatH - seatR)
          ctx.quadraticCurveTo(seatW/2, seatY + seatH, seatW/2 - seatR, seatY + seatH)
          ctx.lineTo(-seatW/2 + seatR, seatY + seatH)
          ctx.quadraticCurveTo(-seatW/2, seatY + seatH, -seatW/2, seatY + seatH - seatR)
          ctx.lineTo(-seatW/2, seatY + seatR)
          ctx.quadraticCurveTo(-seatW/2, seatY, -seatW/2 + seatR, seatY)
          ctx.closePath()
          ctx.fill()
          // Seat highlight
          ctx.globalAlpha = 0.13
          ctx.fillStyle = '#fff'
          ctx.beginPath()
          ctx.ellipse(0, seatY + seatH*0.25, seatW*0.38, seatH*0.18, 0, Math.PI*1.1, Math.PI*1.9)
          ctx.fill()
          ctx.globalAlpha = 1
          // --- ARMRESTS ---
          const armW = sofaW * 0.13, armH = sofaH * 0.32, armR = sofaH * 0.09
          const armY = -sofaH * 0.02
          grad = ctx.createLinearGradient(0, armY, 0, armY + armH)
          grad.addColorStop(0, adjustColor(item.color, 10))
          grad.addColorStop(1, adjustColor(item.color, -20))
          // Left armrest
          ctx.fillStyle = grad
          ctx.beginPath()
          ctx.moveTo(-sofaW/2 + armR, armY)
          ctx.lineTo(-sofaW/2 + armW - armR, armY)
          ctx.quadraticCurveTo(-sofaW/2 + armW, armY, -sofaW/2 + armW, armY + armR)
          ctx.lineTo(-sofaW/2 + armW, armY + armH - armR)
          ctx.quadraticCurveTo(-sofaW/2 + armW, armY + armH, -sofaW/2 + armW - armR, armY + armH)
          ctx.lineTo(-sofaW/2 + armR, armY + armH)
          ctx.quadraticCurveTo(-sofaW/2, armY + armH, -sofaW/2, armY + armH - armR)
          ctx.lineTo(-sofaW/2, armY + armR)
          ctx.quadraticCurveTo(-sofaW/2, armY, -sofaW/2 + armR, armY)
          ctx.closePath()
          ctx.fill()
          // Right armrest
          ctx.beginPath()
          ctx.moveTo(sofaW/2 - armW + armR, armY)
          ctx.lineTo(sofaW/2 - armR, armY)
          ctx.quadraticCurveTo(sofaW/2, armY, sofaW/2, armY + armR)
          ctx.lineTo(sofaW/2, armY + armH - armR)
          ctx.quadraticCurveTo(sofaW/2, armY + armH, sofaW/2 - armR, armY + armH)
          ctx.lineTo(sofaW/2 - armW + armR, armY + armH)
          ctx.quadraticCurveTo(sofaW/2 - armW, armY + armH, sofaW/2 - armW, armY + armH - armR)
          ctx.lineTo(sofaW/2 - armW, armY + armR)
          ctx.quadraticCurveTo(sofaW/2 - armW, armY, sofaW/2 - armW + armR, armY)
          ctx.closePath()
          ctx.fill()
          // --- FEET ---
          const footW = sofaW * 0.045, footH = sofaH * 0.06, footR = footW/2
          const footY = sofaH * 0.36
          ctx.fillStyle = adjustColor(item.color, -30)
          // Left foot
          ctx.beginPath()
          ctx.moveTo(-sofaW/2 + armW/2 - footW/2 + footR, footY)
          ctx.lineTo(-sofaW/2 + armW/2 + footW/2 - footR, footY)
          ctx.quadraticCurveTo(-sofaW/2 + armW/2 + footW/2, footY, -sofaW/2 + armW/2 + footW/2, footY + footR)
          ctx.lineTo(-sofaW/2 + armW/2 + footW/2, footY + footH - footR)
          ctx.quadraticCurveTo(-sofaW/2 + armW/2 + footW/2, footY + footH, -sofaW/2 + armW/2 + footW/2 - footR, footY + footH)
          ctx.lineTo(-sofaW/2 + armW/2 - footW/2 + footR, footY + footH)
          ctx.quadraticCurveTo(-sofaW/2 + armW/2 - footW/2, footY + footH, -sofaW/2 + armW/2 - footW/2, footY + footH - footR)
          ctx.lineTo(-sofaW/2 + armW/2 - footW/2, footY + footR)
          ctx.quadraticCurveTo(-sofaW/2 + armW/2 - footW/2, footY, -sofaW/2 + armW/2 - footW/2 + footR, footY)
          ctx.closePath()
          ctx.fill()
          // Right foot
          ctx.beginPath()
          ctx.moveTo(sofaW/2 - armW/2 - footW/2 + footR, footY)
          ctx.lineTo(sofaW/2 - armW/2 + footW/2 - footR, footY)
          ctx.quadraticCurveTo(sofaW/2 - armW/2 + footW/2, footY, sofaW/2 - armW/2 + footW/2, footY + footR)
          ctx.lineTo(sofaW/2 - armW/2 + footW/2, footY + footH - footR)
          ctx.quadraticCurveTo(sofaW/2 - armW/2 + footW/2, footY + footH, sofaW/2 - armW/2 + footW/2 - footR, footY + footH)
          ctx.lineTo(sofaW/2 - armW/2 - footW/2 + footR, footY + footH)
          ctx.quadraticCurveTo(sofaW/2 - armW/2 - footW/2, footY + footH, sofaW/2 - armW/2 - footW/2, footY + footH - footR)
          ctx.lineTo(sofaW/2 - armW/2 - footW/2, footY + footR)
          ctx.quadraticCurveTo(sofaW/2 - armW/2 - footW/2, footY, sofaW/2 - armW/2 - footW/2 + footR, footY)
          ctx.closePath()
          ctx.fill()
          // --- BASE BAR ---
          ctx.strokeStyle = adjustColor(item.color, -40)
          ctx.lineWidth = sofaH * 0.025
          ctx.lineCap = "round"
          ctx.beginPath()
          ctx.moveTo(-sofaW*0.19, footY + footH*1.1)
          ctx.lineTo(sofaW*0.19, footY + footH*1.1)
          ctx.stroke()
          break
        }
        case "table": {
          // Table: tabletop, legs, shadow, highlight
          // Shadow
          ctx.globalAlpha = 0.15
          ctx.fillStyle = "#222"
          ctx.beginPath()
          ctx.ellipse(0, item.height * 0.6, item.width * 0.45, item.height * 0.09, 0, 0, Math.PI * 2)
          ctx.fill()
          ctx.globalAlpha = 1
          // Tabletop
          const tableTopGrad = ctx.createLinearGradient(-item.width/2, -item.height*0.1, item.width/2, item.height*0.1)
          tableTopGrad.addColorStop(0, adjustColor(item.color, 20))
          tableTopGrad.addColorStop(1, adjustColor(item.color, -10))
          ctx.fillStyle = tableTopGrad
          ctx.fillRect(-item.width / 2, -item.height * 0.1, item.width, item.height * 0.18)
          // Highlight
          ctx.globalAlpha = 0.18
          ctx.fillStyle = "#fff"
          ctx.fillRect(-item.width/2, -item.height*0.1, item.width, item.height*0.04)
          ctx.globalAlpha = 1
          // Legs
          ctx.fillStyle = adjustColor(item.color, -30)
          const legW = item.width * 0.08, legH = item.height * 0.5
          ctx.fillRect(-item.width / 2 + legW*0.2, item.height * 0.08, legW, legH)
          ctx.fillRect(item.width / 2 - legW*1.2, item.height * 0.08, legW, legH)
          ctx.fillRect(-item.width / 2 + legW*0.2, item.height * 0.08 + legH, legW, legH * 0.15)
          ctx.fillRect(item.width / 2 - legW*1.2, item.height * 0.08 + legH, legW, legH * 0.15)
          break
        }
        case "lamp": {
          // Lamp: base, pole, shade, bulb, shadow
          // Shadow
          ctx.globalAlpha = 0.13
          ctx.fillStyle = "#222"
          ctx.beginPath()
          ctx.ellipse(0, item.height * 0.48, item.width * 0.13, item.height * 0.05, 0, 0, Math.PI * 2)
          ctx.fill()
          ctx.globalAlpha = 1
          // Base
          ctx.fillStyle = adjustColor(item.color, -40)
          ctx.beginPath()
          ctx.ellipse(0, item.height * 0.45, item.width * 0.15, item.height * 0.05, 0, 0, Math.PI * 2)
          ctx.fill()
          // Pole
          ctx.fillStyle = "#888"
          ctx.fillRect(-item.width * 0.02, 0, item.width * 0.04, item.height * 0.4)
          // Shade
          const lampShadeGrad = ctx.createLinearGradient(-item.width*0.2, 0, item.width*0.2, -item.height*0.3)
          lampShadeGrad.addColorStop(0, adjustColor(item.color, 10))
          lampShadeGrad.addColorStop(1, adjustColor(item.color, -10))
          ctx.fillStyle = lampShadeGrad
          ctx.beginPath()
          ctx.moveTo(-item.width * 0.2, 0)
          ctx.lineTo(item.width * 0.2, 0)
          ctx.lineTo(item.width * 0.12, -item.height * 0.3)
          ctx.lineTo(-item.width * 0.12, -item.height * 0.3)
          ctx.closePath()
          ctx.fill()
          // Bulb
          ctx.globalAlpha = 0.7
          ctx.fillStyle = "#fffbe6"
          ctx.beginPath()
          ctx.arc(0, -item.height*0.28, item.width*0.04, 0, Math.PI*2)
          ctx.fill()
          ctx.globalAlpha = 1
          break
        }
        case "chair": {
          // Chair: seat, backrest, legs, shadow, highlight
          // Shadow
          ctx.globalAlpha = 0.15
          ctx.fillStyle = "#222"
          ctx.beginPath()
          ctx.ellipse(0, item.height * 0.32, item.width * 0.22, item.height * 0.07, 0, 0, Math.PI * 2)
          ctx.fill()
          ctx.globalAlpha = 1
          // Seat
          const seatGrad = ctx.createLinearGradient(-item.width*0.25, 0, item.width*0.25, item.height*0.18)
          seatGrad.addColorStop(0, adjustColor(item.color, 10))
          seatGrad.addColorStop(1, adjustColor(item.color, -10))
          ctx.fillStyle = seatGrad
          ctx.fillRect(-item.width * 0.25, 0, item.width * 0.5, item.height * 0.18)
          // Backrest
          const backGrad = ctx.createLinearGradient(-item.width*0.25, -item.height*0.4, item.width*0.25, -item.height*0.22)
          backGrad.addColorStop(0, adjustColor(item.color, 30))
          backGrad.addColorStop(1, adjustColor(item.color, 0))
          ctx.fillStyle = backGrad
          ctx.fillRect(-item.width * 0.25, -item.height * 0.4, item.width * 0.5, item.height * 0.18)
          // Legs
          ctx.fillStyle = adjustColor(item.color, -30)
          const legWc = item.width * 0.07, legHc = item.height * 0.35
          ctx.fillRect(-item.width * 0.22, item.height * 0.18, legWc, legHc)
          ctx.fillRect(item.width * 0.15, item.height * 0.18, legWc, legHc)
          // Highlight
          ctx.globalAlpha = 0.13
          ctx.fillStyle = "#fff"
          ctx.fillRect(-item.width * 0.25, 0, item.width * 0.5, item.height * 0.04)
          ctx.globalAlpha = 1
          break
        }
        default:
          ctx.fillStyle = item.color
          ctx.fillRect(-item.width / 2, -item.height / 2, item.width, item.height)
      }
      if (item.id === selectedFurnitureId) {
        ctx.strokeStyle = "#2563eb"
        ctx.lineWidth = 2
        ctx.strokeRect(-item.width / 2 - 2, -item.height / 2 - 2, item.width + 4, item.height + 4)
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

  // Add touch event handlers to the canvas
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0]
      const canvas = canvasRef.current
      if (!canvas) return

      const rect = canvas.getBoundingClientRect()
      const x = touch.clientX - rect.left
      const y = touch.clientY - rect.top

      // Check if touched on a furniture item
      const touchedItem = findClickedItem(x, y)

      if (touchedItem) {
        onSelectFurniture(touchedItem.id)
        setIsDragging(true)
        setDragStartX(x)
        setDragStartY(y)
        setDraggedItemInitialX(touchedItem.x)
        setDraggedItemInitialY(touchedItem.y)

        // Bring the touched item to the front
        const updatedFurniture = furniture.map((item) => {
          if (item.id === touchedItem.id) {
            return { ...item, zIndex: Math.max(...furniture.map((i) => i.zIndex)) + 1 }
          }
          return item
        })

        // This will trigger a re-render with the updated zIndex
        if (JSON.stringify(updatedFurniture) !== JSON.stringify(furniture)) {
          // We need to update the parent component's state
          // This is a bit of a hack since we don't have a direct way to update zIndex
          const selectedItem = updatedFurniture.find((item) => item.id === touchedItem.id)
          if (selectedItem) {
            onMoveFurniture(selectedItem.id, selectedItem.x, selectedItem.y)
          }
        }
      } else {
        onSelectFurniture(null)
      }
    }
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0]
      const canvas = canvasRef.current
      if (!canvas || !isDragging || !selectedFurnitureId) return

      const rect = canvas.getBoundingClientRect()
      const x = touch.clientX - rect.left
      const y = touch.clientY - rect.top

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
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  // Mouse wheel for zoom
  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    let newZoom = imgZoom - e.deltaY * 0.001
    newZoom = Math.max(0.1, Math.min(5, newZoom))
    setImgZoom(newZoom)
  }

  // Mouse down for pan
  const handlePanStart = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsPanning(true)
    setPanStart({ x: e.clientX, y: e.clientY })
    setImgPanStart(imgPan)
  }

  // Mouse move for pan
  const handlePanMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isPanning) return
    const dx = e.clientX - panStart.x
    const dy = e.clientY - panStart.y
    setImgPan({ x: imgPanStart.x + dx, y: imgPanStart.y + dy })
  }

  // Mouse up to end pan
  const handlePanEnd = () => {
    setIsPanning(false)
  }

  // Touch support for pan and pinch-to-zoom
  const handleTouchStartAdvanced = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 1) {
      // Single finger pan
      setIsPanning(true)
      setPanStart({ x: e.touches[0].clientX, y: e.touches[0].clientY })
      setImgPanStart(imgPan)
    } else if (e.touches.length === 2) {
      // Pinch to zoom
      setIsPanning(false)
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      lastTouchDist.current = Math.sqrt(dx * dx + dy * dy)
      lastTouchCenter.current = {
        x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
        y: (e.touches[0].clientY + e.touches[1].clientY) / 2,
      }
    }
  }

  const handleTouchMoveAdvanced = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 1 && isPanning) {
      // Pan
      const dx = e.touches[0].clientX - panStart.x
      const dy = e.touches[0].clientY - panStart.y
      setImgPan({ x: imgPanStart.x + dx, y: imgPanStart.y + dy })
    } else if (e.touches.length === 2 && lastTouchDist.current !== null) {
      // Pinch to zoom
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      const dist = Math.sqrt(dx * dx + dy * dy)
      const scale = dist / lastTouchDist.current
      let newZoom = imgZoom * scale
      newZoom = Math.max(0.1, Math.min(5, newZoom))
      setImgZoom(newZoom)
      lastTouchDist.current = dist
      // Optionally, update pan to keep center fixed
    }
  }

  const handleTouchEndAdvanced = (e: React.TouchEvent<HTMLCanvasElement>) => {
    setIsPanning(false)
    if (e.touches.length < 2) {
      lastTouchDist.current = null
      lastTouchCenter.current = null
    }
  }

  // UI button handlers
  const handleZoomIn = () => setImgZoom((z) => Math.min(5, z * 1.1))
  const handleZoomOut = () => setImgZoom((z) => Math.max(0.1, z / 1.1))
  const handleResetView = () => {
    setImgZoom(1)
    setImgPan({ x: 0, y: 0 })
  }

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
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />
    </div>
  )
}
