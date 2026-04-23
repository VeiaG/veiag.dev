import { cn } from '@/lib/utils'

type Variant = 'default' | 'amber' | 'blue' | 'green'

const variants: Record<Variant, string> = {
  default: 'border-term-border text-term-dim    bg-term-bg3',
  amber:   'border-term-amber  text-term-amber  bg-term-amber/5',
  blue:    'border-term-blue   text-term-blue   bg-term-blue/5',
  green:   'border-term-green  text-term-green  bg-term-green/5',
}

type Props = {
  children: React.ReactNode
  variant?: Variant
  className?: string
}

export default function TerminalTag({ children, variant = 'default', className }: Props) {
  return (
    <span
      className={cn(
        'inline-block text-[10px] border px-2 py-0.5 font-mono tracking-wide leading-none',
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}

/* ─── Skill → colour heuristic ──────────────────────────────────────────── */

const FRONTEND = ['react', 'next.js', 'next.js', 'vue', 'svelte', 'angular', 'html', 'css']
const BACKEND  = ['node.js', 'node.js', 'typescript', 'javascript', 'python', 'go', 'rust', 'payloadcms', 'payload cms', 'postgresql', 'mysql', 'mongodb', 'rest', 'trpc', 'graphql', 'express']
const DESIGN   = ['design', 'figma', 'tailwind', 'tailwind css']

export function skillVariant(skill: string): Variant {
  const s = skill.toLowerCase()
  if (FRONTEND.some(k => s.includes(k))) return 'green'
  if (BACKEND.some(k  => s.includes(k))) return 'blue'
  if (DESIGN.some(k   => s.includes(k))) return 'amber'
  return 'default'
}
