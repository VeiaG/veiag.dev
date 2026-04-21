'use client'

import React, { useEffect } from 'react'
import { X } from 'lucide-react'
import { usePathname, useRouter } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

type Props = {
  tags: { id: string; title: string }[]
  initialTags: string[]
  translations: { filters: string }
}

const TagsFilter: React.FC<Props> = ({ tags, initialTags, translations }) => {
  const [selected, setSelected] = React.useState<string[]>(initialTags)
  const router   = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const params = new URLSearchParams()
    selected.forEach(t => params.append('tags', t))
    router.push(`${pathname}?${params.toString()}`)
  }, [selected, pathname, router])

  const toggle = (title: string) => {
    setSelected(prev =>
      prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title],
    )
  }

  return (
    <div className="flex items-center gap-0 border-b border-term-border bg-term-bg2 px-6 flex-wrap">
      <span className="text-term-dim text-[11px] mr-4 tracking-wider uppercase py-3 shrink-0">
        {translations.filters}:
      </span>

      {/* Active filters */}
      {selected.map(tag => (
        <FilterChip key={tag} label={tag} active onClick={() => toggle(tag)} />
      ))}

      {/* Inactive filters */}
      {tags
        .filter(t => !selected.includes(t.title))
        .map(tag => (
          <FilterChip key={tag.id} label={tag.title} onClick={() => toggle(tag.title)} />
        ))}
    </div>
  )
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string
  active?: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-1.5 px-3 py-3 text-[11px] font-mono border-r border-term-border transition-colors duration-150 cursor-pointer',
        active
          ? 'text-term-amber bg-term-amber/5 hover:bg-term-amber/10'
          : 'text-term-muted hover:text-term-text hover:bg-term-bg3',
      )}
    >
      {label}
      {active && <X size={10} />}
    </button>
  )
}

export default TagsFilter
