"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

interface ColorPickerProps {
  color: string
  onChange: (color: string) => void
}

export default function ColorPicker({ color, onChange }: ColorPickerProps) {
  const [selectedColor, setSelectedColor] = useState(color)

  const presetColors = [
    "#8B4513", // Brown
    "#A52A2A", // Brown/Red
    "#D2B48C", // Tan
    "#808080", // Gray
    "#000000", // Black
    "#FFFFFF", // White
    "#1E90FF", // Blue
    "#228B22", // Green
    "#FFD700", // Gold
    "#FF6347", // Red/Orange
    "#800080", // Purple
    "#FFC0CB", // Pink
  ]

  const handleColorChange = (newColor: string) => {
    setSelectedColor(newColor)
    onChange(newColor)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-6 gap-2">
        {presetColors.map((presetColor) => (
          <Button
            key={presetColor}
            variant="outline"
            className="w-full h-8 p-0 border-2"
            style={{
              backgroundColor: presetColor,
              borderColor: selectedColor === presetColor ? "#000" : "transparent",
            }}
            onClick={() => handleColorChange(presetColor)}
          />
        ))}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="color"
          value={selectedColor}
          onChange={(e) => handleColorChange(e.target.value)}
          className="w-8 h-8 rounded cursor-pointer"
        />
        <input
          type="text"
          value={selectedColor}
          onChange={(e) => handleColorChange(e.target.value)}
          className="flex-1 px-2 py-1 border rounded text-sm"
        />
      </div>
    </div>
  )
}
