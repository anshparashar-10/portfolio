import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'

/* Freeze rotation for reduced-motion users, but still render the model */
const STILL =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* Load a texture without suspending or throwing.
   Logs a clear message and falls back to a procedural map if the file is missing. */
export function useSafeTexture(url) {
  const [tex, setTex] = useState(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let alive = true
    setTex(null)
    setFailed(false)
    new THREE.TextureLoader().load(
      url,
      (t) => {
        if (!alive) return
        t.colorSpace = THREE.SRGBColorSpace
        t.anisotropy = 4
        t.needsUpdate = true
        setTex(t)
      },
      undefined,
      () => {
        if (!alive) return
        console.error(
          `[Decor] Texture failed to load: "${url}".\n` +
          `Expected the file at: public${url}\n` +
          `Check the Network tab for a 404 on ${url}.`
        )
        setFailed(true)
      },
    )
    return () => { alive = false }
  }, [url])

  return { tex, failed }
}

/* Banded procedural planet map, used when a texture file is missing */
export function useProceduralPlanet(base = '#2E5C9A', bands = '#1B3E70') {
  return useMemo(() => {
    const c = document.createElement('canvas')
    c.width = 512; c.height = 256
    const ctx = c.getContext('2d')
    ctx.fillStyle = base
    ctx.fillRect(0, 0, 512, 256)
    for (let i = 0; i < 26; i++) {
      const y = Math.random() * 256
      const h = 4 + Math.random() * 16
      ctx.globalAlpha = 0.12 + Math.random() * 0.3
      ctx.fillStyle = bands
      ctx.fillRect(0, y, 512, h)
    }
    ctx.globalAlpha = 1
    const t = new THREE.CanvasTexture(c)
    t.colorSpace = THREE.SRGBColorSpace
    return t
  }, [base, bands])
}

/* Generated indoor environment -> believable metal reflections, no HDRI download */
export function useStudioEnv() {
  const { gl, scene } = useThree()
  useMemo(() => {
    const pmrem = new THREE.PMREMGenerator(gl)
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    pmrem.dispose()
  }, [gl, scene])
  return null
}

/* Flat annulus whose UVs run radially, so a ring strip maps correctly */
function ringGeometry(inner, outer, segments = 180) {
  const g = new THREE.RingGeometry(inner, outer, segments)
  const pos = g.attributes.position
  const uv = g.attributes.uv
  const v = new THREE.Vector3()
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i)
    const t = (v.length() - inner) / (outer - inner)
    uv.setXY(i, t, 1)
  }
  return g
}

/* ---------------- Saturn ---------------- */
/* Ring alpha is generated in-code, so only the JPG surface map is required */
function useRingTexture() {
  return useMemo(() => {
    const w = 512
    const c = document.createElement('canvas')
    c.width = w; c.height = 8
    const ctx = c.getContext('2d')
    // banded ring system: [start, end, alpha, tint]
    const bands = [
      [0.00, 0.06, 0.00, '#000000'],
      [0.06, 0.30, 0.55, '#C8B48A'],
      [0.30, 0.42, 0.80, '#E4D3A8'],
      [0.42, 0.47, 0.08, '#000000'],  // Cassini Division
      [0.47, 0.78, 0.85, '#D8C69C'],
      [0.78, 0.90, 0.45, '#B09B72'],
      [0.90, 1.00, 0.00, '#000000'],
    ]
    ctx.clearRect(0, 0, w, 8)
    bands.forEach(([a, b, alpha, tint]) => {
      ctx.globalAlpha = alpha
      ctx.fillStyle = tint
      ctx.fillRect(a * w, 0, (b - a) * w, 8)
    })
    // fine striations
    ctx.globalAlpha = 0.12
    ctx.fillStyle = '#8A7550'
    for (let i = 0; i < 90; i++) {
      const x = 0.06 * w + Math.random() * 0.84 * w
      ctx.fillRect(x, 0, 1 + Math.random() * 2, 8)
    }
    ctx.globalAlpha = 1
    const t = new THREE.CanvasTexture(c)
    t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping
    return t
  }, [])
}

