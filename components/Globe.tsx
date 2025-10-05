'use client'

import React, { useRef, useState, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Sphere, Html, Stars, useTexture, useGLTF, Billboard } from '@react-three/drei'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import * as THREE from 'three'
import sitesData from '../data/sites.json'

interface WaypointProps {
  position: [number, number, number]
  site: any
  onClick: (site: any, position: [number, number, number]) => void
}

function Waypoint({ position, site, onClick }: WaypointProps) {
  const [hovered, setHovered] = useState(false)
  const texture = useTexture('/textures/tree.png')

  return (
    <group position={position}>
      <Billboard>
        <mesh
          onClick={() => onClick(site, position)}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          scale={hovered ? 0.15 : 0.15}
        >
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial map={texture} transparent />
        </mesh>
      </Billboard>

      <Html position={[0, 0.004, 0]} distanceFactor={5}>
        <div
          className="text-white text-[5px] font-medium text-center w-fit glass rounded-lg px-1 py-[0.5px] cursor-pointer"
          onClick={() => onClick(site, position)}
        >
          {site.name}
        </div>
      </Html>
    </group>
  )
}

function Earth() {
  const earthTexture = useTexture('/textures/earth_daymap.jpg')
  return (
    <Sphere args={[1, 64, 64]}>
      <meshStandardMaterial map={earthTexture} roughness={0.7} metalness={0.2} />
    </Sphere>
  )
}

interface CameraControllerProps {
  target: THREE.Vector3 | null
  followTarget?: THREE.Object3D | null
  zooming?: boolean
  zoomPhase?: 'back' | 'in' | null
  onZoomPhaseChange?: (phase: 'back' | 'in' | null) => void
  onZoomComplete?: () => void
}

function CameraController({
  target,
  followTarget,
  zooming,
  zoomPhase,
  onZoomPhaseChange,
  onZoomComplete
}: CameraControllerProps) {
  const { camera } = useThree()
  const zoomProgress = useRef(0)
  const triggeredRedirect = useRef(false)

  useFrame((_, delta) => {
    if (followTarget && followTarget.position) {
      const targetPos = followTarget.position.clone().add(new THREE.Vector3(0, 0.2, 0))
      camera.position.lerp(targetPos, 0.05)
      camera.lookAt(followTarget.position)
    } else if (target && zooming) {
      zoomProgress.current += delta

      if (zoomPhase === 'back') {
        const backOffset = camera.getWorldDirection(new THREE.Vector3()).multiplyScalar(-0.8)
        const backPos = camera.position.clone().add(backOffset)
        camera.position.lerp(backPos, 0.1)
        camera.lookAt(0, 0, 0)

        if (zoomProgress.current >= 0.5) {
          zoomProgress.current = 0
          onZoomPhaseChange?.('in')
        }
      } else if (zoomPhase === 'in') {
        if (!triggeredRedirect.current) {
          triggeredRedirect.current = true
          onZoomComplete?.()
        }

        zoomProgress.current = Math.min(1, zoomProgress.current / 1.5)
        const eased = Math.pow(zoomProgress.current, 2)
        const dir = target.clone().normalize()
        const lateral = new THREE.Vector3(0, 0.2, 0)
        const zoomVector = dir.clone().multiplyScalar(1 - 0.01 * eased).add(lateral)
        camera.position.lerp(zoomVector, 0.12)
        camera.lookAt(0, 0, 0)
      }
    } else if (target) {
      camera.position.lerp(target, 0.05)
      camera.lookAt(0, 0, 0)
    }
  })

  return null
}

