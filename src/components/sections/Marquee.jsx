import { useEffect, useRef } from 'react'

const ITEMS = [
  'SPRING BOOT', 'POSTGRESQL', 'REACT', 'MICROSERVICES', 'LANGCHAIN',
  'DOCKER', 'NEXT.JS', 'HIBERNATE', 'AWS', 'SPRING MVC', 'JUNIT', 'TYPESCRIPT',
]

function Track() {
  return (
    <ul className="flex shrink-0 items-center">
      {ITEMS.map((t) => (
        <li key={t} className="flex items-center font-mono text-xs tracking-[0.18em] text-white/40">
          <span className="whitespace-nowrap px-8">{t}</span>
          <span className="text-glow-cyan/60">/</span>
        </li>
      ))}
    </ul>
  )
}

/**
 * Infinite right-to-left marquee, driven by rAF so it ignores
 * prefers-reduced-motion CSS overrides. Drag to scrub; it keeps
 * your momentum and eases back to its base speed.
 */
export default function Marquee({ speed = 55 }) {
  const inner = useRef(null)
  const offset = useRef(0)
  const drag = useRef({ active: false, lastX: 0, velocity: 0 })

  useEffect(() => {
    let raf
    let prev = performance.now()

    const step = (now) => {
      const dt = Math.min((now - prev) / 1000, 0.05)
      prev = now

      const el = inner.current
      if (el) {
        const half = el.scrollWidth / 2
        if (half > 0) {
          if (!drag.current.active) {
            offset.current -= speed * dt
            offset.current += drag.current.velocity * dt
            drag.current.velocity *= 0.92          // momentum decay
            if (Math.abs(drag.current.velocity) < 1) drag.current.velocity = 0
          }
          // wrap seamlessly in both directions
          if (offset.current <= -half) offset.current += half
          if (offset.current > 0) offset.current -= half
          el.style.transform = `translate3d(${offset.current}px, 0, 0)`
        }
      }
      raf = requestAnimationFrame(step)
    }

    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [speed])

  const onPointerDown = (e) => {
    drag.current.active = true
    drag.current.lastX = e.clientX
    drag.current.velocity = 0
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e) => {
    if (!drag.current.active) return
    const dx = e.clientX - drag.current.lastX
    drag.current.lastX = e.clientX
    offset.current += dx
    drag.current.velocity = dx * 22               // carry momentum on release
  }

  const endDrag = (e) => {
    if (!drag.current.active) return
    drag.current.active = false
    try { e.currentTarget.releasePointerCapture(e.pointerId) } catch {}
  }

  return (
    <div
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onPointerLeave={endDrag}
      className="relative cursor-grab select-none overflow-hidden border-y border-white/10 py-3.5 active:cursor-grabbing"
      style={{
        touchAction: 'pan-y',
        maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
      }}
    >
      <div ref={inner} className="flex w-max will-change-transform">
        <Track />
        <Track />
      </div>
    </div>
  )
}