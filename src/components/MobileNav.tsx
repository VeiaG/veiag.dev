'use client'

import { useState } from 'react'
import { Link } from '@/i18n/navigation'
import { Menu, X } from 'lucide-react'

type Props = {
  translations: { blog: string; projects: string; about: string }
}

const MobileNav = ({ translations }: Props) => {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex md:hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="h-12 w-12 flex items-center justify-center text-term-muted hover:text-term-amber transition-colors"
        aria-label="Toggle menu"
      >
        {open ? <X size={18} /> : <Menu size={18} />}
      </button>

      {open && (
        <div className="fixed inset-0 top-12 z-[99] bg-term-bg border-t border-term-border flex flex-col">
          <MobileLink href="/blog"     label={translations.blog}     prefix="./blog"     onClick={() => setOpen(false)} />
          <MobileLink href="/projects" label={translations.projects} prefix="./projects" onClick={() => setOpen(false)} />
          <MobileLink href="/#about"   label={translations.about}    prefix="./about"    onClick={() => setOpen(false)} />
        </div>
      )}
    </div>
  )
}

function MobileLink({
  href,
  label,
  prefix,
  onClick,
}: {
  href: string
  label: string
  prefix: string
  onClick: () => void
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="px-8 py-5 text-[15px] font-mono text-term-muted border-b border-term-border hover:text-term-amber hover:bg-term-amber/5 transition-colors"
    >
      <span className="text-term-dim">./</span>{label}
    </Link>
  )
}

export default MobileNav
