import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Github, Linkedin, Mail, AtSign } from 'lucide-react'
import Reveal from '../Reveal'
import Decor from '../three/Decor'

const SOCIALS = [
  { Icon: Github, href: 'https://github.com/anshparashar-10', label: 'GitHub' },
  { Icon: Linkedin, href: 'https://www.linkedin.com/in/ansh-parashar/', label: 'LinkedIn' },
  { Icon: Mail, href: 'mailto:anshparasharap1011@gmail.com', label: 'Email' },
]

const STATUS = [
  { dot: 'bg-emerald-400', text: 'Indore, Madhya Pradesh, India' },
  { dot: 'bg-glow-blue', text: 'Available for work' },
  { dot: 'bg-glow-amber', text: 'Usually responds within 24 hours' },
]

function MagneticButton({ children, href }) {
  const ref = useRef(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect()
    setPos({
      x: (e.clientX - (r.left + r.width / 2)) * 0.25,
      y: (e.clientY - (r.top + r.height / 2)) * 0.35,
    })
  }

  return (
    <motion.a
      ref={ref}
      href={href}
      onMouseMove={onMove}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: 'spring', stiffness: 260, damping: 18 }}
      className="inline-block border border-white/25 px-8 py-3.5 font-medium transition-colors hover:border-glow-cyan hover:text-glow-cyan"
    >
      {children}
    </motion.a>
  )
}

export default function Contact() {
  return (
    <section id="contact" className="relative mx-auto max-w-6xl px-6 py-24">
      <Decor model="planet" interactive autoRotateSpeed={0.5} camera={5}
        props={{ body: 'jupiter', speed: 0.17, atmosphere: '#3B82F6' }}
        className="right-[-6%] top-[18%] hidden h-80 w-80 opacity-80 lg:block" />
      <Reveal>
        <p className="text-white/45">Impressed?</p>
      </Reveal>
      <Reveal delay={0.06}>
        <h2 className="mt-2 font-display text-4xl font-medium tracking-tight md:text-6xl">
          Let's{' '}
          <span className="bg-gradient-to-r from-glow-cyan to-glow-blue bg-clip-text text-transparent">
            Connect
          </span>
        </h2>
      </Reveal>
      <Reveal delay={0.12}>
        <div className="section-rule bg-gradient-to-r from-glow-blue to-transparent" />
      </Reveal>

      <Reveal delay={0.18}>
        <p className="mt-7 max-w-xl leading-relaxed text-white/65">
          I'm open to full-stack roles, and to interesting problems generally.
          If you're building something that needs to hold up under load, I'd like to hear about it.
        </p>
      </Reveal>

      <Reveal delay={0.24}>
        <p className="mt-9 font-display text-lg font-medium">Get in touch</p>
        <div className="mt-4 flex items-center gap-5">
          {SOCIALS.map(({ Icon, href, label }) => (
            <motion.a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              whileHover={{ y: -4, scale: 1.12 }}
              transition={{ type: 'spring', stiffness: 380, damping: 18 }}
              className="text-white/50 transition-colors hover:text-glow-cyan"
            >
              <Icon size={24} />
            </motion.a>
          ))}
        </div>
      </Reveal>

      <Reveal delay={0.3}>
        <a
          href="mailto:anshparasharap1011@gmail.com"
          className="mt-7 inline-flex items-center gap-2.5 text-white/70 transition-colors hover:text-glow-cyan"
        >
          <AtSign size={18} /> anshparasharap1011@gmail.com
        </a>
      </Reveal>

      <Reveal delay={0.36}>
        <ul className="mt-9 space-y-3">
          {STATUS.map((s) => (
            <li key={s.text} className="flex items-center gap-3 text-sm text-white/60">
              <span className={`h-2 w-2 animate-twinkle rounded-full ${s.dot}`} />
              {s.text}
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal delay={0.42}>
        <div className="mt-12 flex flex-wrap items-center gap-6">
          {/* <MagneticButton href="/Ansh_Parashar_Resume.pdf">View Resume</MagneticButton> */}
          <MagneticButton href="/Ansh_Parashar_Resume.pdf" target="_blank" rel="noopener noreferrer">
            View Resume
          </MagneticButton>
          <a href="/Ansh_Parashar_Resume.pdf"
            download
            className="text-sm text-white/50 underline-offset-4 transition-colors hover:text-glow-cyan hover:underline"
          >
            Download PDF
          </a>
        </div>
      </Reveal>

      <p className="mt-20 border-t border-white/10 pt-8 font-mono text-[11px] tracking-[0.14em] text-white/30">
        © 2026 ANSH PARASHAR
      </p>
    </section>
  )
}
