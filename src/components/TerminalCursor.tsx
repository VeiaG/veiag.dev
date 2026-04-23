import { cn } from '@/lib/utils'

/** Blinking block cursor — pure CSS, no JS needed. */
export default function TerminalCursor({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-block w-[7px] h-[1.1em] bg-term-amber align-text-bottom animate-blink',
        className,
      )}
    />
  )
}