interface SatelliteProps {
  name: string
  altitude: number
  speed: number
  info: string
  onSelectCamera: (position: THREE.Vector3 | null) => void
  onSelectSatellite: (satellite: any | null) => void
  onFollowRef: (ref: THREE.Group | null) => void
}
function Satellite({ name, altitude, speed, info, onSelectCamera, onSelectSatellite, onFollowRef }: SatelliteProps) {
  const meshRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)
  const [selected, setSelected] = useState(false)
  const angle = useRef(Math.PI)
  const gltf = useGLTF('/models/satellites.glb') as any

  useFrame((_, delta) => {
    angle.current += delta * speed
    if (meshRef.current) {
      const x = altitude * Math.cos(angle.current)
      const z = altitude * Math.sin(angle.current)
      const y = 0.3
      meshRef.current.position.set(x, y, z)

      meshRef.current.lookAt(12,-20,-2)
    }
  })

  const handleClick = () => {
    setSelected(!selected)
    if (!selected && meshRef.current) {
      onFollowRef(meshRef.current)
      onSelectSatellite({ name, info })
    } else {
      onFollowRef(null)
      onSelectSatellite(null)
    }
  }

  return (
    <group>
      <group
        ref={meshRef}
        scale={0.05}
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {/* Luz que solo afecta al satélite */}
        <pointLight position={[-10, 2, 5]} intensity={1} distance={1} color="#00ffff" />
        <primitive object={gltf.scene} />
        
        {/* Nametag */}
        <Html position={[0, -0.4, 0]} distanceFactor={4}>
          <div className="text-white text-xs text-center bg-black/40 w-fit px-2 py-[2px] rounded-md pointer-events-none">
            {name}
          </div>
        </Html>
      </group>

      {/* Cambia el cursor al hacer hover */}
      {hovered && (
        <Html>
          <style>{`canvas { cursor: pointer !important; }`}</style>
        </Html>
      )}
    </group>
  )
}

