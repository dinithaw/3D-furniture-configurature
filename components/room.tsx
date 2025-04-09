"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Plane } from "@react-three/drei"
import * as THREE from "three"
import FloorTexture from "./floor-texture"

// Update the Room props interface to include floorPattern
interface RoomProps {
  dimensions: {
    width: number
    length: number
    height: number
  }
  wallColor: string
  floorColor: string
  floorPattern?: "solid" | "tiles" | "wood" | "marble"
  floorTextureScale?: number
  floorTextureRotation?: number
}

export default function Room({
  dimensions,
  wallColor,
  floorColor,
  floorPattern = "solid",
  floorTextureScale = 1,
  floorTextureRotation = 0,
}: RoomProps) {
  const floorRef = useRef<THREE.Mesh>(null)

  // Destructure dimensions for easier access
  const { width, length, height } = dimensions

  useFrame(() => {
    if (floorRef.current) {
      // Any animations or updates can go here
    }
  })

  return (
    <group>
      {/* Floor */}
      <Plane
        ref={floorRef}
        args={[width, length]}
        rotation={[-Math.PI / 2, floorTextureRotation, 0]}
        position={[0, 0, 0]}
        receiveShadow
      >
        {floorPattern === "solid" ? (
          <meshStandardMaterial color={floorColor} roughness={0.8} metalness={0.2} />
        ) : (
          <FloorTexture
            width={width * floorTextureScale}
            length={length * floorTextureScale}
            pattern={floorPattern as "tiles" | "wood" | "marble"}
            color={floorColor}
          />
        )}
      </Plane>

      {/* Walls */}
      {/* Back wall */}
      <Plane args={[width, height]} position={[0, height / 2, -length / 2]} receiveShadow>
        <meshStandardMaterial color={wallColor} side={THREE.DoubleSide} />
      </Plane>

      {/* Left wall */}
      <Plane
        args={[length, height]}
        position={[-width / 2, height / 2, 0]}
        rotation={[0, Math.PI / 2, 0]}
        receiveShadow
      >
        <meshStandardMaterial color={wallColor} side={THREE.DoubleSide} />
      </Plane>

      {/* Right wall */}
      <Plane
        args={[length, height]}
        position={[width / 2, height / 2, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        receiveShadow
      >
        <meshStandardMaterial color={wallColor} side={THREE.DoubleSide} />
      </Plane>
    </group>
  )
}
