import { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import RichText from './RichText'

type Props = {
  company: string
  position: string
  startDate: string
  endDate?: string | null
  description: DefaultTypedEditorState
  location?: string | null
  isPresent?: boolean
}

export default function ExperienceCard({
  company,
  position,
  startDate,
  endDate,
  description,
  location,
  isPresent,
}: Props) {
  const start = new Date(startDate).toLocaleString('en-US', { month: 'short', year: 'numeric' })
  const end   = isPresent
    ? 'Present'
    : endDate
      ? new Date(endDate).toLocaleString('en-US', { month: 'short', year: 'numeric' })
      : ''

  return (
    <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4 py-6 border-b border-term-border last:border-b-0 animate-fade-in-up">
      {/* Left: content */}
      <div>
        <div className="text-term-bright text-[14px] font-bold mb-1">
          <span className="text-term-amber mr-2">▸</span>
          {company}
        </div>
        <div className="text-term-muted text-[12px] mb-3">{position}</div>
        <div className="text-term-dim text-[12px] leading-relaxed max-w-[560px]">
          <RichText data={description} enableGutter={false} />
        </div>
      </div>

      {/* Right: meta */}
      <div className="sm:text-right shrink-0">
        {location && (
          <div className="text-term-dim text-[11px] mb-1">{location}</div>
        )}
        <div className="text-term-muted text-[11px] whitespace-nowrap">{start} – {end}</div>
        {isPresent && (
          <div className="text-term-green text-[10px] tracking-wider mt-1">● CURRENT</div>
        )}
      </div>
    </div>
  )
}
