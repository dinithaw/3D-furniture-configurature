"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Move, RotateCcw, Maximize, Trash2 } from "lucide-react"

interface FurnitureControlsProps {
  item: {
    id: string
    type: string
    position: [number, number, number]
    rotation: [number, number, number]
    scale: [number, number, number]
    color: string
  }
  onUpdate: (updates: any) => void
  onDelete?: () => void
}

export function FurnitureControls({ item, onUpdate, onDelete }: FurnitureControlsProps) {
  const [activeTab, setActiveTab] = useState("move")

  const handlePositionChange = (axis: number, value: number) => {
    const newPosition = [...item.position]
    newPosition[axis] = value
    onUpdate({ position: newPosition })
  }

  const handleRotationChange = (axis: number, value: number) => {
    const newRotation = [...item.rotation]
    newRotation[axis] = value
    onUpdate({ rotation: newRotation })
  }

  const handleScaleChange = (value: number) => {
    onUpdate({ scale: [value, value, value] })
  }

  return (
    <Card className="w-full max-w-96 shadow-lg">
      <CardContent className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="move" className="flex items-center gap-2">
              <Move className="h-4 w-4" />
              <span className="hidden sm:inline">Move</span>
            </TabsTrigger>
            <TabsTrigger value="rotate" className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4" />
              <span className="hidden sm:inline">Rotate</span>
            </TabsTrigger>
            <TabsTrigger value="scale" className="flex items-center gap-2">
              <Maximize className="h-4 w-4" />
              <span className="hidden sm:inline">Scale</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="move" className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>X Position</span>
                <span>{item.position[0].toFixed(2)}m</span>
              </div>
              <Slider
                value={[item.position[0]]}
                min={-5}
                max={5}
                step={0.1}
                onValueChange={(value) => handlePositionChange(0, value[0])}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Y Position</span>
                <span>{item.position[1].toFixed(2)}m</span>
              </div>
              <Slider
                value={[item.position[1]]}
                min={0}
                max={3}
                step={0.1}
                onValueChange={(value) => handlePositionChange(1, value[0])}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Z Position</span>
                <span>{item.position[2].toFixed(2)}m</span>
              </div>
              <Slider
                value={[item.position[2]]}
                min={-5}
                max={5}
                step={0.1}
                onValueChange={(value) => handlePositionChange(2, value[0])}
              />
            </div>
          </TabsContent>

          <TabsContent value="rotate" className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>X Rotation</span>
                <span>{((item.rotation[0] * 180) / Math.PI).toFixed(0)}°</span>
              </div>
              <Slider
                value={[item.rotation[0]]}
                min={0}
                max={Math.PI * 2}
                step={0.1}
                onValueChange={(value) => handleRotationChange(0, value[0])}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Y Rotation</span>
                <span>{((item.rotation[1] * 180) / Math.PI).toFixed(0)}°</span>
              </div>
              <Slider
                value={[item.rotation[1]]}
                min={0}
                max={Math.PI * 2}
                step={0.1}
                onValueChange={(value) => handleRotationChange(1, value[0])}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Z Rotation</span>
                <span>{((item.rotation[2] * 180) / Math.PI).toFixed(0)}°</span>
              </div>
              <Slider
                value={[item.rotation[2]]}
                min={0}
                max={Math.PI * 2}
                step={0.1}
                onValueChange={(value) => handleRotationChange(2, value[0])}
              />
            </div>
          </TabsContent>

          <TabsContent value="scale" className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Scale</span>
                <span>{item.scale[0].toFixed(1)}x</span>
              </div>
              <Slider
                value={[item.scale[0]]}
                min={0.1}
                max={2}
                step={0.1}
                onValueChange={(value) => handleScaleChange(value[0])}
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-4 flex justify-end">
          <Button variant="destructive" size="sm" className="flex items-center gap-2" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
            <span>Remove</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
