import { cn } from '@/lib/utils'

type Props = {
  path?: string
  className?: string
}

/** Renders `roman@veiag.dev:~/path $ ` — purely presentational, no client needed. */
export default function TerminalPrompt({ path = '~', className }: Props) {
  return (
    <span className={cn('font-mono text-[13px] shrink-0', className)}>
      <span className="text-term-blue">roman</span>
      <span className="text-term-dim">@</span>
      <span className="text-term-amber">veiag.dev</span>
      <span className="text-term-dim">:</span>
      <span className="text-term-amber">{path}</span>
      <span className="text-term-dim"> $</span>
      {' '}
    </span>
  )
}
