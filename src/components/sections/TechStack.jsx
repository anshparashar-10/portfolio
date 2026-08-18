import { motion } from 'framer-motion'
import SectionHeading from '../SectionHeading'


const GROUPS = [
  {
    label: 'Languages & Frontend',
    color: 'text-glow-rose',
    items: ['Java', 'JavaScript', 'TypeScript', 'Python', 'React', 'Next.js', 'Angular', 'Tailwind CSS'],
  },
  {
    label: 'Backend & Databases',
    color: 'text-glow-amber',
    items: ['Spring Boot', 'Hibernate / JPA', 'Node.js', 'Express.js', 'PostgreSQL', 'MySQL', 'MongoDB', 'PL/SQL'],
  },
  {
    label: 'Cloud & DevOps',
    color: 'text-glow-cyan',
    items: ['AWS', 'Azure', 'Docker', 'Jenkins', 'CI/CD', 'Control-M', 'Vercel'],
  },
  {
    label: 'AI & Tools',
    color: 'text-glow-violet',
    items: ['OpenAI API', 'LangChain', 'RAG', 'Git', 'JUnit', 'Maven', 'Databricks', 'Power BI'],
  },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
}

const chip = {
  hidden: { opacity: 0, y: 14, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
}

export default function TechStack() {
  return (
    <section id="stack" className="relative mx-auto max-w-6xl px-6 py-24">

      <SectionHeading
        title="Tech"
        accent="Stack"
        subtitle="The tools and languages I work with day to day."
        gradient="bg-gradient-to-r from-glow-rose via-glow-amber to-transparent"
      />

      <div className="mt-14 space-y-10">
        {GROUPS.map((group, gi) => (
          <div key={group.label}>
            <motion.h3
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: gi * 0.05, ease: [0.22, 1, 0.36, 1] }}
              className={`font-display text-xl font-medium ${group.color}`}
            >
              {group.label}
            </motion.h3>

            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-60px' }}
              className="mt-4 flex flex-wrap gap-2.5"
            >
              {group.items.map((item) => (
                <motion.span
                  key={item}
                  variants={chip}
                  whileHover={{ y: -4, scale: 1.04 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 20 }}
                  className="chip cursor-default"
                  data-cursor="grow"
                >
                  {item}
                </motion.span>
              ))}
            </motion.div>
          </div>
        ))}
      </div>
    </section>
  )
}
