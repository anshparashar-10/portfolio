import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

const R = 2

/* Convert lat/lon (degrees) to a point on the sphere */
function toVec3(lat, lon, radius = R) {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lon + 180) * (Math.PI / 180)
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  )
}

/* Sample the land/ocean mask and build a dotted land map */
function useLandDots(step = 1.6) {
  const [positions, setPositions] = useState(null)

  useEffect(() => {
    let cancelled = false
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = '/earth-spec.jpg'
    img.onload = () => {
      if (cancelled) return
      const w = 1024
      const h = 512
      const cv = document.createElement('canvas')
      cv.width = w
      cv.height = h
      const ctx = cv.getContext('2d', { willReadFrequently: true })
      ctx.drawImage(img, 0, 0, w, h)
      const { data } = ctx.getImageData(0, 0, w, h)

      const pts = []
      for (let lat = -85; lat <= 85; lat += step) {
        // keep dot spacing even by scaling longitude steps with latitude
        const lonStep = step / Math.max(0.15, Math.cos((lat * Math.PI) / 180))
        for (let lon = -180; lon < 180; lon += lonStep) {
          const x = Math.floor(((lon + 180) / 360) * w)
          const y = Math.floor(((90 - lat) / 180) * h)
          const i = (y * w + x) * 4
          // in the specular map, ocean is bright and land is dark
          if (data[i] < 90) {
            const v = toVec3(lat, lon, R + 0.012)
            pts.push(v.x, v.y, v.z)
          }
        }
      }
      setPositions(new Float32Array(pts))
    }
    return () => { cancelled = true }
  }, [step])

  return positions
}

function LandDots() {
  const positions = useLandDots()
  if (!positions) return null
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.028} color="#7DE3F4" transparent opacity={0.95} sizeAttenuation />
    </points>
  )
}

function Marker({ lat, lon }) {
  const ref = useRef()
  const pos = useMemo(() => toVec3(lat, lon, R + 0.06), [lat, lon])
  useFrame(({ clock }) => {
    if (ref.current) ref.current.scale.setScalar(1 + Math.sin(clock.elapsedTime * 2.2) * 0.3)
  })
  return (
    <group position={pos}>
      <mesh ref={ref}>
        <sphereGeometry args={[0.055, 16, 16]} />
        <meshBasicMaterial color="#F43F5E" />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.11, 16, 16]} />
        <meshBasicMaterial color="#F43F5E" transparent opacity={0.22} />
      </mesh>
    </group>
  )
}

function Earth() {
  const group = useRef()
  const map = useLoader(THREE.TextureLoader, '/earth.jpg')

  useFrame((_, d) => {
    if (group.current) group.current.rotation.y += d * 0.045
  })

  return (
    <group ref={group}>
      {/* textured earth, tinted toward the site palette */}
      <mesh>
        <sphereGeometry args={[R, 64, 64]} />
        <meshStandardMaterial
          map={map}
          color="#5C8FA8"
          emissive="#062A38"
          emissiveIntensity={0.45}
          roughness={0.95}
          metalness={0.05}
        />
      </mesh>

      {/* graticule */}
      <mesh>
        <sphereGeometry args={[R + 0.005, 36, 24]} />
        <meshBasicMaterial color="#22D3EE" wireframe transparent opacity={0.12} />
      </mesh>

      {/* dotted landmasses */}
      <LandDots />

      {/* atmosphere */}
      <mesh>
        <sphereGeometry args={[R + 0.18, 48, 48]} />
        <meshBasicMaterial color="#22D3EE" transparent opacity={0.06} side={THREE.BackSide} />
      </mesh>

      <Marker lat={22.72} lon={75.86} />
    </group>
  )
}

export default function Globe({ className = '' }) {
  return (
    <div className={`h-[260px] w-full cursor-grab active:cursor-grabbing sm:h-[400px] lg:h-[560px] ${className}`}>
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 2]}>
        <ambientLight intensity={0.7} />
        <pointLight position={[6, 4, 6]} intensity={110} color="#EAF6FF" />
        <pointLight position={[-6, -3, -4]} intensity={45} color="#3B82F6" />
        <Suspense fallback={null}>
          <Earth />
        </Suspense>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          rotateSpeed={0.45}
          autoRotate
          autoRotateSpeed={0.3}
        />
      </Canvas>
    </div>
  )
}
