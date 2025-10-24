'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface Whale {
  id: string
  position: [number, number, number]
  size: number
  activity: number
}

interface Connection {
  from: string
  to: string
  strength: number
}

export const WhaleNetworkVisualization = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const whalesRef = useRef<Map<string, THREE.Mesh>>(new Map())
  const connectionsRef = useRef<THREE.Line[]>([])

  useEffect(() => {
    if (!containerRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0a0e27)
    scene.fog = new THREE.Fog(0x0a0e27, 100, 500)
    sceneRef.current = scene

    // Camera setup
    const width = containerRef.current.clientWidth
    const height = containerRef.current.clientHeight
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 10000)
    camera.position.z = 50
    cameraRef.current = camera

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.shadowMap.enabled = true
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const pointLight = new THREE.PointLight(0x7c8fff, 100)
    pointLight.position.set(50, 50, 50)
    pointLight.castShadow = true
    scene.add(pointLight)

    const pointLight2 = new THREE.PointLight(0x06b6d4, 50)
    pointLight2.position.set(-50, -50, 30)
    scene.add(pointLight2)

    // Create whale nodes
    const whales: Whale[] = [
      { id: 'whale_1', position: [0, 0, 0], size: 3, activity: 0.9 },
      { id: 'whale_2', position: [20, 15, 10], size: 2.5, activity: 0.7 },
      { id: 'whale_3', position: [-20, 15, 10], size: 2, activity: 0.6 },
      { id: 'whale_4', position: [15, -15, 5], size: 1.8, activity: 0.5 },
      { id: 'whale_5', position: [-15, -15, 5], size: 1.5, activity: 0.4 },
    ]

    const whaleGeometry = new THREE.IcosahedronGeometry(1, 16)
    
    whales.forEach((whale) => {
      const material = new THREE.MeshPhongMaterial({
        color: new THREE.Color().setHSL(0.6 + Math.random() * 0.1, 0.8, 0.5),
        emissive: new THREE.Color().setHSL(0.6 + Math.random() * 0.1, 0.8, 0.3),
        shininess: 100,
      })

      const mesh = new THREE.Mesh(whaleGeometry, material)
      mesh.position.set(...whale.position)
      mesh.scale.set(whale.size, whale.size, whale.size)
      mesh.castShadow = true
      mesh.receiveShadow = true
      
      scene.add(mesh)
      whalesRef.current.set(whale.id, mesh)
    })

    // Create connections
    const connections: Connection[] = [
      { from: 'whale_1', to: 'whale_2', strength: 0.8 },
      { from: 'whale_1', to: 'whale_3', strength: 0.7 },
      { from: 'whale_2', to: 'whale_4', strength: 0.5 },
      { from: 'whale_3', to: 'whale_5', strength: 0.6 },
    ]

    connections.forEach((conn) => {
      const from = whalesRef.current.get(conn.from)
      const to = whalesRef.current.get(conn.to)

      if (from && to) {
        const points = [from.position, to.position]
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points)
        
        const lineMaterial = new THREE.LineBasicMaterial({
          color: 0x06b6d4,
          transparent: true,
          opacity: conn.strength * 0.6,
          linewidth: 2,
        })

        const line = new THREE.Line(lineGeometry, lineMaterial)
        scene.add(line)
        connectionsRef.current.push(line)
      }
    })

    // Animation loop
    let animationFrameId: number
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)

      // Rotate whales
      whalesRef.current.forEach((mesh) => {
        mesh.rotation.x += 0.002
        mesh.rotation.y += 0.003
      })

      // Pulse animation
      whalesRef.current.forEach((mesh) => {
        const originalScale = mesh.userData.originalScale || mesh.scale.x
        mesh.userData.originalScale = originalScale
        
        const pulse = Math.sin(Date.now() * 0.001) * 0.2
        mesh.scale.set(
          originalScale + pulse * 0.3,
          originalScale + pulse * 0.3,
          originalScale + pulse * 0.3
        )
      })

      // Rotate camera around scene
      camera.position.x = Math.cos(Date.now() * 0.0002) * 50
      camera.position.y = Math.sin(Date.now() * 0.0001) * 30
      camera.lookAt(0, 0, 0)

      renderer.render(scene, camera)
    }

    animate()

    // Handle window resize
    const handleResize = () => {
      const newWidth = containerRef.current?.clientWidth || width
      const newHeight = containerRef.current?.clientHeight || height

      camera.aspect = newWidth / newHeight
      camera.updateProjectionMatrix()
      renderer.setSize(newWidth, newHeight)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameId)
      renderer.dispose()
      containerRef.current?.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative overflow-hidden bg-gradient-to-b from-conviction-950 to-conviction-900"
    />
  )
}

export default WhaleNetworkVisualization
