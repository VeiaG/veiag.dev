import { cn } from '@/lib/utils'
import { Link } from '@/i18n/navigation'

type Segment = { label: string; href?: string }

type Props = {
  segments: Segment[]
  className?: string
}

/** Renders `~ / blog / slug` as a terminal path breadcrumb. */
export default function TerminalBreadcrumb({ segments, className }: Props) {
  return (
    <nav
      aria-label="breadcrumb"
      className={cn('flex items-center gap-2 text-[11px] font-mono py-8 mb-4', className)}
    >
      {segments.map((seg, i) => (
        <span key={i} className="flex items-center gap-2">
          {i > 0 && <span className="text-term-dim">/</span>}
          {seg.href ? (
            <Link
              href={seg.href}
              className="text-term-muted hover:text-term-amber transition-colors duration-150"
            >
              {seg.label}
            </Link>
          ) : (
            <span className="text-term-amber">{seg.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
