import { useEffect, useRef } from 'react'

export default function Starfield({ density = 0.00012 }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let stars = []
    let raf

    const seed = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const count = Math.floor(window.innerWidth * window.innerHeight * density)
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 1.1 + 0.25,
        base: Math.random() * 0.5 + 0.25,
        speed: Math.random() * 0.0009 + 0.0002,
        phase: Math.random() * Math.PI * 2,
      }))
    }

    const draw = (t) => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
      for (const s of stars) {
        const a = reduced ? s.base : s.base + Math.sin(t * s.speed + s.phase) * 0.35
        ctx.globalAlpha = Math.max(0.05, Math.min(1, a))
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = '#ffffff'
        ctx.fill()
      }
      ctx.globalAlpha = 1
      raf = requestAnimationFrame(draw)
    }

    seed()
    raf = requestAnimationFrame(draw)
    window.addEventListener('resize', seed)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', seed)
    }
  }, [density])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10"
    />
  )
}
