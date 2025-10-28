/**
 * THREE.JS 3D SCENE COMPONENT
 * Data visualization representing prediction markets
 */

'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sphere, Line } from '@react-three/drei'
import * as THREE from 'three'

// Market data cubes (representing different prediction markets)
function MarketCubes() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.1
    }
  })

  const cubes = useMemo(() => {
    const positions = []
    const radius = 3
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2
      positions.push({
        x: Math.cos(angle) * radius,
        y: Math.sin(angle * 0.5) * 0.5,
        z: Math.sin(angle) * radius,
        scale: 0.3 + Math.random() * 0.3,
        speed: 0.5 + Math.random() * 0.5,
      })
    }
    return positions
  }, [])

  return (
    <group ref={groupRef}>
      {cubes.map((pos, i) => (
        <MarketCube key={i} position={[pos.x, pos.y, pos.z]} scale={pos.scale} speed={pos.speed} />
      ))}
    </group>
  )
}

function MarketCube({ position, scale, speed }: { position: [number, number, number], scale: number, speed: number }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * speed * 0.3
      meshRef.current.rotation.y = state.clock.getElapsedTime() * speed * 0.2
      meshRef.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() * speed) * 0.2
    }
  })

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color="#3b82f6"
        metalness={0.8}
        roughness={0.2}
        emissive="#1e40af"
        emissiveIntensity={0.2}
        wireframe={false}
      />
    </mesh>
  )
}

// Network connections (representing data flow between markets)
function NetworkConnections() {
  const lines = useMemo(() => {
    const connections = []
    const radius = 3
    for (let i = 0; i < 8; i++) {
      const angle1 = (i / 8) * Math.PI * 2
      const angle2 = ((i + 1) / 8) * Math.PI * 2
      connections.push({
        start: [
          Math.cos(angle1) * radius,
          Math.sin(angle1 * 0.5) * 0.5,
          Math.sin(angle1) * radius
        ] as [number, number, number],
        end: [
          Math.cos(angle2) * radius,
          Math.sin(angle2 * 0.5) * 0.5,
          Math.sin(angle2) * radius
        ] as [number, number, number]
      })
    }
    return connections
  }, [])

  return (
    <group>
      {lines.map((line, i) => (
        <Line
          key={i}
          points={[line.start, line.end]}
          color="#3b82f6"
          lineWidth={1}
          transparent
          opacity={0.3}
        />
      ))}
    </group>
  )
}

// Central core (representing the analytics engine)
function AnalyticsCore() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.1
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.15
    }
  })

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1, 1]} />
      <meshStandardMaterial
        color="#3b82f6"
        metalness={0.9}
        roughness={0.1}
        emissive="#3b82f6"
        emissiveIntensity={0.5}
        wireframe
      />
    </mesh>
  )
}

// Data points (representing market activity / smart money)
function DataPoints() {
  const particlesRef = useRef<THREE.Points>(null)

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.getElapsedTime() * 0.03
    }
  })

  const particleCount = 500
  const positions = new Float32Array(particleCount * 3)

  // Distribute particles in a sphere around the center
  for (let i = 0; i < particleCount; i++) {
    const radius = 5 + Math.random() * 5
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos((Math.random() * 2) - 1)
    
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = radius * Math.cos(phi)
  }

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#3b82f6"
        transparent
        opacity={0.5}
        sizeAttenuation
      />
    </points>
  )
}

export function ThreeScene() {
  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 0 }}>
      <Canvas camera={{ position: [0, 0, 8], fov: 75 }}>
        <ambientLight intensity={0.2} />
        <directionalLight position={[10, 10, 5]} intensity={0.5} color="#3b82f6" />
        <pointLight position={[-10, -10, -5]} intensity={0.4} color="#1e40af" />
        <pointLight position={[0, 0, 0]} intensity={0.8} color="#3b82f6" />
        
        {/* Central analytics core */}
        <AnalyticsCore />
        
        {/* Market cubes representing different prediction markets */}
        <MarketCubes />
        
        {/* Network connections showing data flow */}
        <NetworkConnections />
        
        {/* Data points representing market activity */}
        <DataPoints />
        
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.3}
        />
      </Canvas>
    </div>
  )
}