export function Saturn() {
  const g = useRef()
  useStudioEnv()
  const { tex: map, failed } = useSafeTexture('/tex/saturnmap.jpg')
  const fallback = useProceduralPlanet('#C9A227', '#9A7B1C')
  const ring = useRingTexture()
  const ringGeo = useMemo(() => ringGeometry(1.35, 2.3), [])

  useFrame((_, d) => { if (g.current && !STILL) g.current.rotation.y += d * 0.12 })

  return (
    <group rotation={[0.42, 0, 0.36]}>
      <group ref={g}>
        <mesh>
          <sphereGeometry args={[1, 96, 96]} />
          <meshStandardMaterial
            key={map ? 'tex' : failed ? 'fallback' : 'pending'}
            map={failed ? fallback : map}
            color="#ffffff"
            roughness={0.92}
            metalness={0.02}
          />
        </mesh>
      </group>
      <mesh geometry={ringGeo} rotation={[-Math.PI / 2, 0, 0]}>
        <meshBasicMaterial
          map={ring}
          side={THREE.DoubleSide}
          transparent
          opacity={0.95}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}

/* ---------------- Black hole ---------------- */
function AccretionDisk({ inner, outer, color, opacity, speed, tilt = 0 }) {
  const ref = useRef()
  const geo = useMemo(() => ringGeometry(inner, outer, 220), [inner, outer])
  const tex = useMemo(() => {
    // procedural streaky gradient so the disk reads as hot gas, not flat plastic
    const c = document.createElement('canvas')
    c.width = 256; c.height = 8
    const ctx = c.getContext('2d')
    const grad = ctx.createLinearGradient(0, 0, 256, 0)
    grad.addColorStop(0, 'rgba(255,255,255,1)')
    grad.addColorStop(0.15, 'rgba(255,214,140,0.95)')
    grad.addColorStop(0.5, 'rgba(245,158,11,0.55)')
    grad.addColorStop(0.85, 'rgba(180,83,9,0.18)')
    grad.addColorStop(1, 'rgba(120,53,15,0)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 256, 8)
    const t = new THREE.CanvasTexture(c)
    t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping
    return t
  }, [])

  useFrame((_, d) => { if (ref.current && !STILL) ref.current.rotation.z += d * speed })

  return (
    <mesh ref={ref} geometry={geo} rotation={[-Math.PI / 2 + tilt, 0, 0]}>
      <meshBasicMaterial
        map={tex}
        color={color}
        side={THREE.DoubleSide}
        transparent
        opacity={opacity}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  )
}

export function BlackHole() {
  const halo = useRef()
  useFrame(({ clock }) => {
    if (halo.current && !STILL) {
      halo.current.scale.setScalar(1 + Math.sin(clock.elapsedTime * 1.3) * 0.035)
    }
  })

  return (
    <group rotation={[1.05, 0, 0.18]}>
      {/* event horizon */}
      <mesh>
        <sphereGeometry args={[0.8, 64, 64]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      {/* photon ring */}
      <mesh ref={halo}>
        <sphereGeometry args={[0.84, 64, 64]} />
        <meshBasicMaterial
          color="#FFE7B0"
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>
      <AccretionDisk inner={1.05} outer={2.7} color="#FFB347" opacity={0.9} speed={0.55} />
      <AccretionDisk inner={1.4} outer={3.3} color="#F59E0B" opacity={0.35} speed={-0.3} tilt={0.09} />
      <AccretionDisk inner={0.95} outer={1.6} color="#FFFFFF" opacity={0.5} speed={0.9} tilt={-0.05} />
    </group>
  )
}

/* ---------------- Textured planet ---------------- */
const PLANET_TEX = {
  jupiter: '/tex/jupitermap.jpg',
  neptune: '/tex/neptunemap.jpg',
  mars: '/tex/marsmap1k.jpg',
  saturn: '/tex/saturnmap.jpg',
}

const fallbackBase = { jupiter: '#C08B5C', saturn: '#C9A227', neptune: '#2E5C9A', mars: '#A8482B' }

export function Planet({ body = 'neptune', speed = 0.1, atmosphere = '#3B82F6' }) {
  const m = useRef()
  const { tex: map, failed } = useSafeTexture(PLANET_TEX[body] || PLANET_TEX.neptune)
  const fallback = useProceduralPlanet(fallbackBase[body] || '#2E5C9A')
  useFrame((_, d) => { if (m.current && !STILL) m.current.rotation.y += d * speed })

  return (
    <group>
      <mesh ref={m}>
        <sphereGeometry args={[1.6, 96, 96]} />
        <meshStandardMaterial
          key={map ? 'tex' : failed ? 'fallback' : 'pending'}
          map={failed ? fallback : map}
          color="#ffffff"
          roughness={0.95}
          metalness={0.02}
        />
      </mesh>
      {/* thin limb glow */}
      <mesh scale={1.05}>
        <sphereGeometry args={[1.6, 64, 64]} />
        <meshBasicMaterial
          color={atmosphere}
          transparent
          opacity={0.12}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  )
}

/* ---------------- Spaceship ---------------- */
export function Spaceship() {
  const g = useRef()
  useStudioEnv()

  useFrame(({ clock }, d) => {
    if (!g.current || STILL) return
    g.current.rotation.y += d * 0.2
    g.current.position.y = Math.sin(clock.elapsedTime * 0.7) * 0.15
  })

  const hull = { color: '#B9C0C7', metalness: 0.95, roughness: 0.22, envMapIntensity: 1.4 }
  const dark = { color: '#3A4048', metalness: 0.9, roughness: 0.35, envMapIntensity: 1.1 }

  return (
    <group ref={g} rotation={[0.26, 0, 0.12]} scale={0.8}>
      {/* fuselage */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.3, 1.6, 12, 32]} />
        <meshStandardMaterial {...hull} />
      </mesh>
      {/* nose */}
      <mesh position={[1.42, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.3, 0.75, 32]} />
        <meshStandardMaterial {...hull} roughness={0.15} />
      </mesh>
      {/* hull banding */}
      {[0.55, 0.05, -0.5].map((x) => (
        <mesh key={x} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.315, 0.315, 0.07, 32]} />
          <meshStandardMaterial {...dark} />
        </mesh>
      ))}
      {/* swept wings */}
      {[-1, 1].map((s) => (
        <group key={s} position={[-0.15, -0.05, s * 0.34]} rotation={[0, s * -0.22, 0]}>
          <mesh>
            <boxGeometry args={[1.05, 0.06, 0.62]} />
            <meshStandardMaterial {...hull} />
          </mesh>
          <mesh position={[-0.45, 0, 0.3]}>
            <boxGeometry args={[0.3, 0.05, 0.34]} />
            <meshStandardMaterial {...dark} />
          </mesh>
          {/* wingtip light */}
          <mesh position={[0.5, 0, 0.28]}>
            <sphereGeometry args={[0.045, 16, 16]} />
            <meshBasicMaterial color={s > 0 ? '#22D3EE' : '#F43F5E'} />
          </mesh>
        </group>
      ))}
      {/* dorsal fin */}
      <mesh position={[-0.82, 0.36, 0]} rotation={[0, 0, 0.15]}>
        <boxGeometry args={[0.6, 0.62, 0.05]} />
        <meshStandardMaterial {...hull} />
      </mesh>
      {/* cockpit canopy */}
      <mesh position={[0.5, 0.2, 0]} rotation={[0, 0, 0.1]} scale={[1.5, 0.7, 0.9]}>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshPhysicalMaterial
          color="#0E3A47"
          metalness={0.2}
          roughness={0.05}
          transmission={0.6}
          thickness={0.4}
          emissive="#22D3EE"
          emissiveIntensity={0.35}
        />
      </mesh>
      {/* engine housing */}
      <mesh position={[-1.02, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.26, 0.3, 0.3, 32]} />
        <meshStandardMaterial {...dark} />
      </mesh>
      {/* exhaust plume */}
      <mesh position={[-1.35, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <coneGeometry args={[0.22, 0.95, 32, 1, true]} />
        <meshBasicMaterial
          color="#67E8F9"
          transparent
          opacity={0.55}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <pointLight position={[-1.5, 0, 0]} intensity={6} color="#22D3EE" distance={3} />
    </group>
  )
}