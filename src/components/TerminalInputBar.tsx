'use client'

import { useRef, useState } from 'react'
import { useRouter } from '@/i18n/navigation'
import TerminalPrompt from './TerminalPrompt'

/* ─── Fastfetch defaults ─────────────────────────────────────────────────── */

const ART = `
 ██╗   ██╗███████╗██╗ █████╗  ██████╗
 ██║   ██║██╔════╝██║██╔══██╗██╔════╝
 ██║   ██║█████╗  ██║███████║██║  ███╗
 ╚██╗ ██╔╝██╔══╝  ██║██╔══██║██║   ██║
  ╚████╔╝ ███████╗██║██║  ██║╚██████╔╝
   ╚═══╝  ╚══════╝╚═╝╚═╝  ╚═╝ ╚═════╝`

const DEFAULT_HEADER = 'roman@veiag.dev'

const DEFAULT_ITEMS: [string, string][] = [
  ['',         'roman@veiag.dev'],
  ['',         '─────────────────────────'],
  ['OS',       'veiag.dev Portfolio 2.0'],
  ['Host',     'Full-stack Developer'],
  ['Uptime',   '22 years'],
  ['Location', 'Kyiv, Ukraine'],
  ['Shell',    'TypeScript'],
  ['DE',       'React + Next.JS'],
  ['WM',       'PayloadCMS'],
  ['Terminal', 'JetBrains Mono'],
  ['CPU',      'Brain @ 3.2GHz (sometimes)'],
  ['Memory',   '☕ coffee / 1 cat'],
  ['',         ''],
  ['',         '● ● ● ● ● ● ●'],
]

/* ─── Filesystem tree ────────────────────────────────────────────────────── */

type Dir = 'root' | 'blog' | 'projects'

const ROOT_LS = [
  { name: 'blog/',     color: 'text-term-blue',  hint: 'latest posts'    },
  { name: 'projects/', color: 'text-term-green', hint: 'open-source work' },
]

/* ─── Types ──────────────────────────────────────────────────────────────── */

type FastfetchProp = {
  header?: string | null
  items?: { key?: string | null; value: string }[] | null
} | undefined

type HistoryEntry =
  | { type: 'text';      cmd: string; result: string }
  | { type: 'fastfetch'; cmd: string }
  | { type: 'ls-root';   cmd: string }
  | { type: 'ls-items';  cmd: string; items: { name: string; hint?: string }[] }

/* ─── Component ─────────────────────────────────────────────────────────── */

