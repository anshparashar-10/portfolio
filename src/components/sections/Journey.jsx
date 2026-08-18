import { useRef } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { MapPin } from 'lucide-react'
import SectionHeading from '../SectionHeading'
import Decor from '../three/Decor'

const ITEMS = [
  {
    role: 'System Engineer',
    org: 'Tata Consultancy Services — Digital',
    place: 'Indore, India',
    when: 'July 2024 - Present',
    accent: 'text-glow-cyan',
    points:
      'Led a cross-functional team designing and shipping a Spring Boot microservice with RESTful APIs, cutting data retrieval time by 40%. Automated a thrice-daily manual reporting process and tuned PostgreSQL queries across the reporting layer.',
  },
  {
    role: 'React / QGIS Developer (Intern)',
    org: 'M.P. State Electronics Development Corporation',
    place: 'Bhopal, India',
    when: 'March 2024 - June 2024',
    accent: 'text-glow-violet',
    points:
      'Engineered core GIS features including configurable basemap switching, line and polygon drawing tools, KML upload and buffer generation. Redesigned the vector editing workflow, speeding up geospatial processing by 25%.',
  },
  {
    role: 'Full Stack Developer (Intern)',
    org: 'Calculus Carbon',
    place: 'Remote',
    when: 'January 2024 - March 2024',
    accent: 'text-glow-amber',
    points:
      'Built the responsive front-end architecture in Next.js and TypeScript, then architected a full-stack Risk Analysis Tool with PostgreSQL that replaced manual spreadsheet review and cut assessment turnaround by 25%.',
  },
]

export default function Journey() {
  const wrapRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ['start 65%', 'end 60%'],
  })
  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 26 })

  return (
    <section id="journey" className="relative mx-auto max-w-6xl px-6 py-24">
      <Decor model="spaceship" camera={9} className="right-[2%] top-[14%] hidden h-32 w-32 opacity-80 lg:block" />
      <Decor model="spaceship" camera={11} className="left-[3%] top-[48%] hidden h-24 w-24 opacity-60 lg:block" />
      <Decor model="spaceship" camera={10} className="right-[6%] top-[78%] hidden h-28 w-28 opacity-70 xl:block" />
      <SectionHeading
        title="My"
        accent="Journey"
        subtitle="Professional experience and the systems I've shipped."
        align="center"
        gradient="bg-gradient-to-r from-glow-cyan to-glow-violet"
      />

      <div ref={wrapRef} className="relative mt-16">
        <div className="absolute left-4 top-0 h-full w-px bg-white/10 md:left-1/2 md:-translate-x-1/2" />
        <motion.div
          style={{ scaleY }}
          className="absolute left-4 top-0 h-full w-px origin-top bg-gradient-to-b from-glow-cyan via-glow-blue to-glow-violet md:left-1/2 md:-translate-x-1/2"
        />

        <div className="space-y-16">
          {ITEMS.map((item, i) => {
            const left = i % 2 === 0
            return (
              <div
                key={item.org}
                className="relative pl-12 md:grid md:grid-cols-2 md:items-start md:gap-x-16 md:pl-0"
              >
                <motion.span
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute left-4 top-2 z-10 h-3 w-3 -translate-x-1/2 rounded-full bg-glow-cyan ring-4 ring-black md:left-1/2"
                />

                <motion.div
                  initial={{ opacity: 0, x: left ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className={
                    left
                      ? 'md:col-start-1 md:row-start-1 md:pr-2 md:text-right'
                      : 'md:col-start-2 md:row-start-1 md:pl-2 md:text-left'
                  }
                >
                  <h3 className={`font-display text-xl font-medium ${item.accent}`}>{item.role}</h3>
                  <p className="mt-1 text-white/85">{item.org}</p>
                  <p
                    className={`mt-1 flex items-center gap-1.5 text-sm text-white/45 ${
                      left ? 'md:justify-end' : 'md:justify-start'
                    }`}
                  >
                    <MapPin size={13} /> {item.place}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-white/60">{item.points}</p>
                </motion.div>

                <div
                  className={`hidden md:block ${
                    left
                      ? 'md:col-start-2 md:row-start-1 md:pl-2 md:text-left'
                      : 'md:col-start-1 md:row-start-1 md:pr-2 md:text-right'
                  }`}
                >
                  <p className="pt-1 font-mono text-sm text-white/45">{item.when}</p>
                </div>

                <p className="mt-2 font-mono text-xs text-white/45 md:hidden">{item.when}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
