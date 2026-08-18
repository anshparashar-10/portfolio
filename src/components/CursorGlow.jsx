import { useEffect, useRef } from 'react'

export default function CursorGlow() {
  const glowRef = useRef(null)
  const ringRef = useRef(null)
  const dotRef = useRef(null)

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return

    let tx = window.innerWidth / 2, ty = window.innerHeight / 2
    let gx = tx, gy = ty, rx = tx, ry = ty
    let scale = 1, target = 1, raf

    const onMove = (e) => {
      tx = e.clientX; ty = e.clientY
      const el = e.target instanceof Element
        ? e.target.closest('a, button, input, textarea, [data-cursor="grow"]')
        : null
      target = el ? 2.6 : 1
      if (dotRef.current) dotRef.current.style.opacity = el ? '0' : '1'
    }

    const loop = () => {
      gx += (tx - gx) * 0.09; gy += (ty - gy) * 0.09
      rx += (tx - rx) * 0.2;  ry += (ty - ry) * 0.2
      scale += (target - scale) * 0.14
      if (glowRef.current) glowRef.current.style.transform = `translate(${gx}px, ${gy}px) translate(-50%, -50%)`
      if (ringRef.current) ringRef.current.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%) scale(${scale.toFixed(3)})`
      if (dotRef.current)  dotRef.current.style.transform  = `translate(${tx}px, ${ty}px) translate(-50%, -50%)`
      raf = requestAnimationFrame(loop)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    raf = requestAnimationFrame(loop)
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf) }
  }, [])

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[45] hidden md:block">
      <div ref={glowRef} className="absolute left-0 top-0 h-[560px] w-[560px] rounded-full will-change-transform"
        style={{ mixBlendMode: 'screen',
          background: 'radial-gradient(circle closest-side, rgba(34,211,238,0.22), rgba(59,130,246,0.12) 45%, rgba(168,85,247,0.06) 70%, transparent 100%)' }} />
      <div ref={ringRef} className="absolute left-0 top-0 h-8 w-8 rounded-full border border-glow-cyan/70 will-change-transform"
        style={{ mixBlendMode: 'screen' }} />
      <div ref={dotRef} className="absolute left-0 top-0 h-1.5 w-1.5 rounded-full bg-glow-cyan will-change-transform"
        style={{ mixBlendMode: 'screen', transition: 'opacity .2s ease' }} />
    </div>
  )
}