export default function TerminalInputBar({ fastfetch }: { fastfetch?: FastfetchProp }) {
  const header = fastfetch?.header || DEFAULT_HEADER
  const info: [string, string][] = fastfetch?.items?.length
    ? [['', header], ['', '─────────────────────────'], ...fastfetch.items.map(({ key, value }) => [key ?? '', value] as [string, string])]
    : DEFAULT_ITEMS

  const [value,   setValue]   = useState('')
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [cwd,     setCwd]     = useState<Dir>('root')
  const inputRef              = useRef<HTMLInputElement>(null)
  const router                = useRouter()

  function push(entry: HistoryEntry) {
    setHistory(h => [...h, entry])
    setValue('')
  }

  async function fetchLs(dir: Dir): Promise<{ name: string; hint?: string }[]> {
    if (dir === 'blog') {
      const res  = await fetch('/api/posts?limit=10&sort=-publishedAt&depth=0')
      const data = await res.json()
      return (data.docs ?? []).map((p: { slug?: string; title?: string }) => ({
        name: `${p.slug ?? p.title}.md`,
        hint: p.title,
      }))
    }
    if (dir === 'projects') {
      const res  = await fetch('/api/projects?limit=0&sort=_order&depth=0')
      const data = await res.json()
      return (data.docs ?? []).map((p: { slug?: string; title?: string }) => ({
        name: `${p.slug ?? p.title}/`,
        hint: p.title,
      }))
    }
    return []
  }

  async function run(raw: string) {
    const trimmed = raw.trim()
    const cmd     = trimmed.toLowerCase()

    if (cmd === 'clear') {
      setHistory([])
      setValue('')
      return
    }

    /* ── navigation ── */
    if (cmd === 'pwd') {
      push({ type: 'text', cmd: trimmed, result: cwd === 'root' ? '~' : `~/${cwd}` })
      return
    }

    if (cmd === 'cd' || cmd === 'cd ~' || cmd === 'cd /') {
      setCwd('root')
      push({ type: 'text', cmd: trimmed, result: '~' })
      return
    }

    if (cmd === 'cd ..') {
      setCwd('root')
      push({ type: 'text', cmd: trimmed, result: '~' })
      return
    }

    const cdMatch = cmd.match(/^cd\s+(\w+)\/?$/)
    if (cdMatch) {
      const target = cdMatch[1] as Dir
      if (target === 'blog' || target === 'projects') {
        setCwd(target)
        push({ type: 'text', cmd: trimmed, result: `~/${target}` })
      } else {
        push({ type: 'text', cmd: trimmed, result: `cd: ${cdMatch[1]}: No such file or directory` })
      }
      return
    }

    if (cmd === 'ls' || cmd === 'ls -la' || cmd === 'ls -l') {
      if (cwd === 'root') {
        push({ type: 'ls-root', cmd: trimmed })
      } else {
        push({ type: 'ls-items', cmd: trimmed, items: [{ name: '…loading' }] })
        const items = await fetchLs(cwd)
        setHistory(h => {
          const copy = [...h]
          const idx  = copy.findLastIndex(e => e.type === 'ls-items')
          if (idx !== -1) copy[idx] = { type: 'ls-items', cmd: trimmed, items }
          return copy
        })
      }
      return
    }

    /* ── open shortcuts ── */
    if (cmd === 'open blog') {
      router.push('/blog')
      push({ type: 'text', cmd: trimmed, result: 'Opening /blog...' })
      return
    }
    if (cmd === 'open projects') {
      router.push('/projects')
      push({ type: 'text', cmd: trimmed, result: 'Opening /projects...' })
      return
    }

    /* ── misc ── */
    let result: string
    switch (cmd) {
      case 'help':
        result = 'pwd · ls · cd <dir> · cd .. · fastfetch · whoami · contact · open blog · open projects · clear'
        break
      case 'whoami':
        result = 'Roman Palamar — Full-stack Developer · roman@veiag.dev · Kyiv, Ukraine'
        break
      case 'fastfetch':
        push({ type: 'fastfetch', cmd: trimmed })
        return
      case 'contact':
        result = 'roman@veiag.dev'
        break
      default:
        result = `command not found: ${cmd}. Try 'help'`
    }

    push({ type: 'text', cmd: trimmed, result })
  }

  const cwdLabel = cwd === 'root' ? '~' : `~/${cwd}`

  return (
    <>
      {/* History output panel */}
      {history.length > 0 && (
        <div
          onClick={() => inputRef.current?.focus()}
          className="fixed bottom-[49px] left-0 right-0 bg-term-bg/[0.97] border-t border-term-border px-8 max-h-64 overflow-y-auto z-[99] font-mono text-xs"
        >
          {history.slice(-6).map((h, i) => (
            <div key={i} className="py-1.5">
              {/* prompt line */}
              <div className="text-[10px] mb-0.5">
                <span className="text-term-blue">roman</span>
                <span className="text-term-dim">@</span>
                <span className="text-term-amber">veiag.dev</span>
                <span className="text-term-dim">:{cwdLabel} $</span>{' '}
                <span className="text-term-dim">{h.cmd}</span>
              </div>

              {/* output */}
              {h.type === 'fastfetch' && (
                <div className="flex gap-6 mt-1 overflow-x-auto">
                  <pre className="text-term-green text-[8px] leading-snug shrink-0">{ART}</pre>
                  <div className="flex flex-col justify-center gap-0.5 min-w-0">
                    {info.map(([k, v], j) => (
                      <div key={j} className="text-[10px] leading-relaxed">
                        {k ? (
                          <>
                            <span className="text-term-amber inline-block min-w-[80px]">{k}</span>
                            <span className="text-term-text">{v}</span>
                          </>
                        ) : (
                          <span className={
                            j === 1               ? 'text-term-dim' :
                            j === info.length - 1 ? 'tracking-[0.25em] text-term-text' :
                                                    'text-term-bright'
                          }>{v}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {h.type === 'ls-root' && (
                <div className="flex gap-6 mt-0.5 pl-2">
                  {ROOT_LS.map(({ name, color, hint }) => (
                    <span key={name} className="flex items-center gap-1.5">
                      <span className={`${color} font-bold`}>{name}</span>
                      {hint && <span className="text-term-dim text-[10px]">— {hint}</span>}
                    </span>
                  ))}
                </div>
              )}

              {h.type === 'ls-items' && (
                <div className="flex flex-wrap gap-x-6 gap-y-0.5 mt-0.5 pl-2">
                  {h.items.map(({ name, hint }) => (
                    <span key={name} className="flex items-center gap-1.5">
                      <span className={name.endsWith('/') ? 'text-term-blue font-bold' : 'text-term-text'}>
                        {name}
                      </span>
                      {hint && <span className="text-term-dim text-[10px]">— {hint}</span>}
                    </span>
                  ))}
                </div>
              )}

              {h.type === 'text' && (
                <div className="text-term-muted pl-2 whitespace-pre-wrap">{h.result}</div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Input bar */}
      <div className="fixed bottom-0 left-0 right-0 h-[49px] bg-term-bg/[0.97] border-t border-term-border px-4 sm:px-8 flex items-center gap-2 z-[100]">
        <span className="text-[12px] font-mono whitespace-nowrap hidden sm:inline">
          <span className="text-term-blue">roman</span>
          <span className="text-term-dim">@</span>
          <span className="text-term-amber">veiag.dev</span>
          <span className="text-term-dim">:{cwdLabel} $</span>
        </span>
        <span className="text-[12px] font-mono whitespace-nowrap sm:hidden">
          <span className="text-term-amber">{cwdLabel}</span>
          <span className="text-term-dim"> $</span>
        </span>
        <input
          ref={inputRef}
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && run(value)}
          placeholder="type a command..."
          className="flex-1 bg-transparent border-none outline-none text-term-bright font-mono text-[13px] caret-term-amber placeholder:text-term-dim min-w-0"
          autoComplete="off"
          spellCheck={false}
        />
        <span className="text-term-dim text-[11px] whitespace-nowrap hidden md:inline">
          try &apos;ls&apos; or &apos;help&apos;
        </span>
      </div>
    </>
  )
}
