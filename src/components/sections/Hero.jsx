import { motion } from 'framer-motion'
import { MapPin, Github, Linkedin, Mail } from 'lucide-react'
import { Suspense, lazy } from 'react'

const Globe = lazy(() => import('../three/Globe'))

const SPECIALTIES = [
  'Backend Engineering',
  'Microservices',
  'Full-Stack Development',
  'AI Integration',
]

const SOCIALS = [
  { icon: Github, href: 'https://github.com/anshparashar-10', label: 'GitHub' },
  { icon: Linkedin, href: 'https://www.linkedin.com/in/ansh-parashar/', label: 'LinkedIn' },
  { icon: Mail, href: 'mailto:anshparasharap1011@gmail.com', label: 'Email' },
]

const fade = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function Hero() {
  return (
    <section id="home" className="relative mx-auto max-w-6xl px-6 pb-24 pt-28 md:pt-32">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="order-2 lg:order-1"
        >
          <Suspense
            fallback={<div className="h-[260px] w-full sm:h-[400px] lg:h-[560px]" />}
          >
            <Globe />
          </Suspense>
          <p className="mt-2 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-white/35">
            Drag to rotate
          </p>
        </motion.div>

        <div className="order-1 lg:order-2">
          <motion.p variants={fade} initial="hidden" animate="show" custom={0}
            className="text-lg text-white/55">
            Hello, I'm
          </motion.p>

          <motion.h1 variants={fade} initial="hidden" animate="show" custom={1}
            className="mt-2 font-display text-5xl font-medium tracking-tight md:text-6xl">
            Ansh Parashar
          </motion.h1>

          <motion.div variants={fade} initial="hidden" animate="show" custom={2}
            className="mt-4 h-px w-full max-w-md bg-gradient-to-r from-glow-cyan via-glow-blue to-transparent" />

          <motion.p variants={fade} initial="hidden" animate="show" custom={3}
            className="mt-5 flex items-center gap-2 text-sm text-white/55">
            <MapPin size={15} /> Indore, India
          </motion.p>

          <motion.p variants={fade} initial="hidden" animate="show" custom={4}
            className="mt-5 max-w-lg leading-relaxed text-white/70">
            Your friendly neighbourhood software engineer. I swing between the front end and the back end, and I usually stick the landing. Worked mostly on Java, React, Spring Boot, NodeJs and SQL, with a growing habit of pointing LLMs at problems that used to need a human.
          </motion.p>

          <motion.div variants={fade} initial="hidden" animate="show" custom={5} className="mt-7">
            <p className="mb-3 font-medium">Specialized in:</p>
            <div className="flex flex-wrap gap-2.5">
              {SPECIALTIES.map((s) => (
                <span key={s} className="chip">{s}</span>
              ))}
            </div>
          </motion.div>

          <motion.div variants={fade} initial="hidden" animate="show" custom={6}
            className="mt-8 flex items-center gap-5">
            {SOCIALS.map(({ icon: Icon, href, label }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label}
                className="text-white/50 transition-colors hover:text-glow-cyan">
                <Icon size={22} />
              </a>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
