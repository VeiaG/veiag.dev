'use client'

import { usePathname, useRouter } from '@/i18n/navigation'
import { useSearchParams } from 'next/navigation'
import { LayoutGrid, List } from 'lucide-react'
import { cn } from '@/lib/utils'

type Props = {
  currentView: 'grid' | 'list'
  count: number
}

export default function ProjectViewToggle({ currentView, count }: Props) {
  const router       = useRouter()
  const pathname     = usePathname()
  const searchParams = useSearchParams()

  function setView(v: 'grid' | 'list') {
    const params = new URLSearchParams(searchParams.toString())
    params.set('view', v)
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex items-center shrink-0 border-l border-term-border">
      <span className="px-4 text-term-dim text-[11px] font-mono tracking-wider hidden sm:block">
        {count} ENTRIES
      </span>
      <ViewBtn icon={<LayoutGrid size={13} />} active={currentView === 'grid'} onClick={() => setView('grid')} label="grid" />
      <ViewBtn icon={<List size={13} />}       active={currentView === 'list'} onClick={() => setView('list')} label="list" />
    </div>
  )
}

function ViewBtn({
  icon, active, onClick, label,
}: {
  icon: React.ReactNode
  active: boolean
  onClick: () => void
  label: string
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={cn(
        'h-full px-4 flex items-center gap-1.5 text-[11px] font-mono border-l border-term-border transition-colors duration-150 cursor-pointer',
        active
          ? 'text-term-amber bg-term-amber/5'
          : 'text-term-muted hover:text-term-text hover:bg-term-bg3',
      )}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  )
}
