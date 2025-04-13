"use client"

import { useRef, useState, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import { PivotControls, useGLTF } from "@react-three/drei"
import * as THREE from "three"

// Preload models with correct paths
useGLTF.preload("/models/sofa.glb")
useGLTF.preload("/models/table.glb")
useGLTF.preload("/models/chair.glb")
useGLTF.preload("/models/lamp.glb")

interface FurnitureItemProps {
  item: {
    id: string
    type: string
    position: [number, number, number]
    rotation: [number, number, number]
    scale: [number, number, number]
    color: string
  }
  isSelected: boolean
  onClick: () => void
  onUpdate: (updates: any) => void
}

export default function FurnitureItem({ item, isSelected, onClick, onUpdate }: FurnitureItemProps) {
  const ref = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)

  // Create a fallback for when models are loading or if there's an error
  const [modelError, setModelError] = useState(false)

  // Load the appropriate model based on item type
  const { scene: modelScene, error } = useGLTF(`/models/${item.type}.glb`, undefined, undefined, (error) => {
    console.error(`Error loading model: ${error}`)
    setModelError(true)
  })

  // Create a clone of the model to avoid modifying the original
  const [model, setModel] = useState<THREE.Group | null>(null)

  useEffect(() => {
    if (modelScene && !error) {
      try {
        // Clone the model scene
        const clonedModel = modelScene.clone(true)

        // Apply the color to all meshes in the model
        clonedModel.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            // Create a new material with the item's color
            child.material = new THREE.MeshStandardMaterial({
              color: new THREE.Color(item.color),
              roughness: 0.7,
              metalness: 0.2,
            })
          }
        })

        setModel(clonedModel)
        setModelError(false)
      } catch (err) {
        console.error("Error processing model:", err)
        setModelError(true)
      }
    }
  }, [modelScene, item.color, error])

  // Apply the item's scale to the model scale
  const modelScale: [number, number, number] = item.scale

  useFrame(() => {
    if (ref.current) {
      // Any per-frame updates can go here
    }
  })

  // Function to create fallback furniture models based on type
  const renderFallbackModel = () => {
    switch (item.type) {
      case "sofa":
        return (
          <group>
            {/* Sofa base/frame */}
            <mesh castShadow receiveShadow position={[0, 0.25, 0]}>
              <boxGeometry args={[2.2, 0.5, 0.9]} />
              <meshStandardMaterial color={new THREE.Color(item.color).offsetHSL(0, 0, -0.1)} />
            </mesh>

            {/* Sofa back */}
            <mesh castShadow receiveShadow position={[0, 0.7, -0.35]}>
              <boxGeometry args={[2.2, 0.9, 0.2]} />
              <meshStandardMaterial color={new THREE.Color(item.color).offsetHSL(0, 0, -0.05)} />
            </mesh>

            {/* Sofa arms */}
            <mesh castShadow receiveShadow position={[1.05, 0.5, 0]}>
              <boxGeometry args={[0.15, 0.5, 0.8]} />
              <meshStandardMaterial color={new THREE.Color(item.color).offsetHSL(0, 0, -0.05)} />
            </mesh>
            <mesh castShadow receiveShadow position={[-1.05, 0.5, 0]}>
              <boxGeometry args={[0.15, 0.5, 0.8]} />
              <meshStandardMaterial color={new THREE.Color(item.color).offsetHSL(0, 0, -0.05)} />
            </mesh>

            {/* Sofa cushions */}
            <mesh castShadow receiveShadow position={[0, 0.4, 0.05]}>
              <boxGeometry args={[2.0, 0.3, 0.7]} />
              <meshStandardMaterial color={new THREE.Color(item.color).offsetHSL(0, 0.05, 0.05)} />
            </mesh>
          </group>
        )

      case "table":
        return (
          <group>
            {/* Table top */}
            <mesh castShadow receiveShadow position={[0, 0.4, 0]}>
              <boxGeometry args={[1.6, 0.08, 0.9]} />
              <meshStandardMaterial color={item.color} />
            </mesh>

            {/* Table legs */}
            <mesh castShadow receiveShadow position={[0.7, 0.2, 0.35]}>
              <cylinderGeometry args={[0.04, 0.04, 0.8, 8]} />
              <meshStandardMaterial color={new THREE.Color(item.color).offsetHSL(0, 0, -0.2)} />
            </mesh>
            <mesh castShadow receiveShadow position={[-0.7, 0.2, 0.35]}>
              <cylinderGeometry args={[0.04, 0.04, 0.8, 8]} />
              <meshStandardMaterial color={new THREE.Color(item.color).offsetHSL(0, 0, -0.2)} />
            </mesh>
            <mesh castShadow receiveShadow position={[0.7, 0.2, -0.35]}>
              <cylinderGeometry args={[0.04, 0.04, 0.8, 8]} />
              <meshStandardMaterial color={new THREE.Color(item.color).offsetHSL(0, 0, -0.2)} />
            </mesh>
            <mesh castShadow receiveShadow position={[-0.7, 0.2, -0.35]}>
              <cylinderGeometry args={[0.04, 0.04, 0.8, 8]} />
              <meshStandardMaterial color={new THREE.Color(item.color).offsetHSL(0, 0, -0.2)} />
            </mesh>
          </group>
        )

      case "lamp":
        return (
          <group>
            {/* Lamp base */}
            <mesh castShadow receiveShadow position={[0, 0.05, 0]}>
              <cylinderGeometry args={[0.2, 0.3, 0.1, 16]} />
              <meshStandardMaterial color={item.color} />
            </mesh>

            {/* Lamp pole */}
            <mesh castShadow receiveShadow position={[0, 0.6, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 1, 8]} />
              <meshStandardMaterial color="#444" />
            </mesh>

            {/* Lamp shade */}
            <mesh castShadow receiveShadow position={[0, 1.2, 0]}>
              <coneGeometry args={[0.2, 0.3, 16, 1, true]} />
              <meshStandardMaterial color={new THREE.Color(item.color).offsetHSL(0, 0, 0.1)} side={THREE.DoubleSide} />
            </mesh>

            {/* Light bulb */}
            <mesh position={[0, 1.1, 0]}>
              <sphereGeometry args={[0.05, 16, 16]} />
              <meshStandardMaterial color="white" emissive="yellow" emissiveIntensity={0.5} />
            </mesh>
          </group>
        )

      case "chair":
        return (
          <group>
            {/* Chair seat */}
            <mesh castShadow receiveShadow position={[0, 0.25, 0]}>
              <boxGeometry args={[0.5, 0.08, 0.5]} />
              <meshStandardMaterial color={item.color} />
            </mesh>

            {/* Chair back */}
            <mesh castShadow receiveShadow position={[0, 0.6, -0.22]}>
              <boxGeometry args={[0.5, 0.7, 0.04]} />
              <meshStandardMaterial color={new THREE.Color(item.color).offsetHSL(0, 0, -0.1)} />
            </mesh>

            {/* Chair legs */}
            <mesh castShadow receiveShadow position={[0.2, 0.12, 0.2]}>
              <cylinderGeometry args={[0.02, 0.02, 0.25, 8]} />
              <meshStandardMaterial color={new THREE.Color(item.color).offsetHSL(0, 0, -0.2)} />
            </mesh>
            <mesh castShadow receiveShadow position={[-0.2, 0.12, 0.2]}>
              <cylinderGeometry args={[0.02, 0.02, 0.25, 8]} />
              <meshStandardMaterial color={new THREE.Color(item.color).offsetHSL(0, 0, -0.2)} />
            </mesh>
            <mesh castShadow receiveShadow position={[0.2, 0.12, -0.2]}>
              <cylinderGeometry args={[0.02, 0.02, 0.25, 8]} />
              <meshStandardMaterial color={new THREE.Color(item.color).offsetHSL(0, 0, -0.2)} />
            </mesh>
            <mesh castShadow receiveShadow position={[-0.2, 0.12, -0.2]}>
              <cylinderGeometry args={[0.02, 0.02, 0.25, 8]} />
              <meshStandardMaterial color={new THREE.Color(item.color).offsetHSL(0, 0, -0.2)} />
            </mesh>
          </group>
        )

      default:
        return (
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={item.color} />
          </mesh>
        )
    }
  }

  return (
    <group>
      {isSelected ? (
        <PivotControls
          scale={75}
          depthTest={false}
          fixed
          lineWidth={2}
          onDrag={(matrix) => {
            // Extract position from the matrix
            const position = new THREE.Vector3()
            matrix.decompose(position, new THREE.Quaternion(), new THREE.Vector3())
            onUpdate({ position: [position.x, position.y, position.z] })
          }}
        >
          <group
            ref={ref}
            position={item.position}
            rotation={item.rotation as [number, number, number]}
            scale={modelScale}
            onClick={onClick}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
          >
            {model && !modelError ? <primitive object={model} /> : renderFallbackModel()}
          </group>
        </PivotControls>
      ) : (
        <group
          ref={ref}
          position={item.position}
          rotation={item.rotation as [number, number, number]}
          scale={modelScale}
          onClick={onClick}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          {model && !modelError ? <primitive object={model} /> : renderFallbackModel()}
        </group>
      )}

      {/* Highlight effect for hover or selection */}
      {(hovered || isSelected) && (
        <mesh position={item.position}>
          <boxGeometry args={[1.2, 1.2, 1.2]} />
          <meshBasicMaterial color={isSelected ? "#2563eb" : "#64748b"} wireframe transparent opacity={0.2} />
        </mesh>
      )}
    </group>
  )
}