function Globe() {
  const router = useRouter()
  const [selectedSite, setSelectedSite] = useState<any>(null)
  const [cameraTarget, setCameraTarget] = useState<THREE.Vector3 | null>(null)
  const [selectedSatellite, setSelectedSatellite] = useState<any | null>(null)
  const [satelliteRef, setSatelliteRef] = useState<THREE.Group | null>(null)
  const [isZooming, setIsZooming] = useState(false)
  const [zoomPhase, setZoomPhase] = useState<'back' | 'in' | null>(null)

  const isFollowingSatellite = !!selectedSatellite && !!satelliteRef

  const waypoints = useMemo(() => {
    return sitesData.sites.map((site) => {
      const phi = (90 - site.coordinates[0]) * (Math.PI / 180)
      const theta = (site.coordinates[1] + 180) * (Math.PI / 180)
      const x = -(1.1 * Math.sin(phi) * Math.cos(theta))
      const y = 1.1 * Math.cos(phi)
      const z = 1.1 * Math.sin(phi) * Math.sin(theta)
      return { position: [x, y, z] as [number, number, number], site }
    })
  }, [])

  const handleWaypointClick = (site: any, position: [number, number, number]) => {
    setSelectedSite(site)
    setSelectedSatellite(null)
    setSatelliteRef(null)
    const offset = new THREE.Vector3(position[0], position[1], position[2]).multiplyScalar(1.5)
    setCameraTarget(offset)
  }

  const handleInvestigate = () => {
    if (selectedSite) {
      setIsZooming(true)
      setZoomPhase('back')
    }
  }

  const handleZoomComplete = () => {
    if (selectedSite) router.push(`/site/${selectedSite.id}`)
  }

  const handleCloseSatellite = () => {
    setSelectedSatellite(null)
    setSatelliteRef(null)
    setCameraTarget(null)
  }

  const handleCloseFocus = () => {
    setSelectedSite(null)
    setCameraTarget(null)
    setIsZooming(false)
    setZoomPhase(null)
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Canvas camera={{ position: [0, 0, 3], fov: 75 }} className="w-full h-full">
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0.5} fade />
        <hemisphereLight intensity={2.4} />

        <Earth />

        {!isFollowingSatellite &&
          waypoints.map((wp) => (
            <Waypoint key={wp.site.id} position={wp.position} site={wp.site} onClick={handleWaypointClick} />
          ))}

        <Satellite
          name="SAR Satellite"
          altitude={1.5}
          speed={0.1}
          info="Radar de observación terrestre"
          onSelectCamera={setCameraTarget}
          onSelectSatellite={setSelectedSatellite}
          onFollowRef={setSatelliteRef}
        />
        <directionalLight position={[5, 3, 5]} intensity={1.2} />
        <pointLight position={[-5, -3, -5]} intensity={0.5} color="yellow" />


        <OrbitControls
          enablePan={false}
          enableZoom
          enableRotate={!isZooming}
          autoRotate={!isZooming && !selectedSatellite}
          autoRotateSpeed={0.5}
          minDistance={2}
          maxDistance={5}
        />

        <CameraController
          target={cameraTarget}
          followTarget={satelliteRef}
          zooming={isZooming}
          zoomPhase={zoomPhase}
          onZoomPhaseChange={setZoomPhase}
          onZoomComplete={handleZoomComplete}
        />
      </Canvas>

      {/* Panel sitio */}
      {selectedSite && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, x: 50 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.8, x: 50 }}
          className="absolute top-1/2 right-8 transform -translate-y-1/2 z-20"
        >
          <div className="glass rounded-2xl p-6 max-w-sm border border-white/20 relative">
            <button
              onClick={handleCloseFocus}
              className="absolute top-3 right-3 text-gray-400 hover:text-white text-lg font-bold"
              aria-label="Cerrar focus"
            >
              ×
            </button>

            <div className="flex items-center mb-4">
              <div className="w-3 h-3 bg-neon-cyan rounded-full mr-3 animate-pulse" />
              <h3 className="text-xl font-semibold text-white">{selectedSite.name}</h3>
            </div>
            <p className="text-gray-300 text-sm mb-4 leading-relaxed">{selectedSite.description}</p>
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Trees Affected:</span>
                <span className="text-neon-green font-medium">
                  {selectedSite.deforestationData.treesAffected.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Area (km²):</span>
                <span className="text-neon-cyan font-medium">
                  {selectedSite.deforestationData.areaAffected}
                </span>
              </div>
            </div>
            <button
              onClick={handleInvestigate}
              className="w-full bg-gradient-to-r from-neon-cyan to-neon-purple text-white py-3 px-6 rounded-lg font-medium hover:shadow-lg hover:shadow-neon-cyan/25 transition-all duration-300 transform hover:scale-105"
            >
              🔍 Investigate Site
            </button>
          </div>
        </motion.div>
      )}

      {/* Panel satélite */}
      {selectedSatellite && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, x: 50 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.8, x: 50 }}
          className="absolute top-1/2 right-8 transform -translate-y-1/2 z-20"
        >
          <div className="glass rounded-2xl p-6 max-w-sm border border-white/20 relative">
            <button
              onClick={handleCloseSatellite}
              className="absolute top-3 right-3 text-gray-400 hover:text-white text-lg font-bold"
              aria-label="Cerrar"
            >
              ×
            </button>
            <div className="flex items-center mb-4">
              <div className="w-3 h-3 bg-neon-yellow rounded-full mr-3 animate-pulse" />
              <h3 className="text-xl font-semibold text-white">📡 {selectedSatellite.name}</h3>
            </div>
            <p className="text-gray-300 text-sm mb-4 leading-relaxed">{selectedSatellite.info}</p>
            <button
              onClick={() => router.push('https://www.earthdata.nasa.gov/learn/earth-observation-data-basics/sar')}
              className="w-full bg-gradient-to-r from-neon-cyan to-neon-purple text-white py-3 px-6 rounded-lg font-medium hover:shadow-lg hover:shadow-neon-cyan/25 transition-all duration-300 transform hover:scale-105"
            >
              Saber más
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default Globe
