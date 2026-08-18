import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Saturn, BlackHole, Planet, Spaceship } from './models'

const MODELS = { saturn: Saturn, blackhole: BlackHole, planet: Planet, spaceship: Spaceship }

/**
 * Ambient 3D decoration.
 *
 * interactive  -> drag to rotate + auto-rotate, like the hero globe
 * camera       -> distance; larger = smaller-looking model
 */
export default function Decor({
  model,
  className = '',
  camera = 6,
  props = {},
  interactive = false,
  autoRotateSpeed = 0.6,
}) {
  const holder = useRef(null)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const el = holder.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), {
      rootMargin: '400px',
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const Model = MODELS[model]
  if (!Model) {
    console.warn(`<Decor> unknown model "${model}". Expected: ${Object.keys(MODELS).join(', ')}`)
    return null
  }

  return (
    <div
      ref={holder}
      aria-hidden={!interactive}
      className={`absolute select-none ${interactive ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none'} ${className}`}
    >
      {visible && (
        <Canvas
          camera={{ position: [0, 0, camera], fov: 45 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true }}
          style={{ background: 'transparent' }}
        >
          <ambientLight intensity={0.6} />
          <pointLight position={[5, 4, 5]} intensity={80} color="#ffffff" />
          <pointLight position={[-5, -2, -3]} intensity={35} color="#3B82F6" />
          <Suspense fallback={null}>
            <Model {...props} />
          </Suspense>
          {interactive && (
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              rotateSpeed={0.45}
              autoRotate
              autoRotateSpeed={autoRotateSpeed}
            />
          )}
        </Canvas>
      )}
    </div>
  )
}
