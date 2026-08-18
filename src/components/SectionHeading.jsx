import Reveal from './Reveal'

export default function SectionHeading({ title, accent, subtitle, gradient, align = 'left' }) {
  return (
    <div className={align === 'center' ? 'text-center' : ''}>
      <Reveal>
        <h2 className="section-title">
          {title}{' '}
          {accent && (
            <span className="bg-gradient-to-r from-glow-cyan to-glow-violet bg-clip-text text-transparent">
              {accent}
            </span>
          )}
        </h2>
      </Reveal>
      {subtitle && (
        <Reveal delay={0.08}>
          <p className="mt-3 text-white/55">{subtitle}</p>
        </Reveal>
      )}
      <Reveal delay={0.14}>
        <div
          className={`section-rule ${gradient || 'bg-gradient-to-r from-glow-cyan to-transparent'} ${
            align === 'center' ? 'mx-auto' : ''
          }`}
        />
      </Reveal>
    </div>
  )
}
