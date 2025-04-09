// Create a new component for advanced floor textures
"use client"
import * as THREE from "three"

interface FloorTextureProps {
  width: number
  length: number
  pattern: "tiles" | "wood" | "marble"
  color: string
}

export default function FloorTexture({ width, length, pattern, color }: FloorTextureProps) {
  // Create a procedural texture for the floor based on the pattern
  const createTileTexture = () => {
    const canvas = document.createElement("canvas")
    const size = 512
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext("2d")

    if (!ctx) return null

    const tileSize = size / 8
    const baseColor = new THREE.Color(color)
    const darkerColor = new THREE.Color(color).offsetHSL(0, 0, -0.1)
    const lighterColor = new THREE.Color(color).offsetHSL(0, 0, 0.1)

    // Draw tiles
    for (let x = 0; x < size; x += tileSize) {
      for (let y = 0; y < size; y += tileSize) {
        const isEven = (x / tileSize + y / tileSize) % 2 === 0
        ctx.fillStyle = isEven ? baseColor.getStyle() : darkerColor.getStyle()
        ctx.fillRect(x, y, tileSize, tileSize)

        // Add grout lines
        ctx.fillStyle = "#555"
        ctx.fillRect(x, y, tileSize, 1)
        ctx.fillRect(x, y, 1, tileSize)

        // Add highlight
        ctx.fillStyle = lighterColor.getStyle()
        ctx.globalAlpha = 0.1
        ctx.fillRect(x + 2, y + 2, tileSize - 4, tileSize - 4)
        ctx.globalAlpha = 1.0
      }
    }

    return canvas
  }

  const createWoodTexture = () => {
    const canvas = document.createElement("canvas")
    const size = 512
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext("2d")

    if (!ctx) return null

    const baseColor = new THREE.Color(color)
    const darkerColor = new THREE.Color(color).offsetHSL(0, 0, -0.1)
    const lighterColor = new THREE.Color(color).offsetHSL(0, 0, 0.1)

    // Draw wood planks
    const plankHeight = size / 8

    for (let y = 0; y < size; y += plankHeight) {
      // Base plank color
      ctx.fillStyle = baseColor.getStyle()
      ctx.fillRect(0, y, size, plankHeight)

      // Wood grain
      ctx.fillStyle = darkerColor.getStyle()
      ctx.globalAlpha = 0.1

      for (let i = 0; i < 20; i++) {
        const grainY = y + Math.random() * plankHeight
        ctx.beginPath()
        ctx.moveTo(0, grainY)

        // Create wavy line for wood grain
        for (let x = 0; x < size; x += 20) {
          const waveY = grainY + (Math.random() * 4 - 2)
          ctx.lineTo(x, waveY)
        }

        ctx.lineWidth = 1 + Math.random() * 2
        ctx.stroke()
      }

      // Plank separation
      ctx.fillStyle = "#000"
      ctx.globalAlpha = 0.8
      ctx.fillRect(0, y, size, 1)

      // Highlight
      ctx.fillStyle = lighterColor.getStyle()
      ctx.globalAlpha = 0.1
      ctx.fillRect(0, y + 1, size, 2)

      ctx.globalAlpha = 1.0
    }

    return canvas
  }

  const createMarbleTexture = () => {
    const canvas = document.createElement("canvas")
    const size = 512
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext("2d")

    if (!ctx) return null

    const baseColor = new THREE.Color(color)
    const veinColor = new THREE.Color(color).offsetHSL(0, -0.2, 0.2)

    // Base color
    ctx.fillStyle = baseColor.getStyle()
    ctx.fillRect(0, 0, size, size)

    // Create marble veins
    ctx.strokeStyle = veinColor.getStyle()
    ctx.lineWidth = 1

    for (let i = 0; i < 20; i++) {
      ctx.beginPath()

      // Start point
      const startX = Math.random() * size
      const startY = Math.random() * size

      ctx.moveTo(startX, startY)

      // Create curved path for vein
      const cp1x = startX + (Math.random() * 100 - 50)
      const cp1y = startY + (Math.random() * 100 - 50)
      const cp2x = startX + (Math.random() * 200 - 100)
      const cp2y = startY + (Math.random() * 200 - 100)
      const endX = startX + (Math.random() * 300 - 150)
      const endY = startY + (Math.random() * 300 - 150)

      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY)

      ctx.globalAlpha = 0.2 + Math.random() * 0.3
      ctx.lineWidth = 1 + Math.random() * 3
      ctx.stroke()
    }

    // Add subtle texture
    for (let i = 0; i < 5000; i++) {
      const x = Math.random() * size
      const y = Math.random() * size
      const radius = Math.random() * 1

      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fillStyle = Math.random() > 0.5 ? baseColor.getStyle() : veinColor.getStyle()
      ctx.globalAlpha = Math.random() * 0.05
      ctx.fill()
    }

    ctx.globalAlpha = 1.0

    return canvas
  }

  // Create texture based on pattern
  let textureCanvas
  switch (pattern) {
    case "tiles":
      textureCanvas = createTileTexture()
      break
    case "wood":
      textureCanvas = createWoodTexture()
      break
    case "marble":
      textureCanvas = createMarbleTexture()
      break
  }

  // Create texture from canvas
  let texture = null
  if (textureCanvas) {
    texture = new THREE.CanvasTexture(textureCanvas)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(width / 5, length / 5)
  }

  return (
    <meshStandardMaterial
      color={color}
      map={texture}
      roughness={pattern === "marble" ? 0.2 : 0.8}
      metalness={pattern === "marble" ? 0.3 : 0.1}
    />
  )
}
