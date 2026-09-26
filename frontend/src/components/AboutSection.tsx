import { about } from '@/data/about'
import { assetUrl } from '@/lib/asset'
import { ContactIcon } from './ContactIcon'
import { Section } from './Section'

const initials = about.name
  .split(/\s+/)
  .map((part) => part[0])
  .join('')

export function AboutSection() {
  const [lede, ...rest] = about.bio
  return (
    <Section id="about">
      <div className="grid gap-8 sm:grid-cols-[13rem_1fr]">
        {about.photo ? (
          <img
            src={assetUrl(about.photo)}
            alt={`Portrait of ${about.name}`}
            className="aspect-square w-full max-w-52 border object-cover"
          />
        ) : (
          // Deliberate stand-in until a photo is supplied — never an empty box.
          <div
            role="img"
            aria-label={`${about.name} (photo coming soon)`}
            className="flex aspect-square w-full max-w-52 flex-col items-center justify-center gap-1 border border-dashed bg-[repeating-linear-gradient(135deg,var(--border)_0_1px,transparent_1px_9px)] text-muted-foreground"
          >
            <span className="font-mono text-5xl font-bold tracking-tight">{initials}</span>
            <span className="font-mono text-[10px] tracking-widest uppercase">Photo coming soon</span>
          </div>
        )}

        <div>
          <p className="max-w-prose text-lg leading-relaxed">{lede}</p>
          {rest.map((para) => (
            <p key={para} className="mt-4 max-w-prose leading-relaxed text-muted-foreground">
              {para}
            </p>
          ))}

          {about.facts && (
            <dl className="mt-6 grid gap-2 font-mono text-sm">
              {about.facts.map((fact) => (
                <div key={fact.label} className="flex gap-3">
                  <dt className="w-24 shrink-0 text-xs tracking-wider text-muted-foreground uppercase">
                    {fact.label}
                  </dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>
          )}

          <ul className="mt-6 flex gap-2.5" aria-label="Contact links">
            {about.links.map((link) => {
              const external = !link.href.startsWith('mailto:')
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    aria-label={link.label}
                    title={link.label}
                    {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
                    className="flex size-10 items-center justify-center border bg-muted transition-colors hover:border-orange-600 hover:text-orange-600 focus-visible:ring-2 focus-visible:ring-orange-600 focus-visible:outline-none"
                  >
                    <ContactIcon kind={link.kind} className="size-[18px]" />
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </Section>
  )
}
