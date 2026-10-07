import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, Code2, LayoutGrid, List } from 'lucide-react'
import SectionHeading from '../SectionHeading'

const PROJECTS = [
  {
    id: 'jev',
    n: '01',
    name: 'YOUTUBE COMMENT TRIAGE',
    status: 'DEPLOYED',
    tagline: 'Structured comment classification',
    desc: 'Classifies every comment on a YouTube video across four axes: type, reply-worthiness, sentiment, and question difficulty. Built on Jev, a structured-decision model that returns typed labels and probabilities rather than text, so no output parsing is needed. Async per-comment calls rank the handful worth answering above the noise.',
    tech: ['Python', 'asyncio', 'httpx', 'YouTube Data API', 'Jev API', 'Streamlit'],
    
    live: 'https://jev-yt-cmnt-triage.streamlit.app/',
    code: 'https://github.com/anshparashar-10/JEV-YT-CMNT-TRIAGE',
  },
  {
    id: 'docscanner',
    n: '02',
    name: 'DOCSCANNER AI',
    status: 'ACTIVE',
    tagline: 'Intelligent document screening',
    desc: 'Three-layer document tampering detection. A mechanical engine reads PDF metadata with pikepdf, runs OCR through pytesseract and PyMuPDF, and diffs pixels with OpenCV. An LLM layer then checks temporal validity and semantic contradictions, producing a 0-100 authenticity score and an annotated report.',
    tech: ['Python', 'OpenCV', 'LangChain', 'DeepSeek', 'ReportLab'],
    
    code: 'https://github.com/anshparashar-10/DocScanner-AI-Hackathon',
  },
  {
    id: 'flight',
    n: '03',
    name: 'FLIGHT BOOKING AI',
    status: 'STABLE',
    tagline: 'Natural-language flight search',
    desc: 'A three-tier system: React front end, Node.js/Express middleware, and a Python/Flask AI service. OpenAI function calling turns a sentence into structured query parameters, dispatched through a provider-agnostic adapter that swaps data sources by configuration alone.',
    tech: ['React', 'Node.js', 'Express', 'Flask', 'OpenAI', 'RapidAPI'],
    
    code: 'https://github.com/anshparashar-10/Flight_Booking_AI',
  }
]

function ViewToggle({ view, setView }) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-right">
        <p className="font-display text-sm font-medium">View mode</p>
        <p className="text-xs text-white/40">Switch between layouts</p>
      </div>
      <div className="flex rounded-full border border-white/15 bg-white/[0.03] p-1">
        {[
          { key: 'list', Icon: List },
          { key: 'grid', Icon: LayoutGrid },
        ].map(({ key, Icon }) => (
          <button
            key={key}
            onClick={() => setView(key)}
            aria-label={`${key} view`}
            aria-pressed={view === key}
            className="relative rounded-full px-4 py-2"
          >
            {view === key && (
              <motion.span
                layoutId="viewPill"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                className="absolute inset-0 rounded-full bg-white/12"
              />
            )}
            <Icon
              size={16}
              className={`relative ${view === key ? 'text-glow-cyan' : 'text-white/45'}`}
            />
          </button>
        ))}
      </div>
    </div>
  )
}

function Links({ p }) {
  return (
    <div className="flex shrink-0 flex-col gap-2 text-xs">
      {p.live && (
        <a href={p.live} target="_blank" rel="noreferrer"
          className="flex items-center gap-1.5 text-white/55 transition-colors hover:text-glow-cyan">
          <ExternalLink size={13} /> LIVE
        </a>
      )}
      <a href={p.code} target="_blank" rel="noreferrer"
        className="flex items-center gap-1.5 text-white/55 transition-colors hover:text-glow-cyan">
        <Code2 size={13} /> GITHUB
      </a>
    </div>
  )
}

export default function Projects() {
  const [view, setView] = useState('list')

  return (
    <section id="projects" className="mx-auto max-w-6xl px-6 py-24">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <SectionHeading
          title="Projects"
          subtitle="Some of the things I've built."
          gradient="bg-gradient-to-r from-glow-amber to-transparent"
        />
        <div className="shrink-0 pt-1">
          <ViewToggle view={view} setView={setView} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {view === 'list' ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
            className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,300px)_minmax(0,1fr)]"
          >
            <div className="h-fit rounded-xl border border-white/10 bg-white/[0.02] p-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="font-mono text-xs text-white/80">[DIRECTORY_INDEX]</span>
                {/* <span className="flex items-center gap-1.5 font-mono text-[10px] text-glow-amber">
                  <span className="h-1.5 w-1.5 animate-twinkle rounded-full bg-glow-amber" /> LIVE
                </span> */}
              </div>
              {PROJECTS.map((p) => (
                <a key={p.id}
                  className="flex items-center justify-between border-b border-white/5 py-3 font-mono text-[11px] transition-colors hover:text-glow-cyan">
                  <span className="text-white/75">LOG.{p.n} // {p.name}</span>
                  <span className="text-white/35">{p.status}</span>
                </a>
              ))}
            </div>

            <div>
              {PROJECTS.map((p, i) => (
                <motion.article
                  key={p.id}
                  id={p.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className="group border-b border-white/10 py-8"
                >
                  <div className="flex gap-5 md:gap-8">
                    <span className="font-display text-4xl font-medium text-white/10 transition-colors duration-300 group-hover:text-glow-cyan/40 md:text-5xl">
                      {p.n}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-display text-xl font-medium tracking-wide">{p.name}</h3>
                      <p className="mt-1 text-sm text-white/45">{p.tagline}</p>
                      <p className="mt-3 text-sm leading-relaxed text-white/65">{p.desc}</p>
                      <div className="mt-4 flex flex-wrap gap-x-2 gap-y-1 font-mono text-[11px] text-white/40">
                        <span className="text-white/70">TECH //</span>
                        {p.tech.map((t) => <span key={t}>{t}</span>)}
                      </div>
                    </div>
                    <Links p={p} />
                  </div>
                </motion.article>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
            className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {PROJECTS.map((p, i) => (
              <motion.article
                key={p.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -6 }}
                data-cursor="grow"
                className="flex flex-col rounded-xl border border-white/10 bg-white/[0.02] p-6 transition-colors hover:border-glow-cyan/40"
              >
                <div className="flex items-start justify-between">
                  <span className="font-display text-3xl font-medium text-white/10">{p.n}</span>
                  <span className="font-mono text-[10px] text-white/35">{p.status}</span>
                </div>
                <h3 className="mt-3 font-display text-lg font-medium tracking-wide">{p.name}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-white/60">{p.desc}</p>
                <div className="mt-4 flex flex-wrap gap-x-2 gap-y-1 font-mono text-[10px] text-white/40">
                  {p.tech.map((t) => <span key={t}>{t}</span>)}
                </div>
                <div className="mt-5 border-t border-white/10 pt-4">
                  <Links p={p} />
                </div>
              </motion.article>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
