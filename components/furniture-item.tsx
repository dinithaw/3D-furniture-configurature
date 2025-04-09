"use client"

import { useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { PivotControls } from "@react-three/drei"
import * as THREE from "three"

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

  // Create a material with the item's color
  const material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(item.color),
    roughness: 0.7,
    metalness: 0.2,
  })

  // Apply the item's scale to the model scale
  const modelScale: [number, number, number] = item.scale

  useFrame(() => {
    if (ref.current) {
      // Any per-frame updates can go here
    }
  })

  // Function to create furniture models based on type
  const renderFurnitureModel = () => {
    switch (item.type) {
      case "sofa":
        return (
          <group>
            {/* Sofa base/frame */}
            <mesh castShadow receiveShadow position={[0, 0.25, 0]}>
              <boxGeometry args={[2.2, 0.5, 0.9]} />
              <meshStandardMaterial {...material} color={new THREE.Color(item.color).offsetHSL(0, 0, -0.1)} />
            </mesh>

            {/* Sofa back */}
            <mesh castShadow receiveShadow position={[0, 0.7, -0.35]}>
              <boxGeometry args={[2.2, 0.9, 0.2]} />
              <meshStandardMaterial {...material} color={new THREE.Color(item.color).offsetHSL(0, 0, -0.05)} />
            </mesh>

            {/* Sofa arms - more rounded with bevels */}
            <group position={[1.05, 0.5, 0]}>
              <mesh castShadow receiveShadow position={[0, 0, 0]}>
                <boxGeometry args={[0.15, 0.5, 0.8]} />
                <meshStandardMaterial {...material} color={new THREE.Color(item.color).offsetHSL(0, 0, -0.05)} />
              </mesh>
              {/* Arm top padding */}
              <mesh castShadow receiveShadow position={[0, 0.25, 0]}>
                <boxGeometry args={[0.2, 0.1, 0.85]} />
                <meshStandardMaterial {...material} color={new THREE.Color(item.color).offsetHSL(0, 0.05, 0.05)} />
              </mesh>
            </group>

            <group position={[-1.05, 0.5, 0]}>
              <mesh castShadow receiveShadow position={[0, 0, 0]}>
                <boxGeometry args={[0.15, 0.5, 0.8]} />
                <meshStandardMaterial {...material} color={new THREE.Color(item.color).offsetHSL(0, 0, -0.05)} />
              </mesh>
              {/* Arm top padding */}
              <mesh castShadow receiveShadow position={[0, 0.25, 0]}>
                <boxGeometry args={[0.2, 0.1, 0.85]} />
                <meshStandardMaterial {...material} color={new THREE.Color(item.color).offsetHSL(0, 0.05, 0.05)} />
              </mesh>
            </group>

            {/* Sofa cushions with more detail */}
            <group position={[0, 0.4, 0.05]}>
              {/* Left cushion */}
              <mesh castShadow receiveShadow position={[-0.55, 0, 0]}>
                <boxGeometry args={[0.9, 0.3, 0.7]} />
                <meshStandardMaterial {...material} color={new THREE.Color(item.color).offsetHSL(0, 0.05, 0.05)} />
              </mesh>
              {/* Right cushion */}
              <mesh castShadow receiveShadow position={[0.55, 0, 0]}>
                <boxGeometry args={[0.9, 0.3, 0.7]} />
                <meshStandardMaterial {...material} color={new THREE.Color(item.color).offsetHSL(0, 0.05, 0.05)} />
              </mesh>

              {/* Cushion details - seams and indentations */}
              <mesh castShadow receiveShadow position={[0, 0, 0]}>
                <boxGeometry args={[0.05, 0.25, 0.65]} />
                <meshStandardMaterial color={new THREE.Color(item.color).offsetHSL(0, 0, -0.1)} />
              </mesh>

              {/* Back cushions */}
              <mesh castShadow receiveShadow position={[-0.55, 0.3, -0.2]}>
                <boxGeometry args={[0.8, 0.3, 0.3]} />
                <meshStandardMaterial {...material} color={new THREE.Color(item.color).offsetHSL(0, 0.05, 0.05)} />
              </mesh>
              <mesh castShadow receiveShadow position={[0.55, 0.3, -0.2]}>
                <boxGeometry args={[0.8, 0.3, 0.3]} />
                <meshStandardMaterial {...material} color={new THREE.Color(item.color).offsetHSL(0, 0.05, 0.05)} />
              </mesh>
            </group>

            {/* Sofa legs */}
            <mesh castShadow receiveShadow position={[0.9, -0.2, 0.3]}>
              <cylinderGeometry args={[0.04, 0.04, 0.2, 8]} />
              <meshStandardMaterial color="#444" metalness={0.8} roughness={0.2} />
            </mesh>
            <mesh castShadow receiveShadow position={[-0.9, -0.2, 0.3]}>
              <cylinderGeometry args={[0.04, 0.04, 0.2, 8]} />
              <meshStandardMaterial color="#444" metalness={0.8} roughness={0.2} />
            </mesh>
            <mesh castShadow receiveShadow position={[0.9, -0.2, -0.3]}>
              <cylinderGeometry args={[0.04, 0.04, 0.2, 8]} />
              <meshStandardMaterial color="#444" metalness={0.8} roughness={0.2} />
            </mesh>
            <mesh castShadow receiveShadow position={[-0.9, -0.2, -0.3]}>
              <cylinderGeometry args={[0.04, 0.04, 0.2, 8]} />
              <meshStandardMaterial color="#444" metalness={0.8} roughness={0.2} />
            </mesh>
          </group>
        )

      case "table":
        return (
          <group>
            {/* Table top with beveled edges */}
            <mesh castShadow receiveShadow position={[0, 0.4, 0]}>
              <boxGeometry args={[1.6, 0.08, 0.9]} />
              <meshStandardMaterial {...material} color={new THREE.Color(item.color)} roughness={0.4} metalness={0.1} />
            </mesh>

            {/* Table edge trim */}
            <mesh castShadow receiveShadow position={[0, 0.36, 0]}>
              <boxGeometry args={[1.65, 0.02, 0.95]} />
              <meshStandardMaterial color={new THREE.Color(item.color).offsetHSL(0, 0, -0.15)} />
            </mesh>

            {/* Table frame under top */}
            <mesh castShadow receiveShadow position={[0, 0.32, 0]}>
              <boxGeometry args={[1.5, 0.04, 0.8]} />
              <meshStandardMaterial color={new THREE.Color(item.color).offsetHSL(0, 0, -0.2)} />
            </mesh>

            {/* Table legs - more detailed with connection structure */}
            <group>
              {/* Leg connectors */}
              <mesh castShadow receiveShadow position={[0, 0.2, 0]}>
                <boxGeometry args={[1.4, 0.04, 0.04]} />
                <meshStandardMaterial color={new THREE.Color(item.color).offsetHSL(0, 0, -0.2)} />
              </mesh>
              <mesh castShadow receiveShadow position={[0, 0.2, 0.7]}>
                <boxGeometry args={[1.4, 0.04, 0.04]} />
                <meshStandardMaterial color={new THREE.Color(item.color).offsetHSL(0, 0, -0.2)} />
              </mesh>
              <mesh castShadow receiveShadow position={[0, 0.2, -0.7]}>
                <boxGeometry args={[1.4, 0.04, 0.04]} />
                <meshStandardMaterial color={new THREE.Color(item.color).offsetHSL(0, 0, -0.2)} />
              </mesh>

              {/* Cross supports */}
              <mesh castShadow receiveShadow position={[0.65, 0.2, 0]}>
                <boxGeometry args={[0.04, 0.04, 1.4]} />
                <meshStandardMaterial color={new THREE.Color(item.color).offsetHSL(0, 0, -0.2)} />
              </mesh>
              <mesh castShadow receiveShadow position={[-0.65, 0.2, 0]}>
                <boxGeometry args={[0.04, 0.04, 1.4]} />
                <meshStandardMaterial color={new THREE.Color(item.color).offsetHSL(0, 0, -0.2)} />
              </mesh>
            </group>

            {/* Table legs - tapered design */}
            <mesh castShadow receiveShadow position={[0.65, 0.1, 0.35]}>
              <cylinderGeometry args={[0.03, 0.04, 0.4, 8]} />
              <meshStandardMaterial color={new THREE.Color(item.color).offsetHSL(0, 0, -0.3)} />
            </mesh>
            <mesh castShadow receiveShadow position={[-0.65, 0.1, 0.35]}>
              <cylinderGeometry args={[0.03, 0.04, 0.4, 8]} />
              <meshStandardMaterial color={new THREE.Color(item.color).offsetHSL(0, 0, -0.3)} />
            </mesh>
            <mesh castShadow receiveShadow position={[0.65, 0.1, -0.35]}>
              <cylinderGeometry args={[0.03, 0.04, 0.4, 8]} />
              <meshStandardMaterial color={new THREE.Color(item.color).offsetHSL(0, 0, -0.3)} />
            </mesh>
            <mesh castShadow receiveShadow position={[-0.65, 0.1, -0.35]}>
              <cylinderGeometry args={[0.03, 0.04, 0.4, 8]} />
              <meshStandardMaterial color={new THREE.Color(item.color).offsetHSL(0, 0, -0.3)} />
            </mesh>

            {/* Leg feet */}
            <mesh castShadow receiveShadow position={[0.65, -0.1, 0.35]}>
              <sphereGeometry args={[0.04, 8, 8, 0, Math.PI]} />
              <meshStandardMaterial color="#333" metalness={0.8} roughness={0.2} />
            </mesh>
            <mesh castShadow receiveShadow position={[-0.65, -0.1, 0.35]}>
              <sphereGeometry args={[0.04, 8, 8, 0, Math.PI]} />
              <meshStandardMaterial color="#333" metalness={0.8} roughness={0.2} />
            </mesh>
            <mesh castShadow receiveShadow position={[0.65, -0.1, -0.35]}>
              <sphereGeometry args={[0.04, 8, 8, 0, Math.PI]} />
              <meshStandardMaterial color="#333" metalness={0.8} roughness={0.2} />
            </mesh>
            <mesh castShadow receiveShadow position={[-0.65, -0.1, -0.35]}>
              <sphereGeometry args={[0.04, 8, 8, 0, Math.PI]} />
              <meshStandardMaterial color="#333" metalness={0.8} roughness={0.2} />
            </mesh>
          </group>
        )

      case "lamp":
        return (
          <group>
            {/* Lamp base - more detailed with layered design */}
            <mesh castShadow receiveShadow position={[0, 0.03, 0]}>
              <cylinderGeometry args={[0.25, 0.3, 0.06, 16]} />
              <meshStandardMaterial color={new THREE.Color(item.color).offsetHSL(0, 0, -0.2)} />
            </mesh>
            <mesh castShadow receiveShadow position={[0, 0.07, 0]}>
              <cylinderGeometry args={[0.2, 0.25, 0.04, 16]} />
              <meshStandardMaterial color={new THREE.Color(item.color).offsetHSL(0, 0, -0.1)} />
            </mesh>
            <mesh castShadow receiveShadow position={[0, 0.1, 0]}>
              <cylinderGeometry args={[0.15, 0.2, 0.03, 16]} />
              <meshStandardMaterial {...material} />
            </mesh>

            {/* Lamp neck with joint */}
            <mesh castShadow receiveShadow position={[0, 0.2, 0]}>
              <sphereGeometry args={[0.06, 16, 16]} />
              <meshStandardMaterial color={new THREE.Color(item.color).offsetHSL(0, 0, -0.1)} />
            </mesh>

            {/* Lamp pole - slightly curved */}
            <mesh castShadow receiveShadow position={[0, 0.6, 0]}>
              <cylinderGeometry args={[0.02, 0.03, 0.8, 8]} />
              <meshStandardMaterial color="#444" metalness={0.8} roughness={0.2} />
            </mesh>

            {/* Lamp head connection */}
            <mesh castShadow receiveShadow position={[0, 1.05, 0]}>
              <sphereGeometry args={[0.04, 16, 16]} />
              <meshStandardMaterial color="#444" metalness={0.8} roughness={0.2} />
            </mesh>

            {/* Lamp shade support */}
            <mesh castShadow receiveShadow position={[0, 1.15, 0]}>
              <cylinderGeometry args={[0.1, 0.04, 0.05, 16]} />
              <meshStandardMaterial color="#444" metalness={0.8} roughness={0.2} />
            </mesh>

            {/* Lamp shade - more realistic with thickness */}
            <group position={[0, 1.25, 0]}>
              <mesh castShadow receiveShadow>
                <coneGeometry args={[0.25, 0.4, 32, 1, true]} />
                <meshStandardMaterial
                  color={new THREE.Color(item.color).offsetHSL(0, 0, 0.1)}
                  side={THREE.DoubleSide}
                  transparent
                  opacity={0.9}
                />
              </mesh>
              <mesh castShadow receiveShadow position={[0, -0.01, 0]}>
                <ringGeometry args={[0.23, 0.25, 32]} />
                <meshStandardMaterial color="#444" metalness={0.8} roughness={0.2} />
              </mesh>
              <mesh castShadow receiveShadow position={[0, -0.4, 0]}>
                <ringGeometry args={[0.08, 0.1, 32]} />
                <meshStandardMaterial color="#444" metalness={0.8} roughness={0.2} />
              </mesh>
            </group>

            {/* Light bulb (emissive) */}
            <mesh position={[0, 1.1, 0]}>
              <sphereGeometry args={[0.08, 16, 16]} />
              <meshStandardMaterial color="white" emissive="yellow" emissiveIntensity={0.8} />
            </mesh>

            {/* Light effect */}
            <pointLight position={[0, 1.1, 0]} intensity={0.8} distance={4} color="yellow" />
          </group>
        )

      case "chair":
        return (
          <group>
            {/* Chair seat with cushion */}
            <mesh castShadow receiveShadow position={[0, 0.25, 0]}>
              <boxGeometry args={[0.5, 0.08, 0.5]} />
              <meshStandardMaterial color={new THREE.Color(item.color).offsetHSL(0, 0, -0.2)} />
            </mesh>
            <mesh castShadow receiveShadow position={[0, 0.31, 0]}>
              <boxGeometry args={[0.48, 0.06, 0.48]} />
              <meshStandardMaterial {...material} />
            </mesh>

            {/* Chair back with slats */}
            <group position={[0, 0.6, -0.22]}>
              {/* Back frame */}
              <mesh castShadow receiveShadow position={[0, 0, 0]}>
                <boxGeometry args={[0.5, 0.7, 0.04]} />
                <meshStandardMaterial color={new THREE.Color(item.color).offsetHSL(0, 0, -0.2)} />
              </mesh>

              {/* Back slats */}
              <mesh castShadow receiveShadow position={[0, 0, 0.02]}>
                <boxGeometry args={[0.46, 0.66, 0.02]} />
                <meshStandardMaterial {...material} />
              </mesh>

              {/* Vertical slats */}
              <mesh castShadow receiveShadow position={[-0.15, 0, 0.03]}>
                <boxGeometry args={[0.03, 0.66, 0.02]} />
                <meshStandardMaterial color={new THREE.Color(item.color).offsetHSL(0, 0, -0.1)} />
              </mesh>
              <mesh castShadow receiveShadow position={[0, 0, 0.03]}>
                <boxGeometry args={[0.03, 0.66, 0.02]} />
                <meshStandardMaterial color={new THREE.Color(item.color).offsetHSL(0, 0, -0.1)} />
              </mesh>
              <mesh castShadow receiveShadow position={[0.15, 0, 0.03]}>
                <boxGeometry args={[0.03, 0.66, 0.02]} />
                <meshStandardMaterial color={new THREE.Color(item.color).offsetHSL(0, 0, -0.1)} />
              </mesh>

              {/* Horizontal slats */}
              <mesh castShadow receiveShadow position={[0, 0.2, 0.03]}>
                <boxGeometry args={[0.46, 0.03, 0.02]} />
                <meshStandardMaterial color={new THREE.Color(item.color).offsetHSL(0, 0, -0.1)} />
              </mesh>
              <mesh castShadow receiveShadow position={[0, -0.2, 0.03]}>
                <boxGeometry args={[0.46, 0.03, 0.02]} />
                <meshStandardMaterial color={new THREE.Color(item.color).offsetHSL(0, 0, -0.1)} />
              </mesh>
            </group>

            {/* Chair legs with more detail */}
            <group>
              {/* Front legs */}
              <mesh castShadow receiveShadow position={[0.2, 0.1, 0.2]}>
                <cylinderGeometry args={[0.025, 0.03, 0.3, 8]} />
                <meshStandardMaterial color={new THREE.Color(item.color).offsetHSL(0, 0, -0.3)} />
              </mesh>
              <mesh castShadow receiveShadow position={[-0.2, 0.1, 0.2]}>
                <cylinderGeometry args={[0.025, 0.03, 0.3, 8]} />
                <meshStandardMaterial color={new THREE.Color(item.color).offsetHSL(0, 0, -0.3)} />
              </mesh>

              {/* Back legs - taller and angled */}
              <group position={[0.2, 0.3, -0.2]} rotation={[0.2, 0, 0]}>
                <mesh castShadow receiveShadow position={[0, -0.2, 0]}>
                  <cylinderGeometry args={[0.025, 0.03, 0.7, 8]} />
                  <meshStandardMaterial color={new THREE.Color(item.color).offsetHSL(0, 0, -0.3)} />
                </mesh>
              </group>
              <group position={[-0.2, 0.3, -0.2]} rotation={[0.2, 0, 0]}>
                <mesh castShadow receiveShadow position={[0, -0.2, 0]}>
                  <cylinderGeometry args={[0.025, 0.03, 0.7, 8]} />
                  <meshStandardMaterial color={new THREE.Color(item.color).offsetHSL(0, 0, -0.3)} />
                </mesh>
              </group>

              {/* Support bars */}
              <mesh castShadow receiveShadow position={[0, 0, 0.2]} rotation={[0, Math.PI / 2, 0]}>
                <cylinderGeometry args={[0.015, 0.015, 0.4, 8]} />
                <meshStandardMaterial color={new THREE.Color(item.color).offsetHSL(0, 0, -0.3)} />
              </mesh>
              <mesh castShadow receiveShadow position={[0, 0, -0.2]} rotation={[0, Math.PI / 2, 0]}>
                <cylinderGeometry args={[0.015, 0.015, 0.4, 8]} />
                <meshStandardMaterial color={new THREE.Color(item.color).offsetHSL(0, 0, -0.3)} />
              </mesh>
              <mesh castShadow receiveShadow position={[0.2, 0, 0]} rotation={[0, 0, 0]}>
                <cylinderGeometry args={[0.015, 0.015, 0.4, 8]} />
                <meshStandardMaterial color={new THREE.Color(item.color).offsetHSL(0, 0, -0.3)} />
              </mesh>
              <mesh castShadow receiveShadow position={[-0.2, 0, 0]} rotation={[0, 0, 0]}>
                <cylinderGeometry args={[0.015, 0.015, 0.4, 8]} />
                <meshStandardMaterial color={new THREE.Color(item.color).offsetHSL(0, 0, -0.3)} />
              </mesh>
            </group>

            {/* Chair feet */}
            <mesh castShadow receiveShadow position={[0.2, -0.05, 0.2]}>
              <sphereGeometry args={[0.03, 8, 8, 0, Math.PI]} />
              <meshStandardMaterial color="#333" metalness={0.8} roughness={0.2} />
            </mesh>
            <mesh castShadow receiveShadow position={[-0.2, -0.05, 0.2]}>
              <sphereGeometry args={[0.03, 8, 8, 0, Math.PI]} />
              <meshStandardMaterial color="#333" metalness={0.8} roughness={0.2} />
            </mesh>
            <mesh castShadow receiveShadow position={[0.2, -0.05, -0.2]}>
              <sphereGeometry args={[0.03, 8, 8, 0, Math.PI]} />
              <meshStandardMaterial color="#333" metalness={0.8} roughness={0.2} />
            </mesh>
            <mesh castShadow receiveShadow position={[-0.2, -0.05, -0.2]}>
              <sphereGeometry args={[0.03, 8, 8, 0, Math.PI]} />
              <meshStandardMaterial color="#333" metalness={0.8} roughness={0.2} />
            </mesh>
          </group>
        )

      default:
        return (
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial {...material} />
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
            {renderFurnitureModel()}
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
          {renderFurnitureModel()}
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
