'use client'

import { useRef, useState } from 'react'
import { useRouter } from '@/i18n/navigation'
import TerminalPrompt from './TerminalPrompt'

/* ─── Fastfetch data ─────────────────────────────────────────────────────── */

const ART = `
 ██╗   ██╗███████╗██╗ █████╗  ██████╗
 ██║   ██║██╔════╝██║██╔══██╗██╔════╝
 ██║   ██║█████╗  ██║███████║██║  ███╗
 ╚██╗ ██╔╝██╔══╝  ██║██╔══██║██║   ██║
  ╚████╔╝ ███████╗██║██║  ██║╚██████╔╝
   ╚═══╝  ╚══════╝╚═╝╚═╝  ╚═╝ ╚═════╝`

const INFO: [string, string][] = [
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

/* ─── Types ──────────────────────────────────────────────────────────────── */

type HistoryItem = { cmd: string; result: string }

/* ─── Component ─────────────────────────────────────────────────────────── */

export default function TerminalInputBar() {
  const [value,   setValue]   = useState('')
  const [history, setHistory] = useState<HistoryItem[]>([])
  const inputRef              = useRef<HTMLInputElement>(null)
  const router                = useRouter()

  function run(raw: string) {
    const cmd = raw.trim().toLowerCase()

    if (cmd === 'clear') {
      setHistory([])
      setValue('')
      return
    }

    let result: string

    switch (cmd) {
      case 'help':
        result = 'Commands: whoami · fastfetch · open blog · open projects · contact · clear'
        break
      case 'whoami':
        result = 'Roman Palamar — Full-stack Developer · roman@veiag.dev · Kyiv, Ukraine'
        break
      case 'fastfetch':
        result = '__FASTFETCH__'
        break
      case 'contact':
        result = 'roman@veiag.dev'
        break
      case 'open blog':
        router.push('/blog')
        result = 'Opening /blog...'
        break
      case 'open projects':
        router.push('/projects')
        result = 'Opening /projects...'
        break
      default:
        result = `command not found: ${cmd}. Try 'help'`
    }

    setHistory(h => [...h, { cmd, result }])
    setValue('')
  }

  return (
    <>
      {/* History output panel */}
      {history.length > 0 && (
        <div
          onClick={() => inputRef.current?.focus()}
          className="fixed bottom-[49px] left-0 right-0 bg-term-bg/[0.97] border-t border-term-border px-8 max-h-64 overflow-y-auto z-[99] font-mono text-xs"
        >
          {history.slice(-4).map((h, i) => (
            <div key={i} className="py-2">
              <div>
                <span className="text-term-amber">$</span>{' '}
                <span className="text-term-dim">{h.cmd}</span>
              </div>

              {h.result === '__FASTFETCH__' ? (
                <div className="flex gap-6 mt-1 overflow-x-auto">
                  <pre className="text-term-green text-[8px] leading-snug shrink-0">{ART}</pre>
                  <div className="flex flex-col justify-center gap-0.5 min-w-0">
                    {INFO.map(([k, v], j) => (
                      <div key={j} className="text-[10px] leading-relaxed">
                        {k ? (
                          <>
                            <span className="text-term-amber inline-block min-w-[80px]">{k}</span>
                            <span className="text-term-text">{v}</span>
                          </>
                        ) : (
                          <span className={
                            j === 1               ? 'text-term-dim' :
                            j === INFO.length - 1 ? 'tracking-[0.25em] text-term-text' :
                                                    'text-term-bright'
                          }>{v}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-term-muted pl-3 whitespace-pre-wrap">{h.result}</div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Input bar */}
      <div className="fixed bottom-0 left-0 right-0 h-[49px] bg-term-bg/[0.97] border-t border-term-border px-8 flex items-center gap-2.5 z-[100]">
        <TerminalPrompt />
        <input
          ref={inputRef}
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && run(value)}
          placeholder="type a command..."
          className="flex-1 bg-transparent border-none outline-none text-term-bright font-mono text-[13px] caret-term-amber placeholder:text-term-dim"
          autoComplete="off"
          spellCheck={false}
        />
        <span className="text-term-dim text-[11px] whitespace-nowrap hidden sm:inline">
          ↵ run · try &apos;fastfetch&apos;
        </span>
      </div>
    </>
  )
}
