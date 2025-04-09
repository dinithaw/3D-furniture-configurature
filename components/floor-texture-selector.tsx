"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ColorPicker from "@/components/color-picker"
import { RotateCw, ZoomIn } from "lucide-react"

interface FloorTextureSelectorProps {
  floorColor: string
  floorPattern: "solid" | "tiles" | "wood" | "marble"
  floorTextureScale: number
  floorTextureRotation: number
  onColorChange: (color: string) => void
  onPatternChange: (pattern: "solid" | "tiles" | "wood" | "marble") => void
  onScaleChange: (scale: number) => void
  onRotationChange: (rotation: number) => void
}

export default function FloorTextureSelector({
  floorColor,
  floorPattern,
  floorTextureScale,
  floorTextureRotation,
  onColorChange,
  onPatternChange,
  onScaleChange,
  onRotationChange,
}: FloorTextureSelectorProps) {
  const [activeTab, setActiveTab] = useState<"pattern" | "color" | "advanced">("pattern")

  // Predefined color palettes for each pattern type
  const colorPalettes = {
    solid: ["#e0d2c0", "#8B4513", "#D3D3D3", "#FFFFFF", "#F5F5DC", "#A0522D"],
    tiles: ["#F5F5F5", "#D3D3D3", "#E8E8E8", "#DCDCDC", "#C0C0C0", "#A9A9A9"],
    wood: ["#8B4513", "#A0522D", "#CD853F", "#D2B48C", "#DEB887", "#F5DEB3"],
    marble: ["#F5F5F5", "#E6E6FA", "#F0F8FF", "#F8F8FF", "#FFF0F5", "#FFFAFA"],
  }

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="pattern">Pattern</TabsTrigger>
          <TabsTrigger value="color">Color</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="pattern" className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={floorPattern === "solid" ? "default" : "outline"}
              className="justify-start h-auto py-3"
              onClick={() => onPatternChange("solid")}
            >
              <div className="w-12 h-12 bg-gray-400 mr-2 rounded"></div>
              <div className="text-left">
                <div className="font-medium">Solid</div>
                <div className="text-xs text-gray-500">Simple solid color</div>
              </div>
            </Button>

            <Button
              variant={floorPattern === "tiles" ? "default" : "outline"}
              className="justify-start h-auto py-3"
              onClick={() => onPatternChange("tiles")}
            >
              <div className="w-12 h-12 bg-gray-400 grid grid-cols-4 grid-rows-4 gap-px mr-2 rounded overflow-hidden">
                {Array(16)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="bg-gray-300"></div>
                  ))}
              </div>
              <div className="text-left">
                <div className="font-medium">Tiles</div>
                <div className="text-xs text-gray-500">Square tile pattern</div>
              </div>
            </Button>

            <Button
              variant={floorPattern === "wood" ? "default" : "outline"}
              className="justify-start h-auto py-3"
              onClick={() => onPatternChange("wood")}
            >
              <div className="w-12 h-12 bg-amber-700 flex flex-col justify-between mr-2 rounded overflow-hidden">
                {Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="h-px bg-amber-900"></div>
                  ))}
              </div>
              <div className="text-left">
                <div className="font-medium">Wood</div>
                <div className="text-xs text-gray-500">Wooden planks</div>
              </div>
            </Button>

            <Button
              variant={floorPattern === "marble" ? "default" : "outline"}
              className="justify-start h-auto py-3"
              onClick={() => onPatternChange("marble")}
            >
              <div className="w-12 h-12 bg-gray-200 relative mr-2 rounded overflow-hidden">
                <div
                  className="absolute inset-0 bg-gray-100 opacity-50"
                  style={{
                    backgroundImage: "radial-gradient(circle, transparent 50%, gray 100%)",
                    backgroundSize: "4px 4px",
                  }}
                ></div>
                <div
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.8) 45%, transparent 50%)",
                    backgroundSize: "20px 20px",
                  }}
                ></div>
              </div>
              <div className="text-left">
                <div className="font-medium">Marble</div>
                <div className="text-xs text-gray-500">Elegant marble texture</div>
              </div>
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="color" className="space-y-4">
          <h4 className="text-sm font-medium mb-2">
            Recommended Colors for {floorPattern.charAt(0).toUpperCase() + floorPattern.slice(1)}
          </h4>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {colorPalettes[floorPattern].map((color, index) => (
              <div
                key={index}
                className={`h-12 rounded cursor-pointer transition-all hover:scale-105 ${floorColor === color ? "ring-2 ring-black" : ""}`}
                style={{ backgroundColor: color }}
                onClick={() => onColorChange(color)}
              ></div>
            ))}
          </div>

          <h4 className="text-sm font-medium mb-2">Custom Color</h4>
          <ColorPicker color={floorColor} onChange={onColorChange} />
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium flex items-center">
                  <ZoomIn className="h-4 w-4 mr-1" />
                  Texture Scale
                </label>
                <span className="text-sm">{floorTextureScale.toFixed(1)}x</span>
              </div>
              <Slider
                value={[floorTextureScale]}
                min={0.5}
                max={5}
                step={0.1}
                onValueChange={(value) => onScaleChange(value[0])}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium flex items-center">
                  <RotateCw className="h-4 w-4 mr-1" />
                  Texture Rotation
                </label>
                <span className="text-sm">{Math.round(floorTextureRotation * (180 / Math.PI))}°</span>
              </div>
              <Slider
                value={[floorTextureRotation]}
                min={0}
                max={Math.PI * 2}
                step={Math.PI / 12}
                onValueChange={(value) => onRotationChange(value[0])}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
