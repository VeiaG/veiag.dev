import { cn } from '@/lib/utils'
import TerminalPrompt from './TerminalPrompt'

type Props = {
  cmd: string
  comment?: string
  path?: string
  className?: string
}

/** Section divider rendered as a terminal prompt + command. */
export default function SectionHeader({ cmd, comment, path, className }: Props) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 mb-8 pb-4 border-b border-term-border',
        className,
      )}
    >
      <TerminalPrompt path={path} />
      <span className="text-term-bright text-[13px] font-medium">{cmd}</span>
      {comment && (
        <span className="text-term-dim text-[12px] ml-auto">
          # {comment}
        </span>
      )}
    </div>
  )
}
