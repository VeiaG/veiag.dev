'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from '@/i18n/navigation'
import TerminalPrompt from './TerminalPrompt'

/* ─── ASCII art ──────────────────────────────────────────────────────────── */

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

/* ─── Virtual filesystem root entries ────────────────────────────────────── */

const ROOT_ENTRIES = [
  { name: 'blog/',            color: 'text-term-blue',  hint: 'latest posts'     },
  { name: 'projects/',        color: 'text-term-green', hint: 'open-source work' },
  { name: 'experience.json',  color: 'text-term-amber', hint: 'work history'     },
  { name: 'skills.txt',       color: 'text-term-text',  hint: 'tech stack'       },
  { name: 'contact.txt',      color: 'text-term-text',  hint: 'get in touch'     },
]

const ROOT_TAB_CANDIDATES = [
  'ls', 'ls -la', 'ls -l',
  'ls ./blog', 'ls ./projects', 'ls -la ./projects', 'ls ./blog --sort=date',
  'cd blog', 'cd projects',
  'cat experience.json', 'cat skills.txt', 'cat contact.txt',
  'open blog', 'open projects',
  'pwd', 'whoami', 'fastfetch', 'contact', 'help', 'clear',
]

/* ─── Types ──────────────────────────────────────────────────────────────── */

type FastfetchProp = {
  header?: string | null
  items?: { key?: string | null; value: string }[] | null
} | undefined

export type ExperienceEntry = {
  company?: string | null
  position?: string | null
  startDate?: string | null
  endDate?: string | null
  isPresent?: boolean | null
  location?: string | null
}

export type SkillCategory = {
  category?: string | null
  items?: string[] | null
}

type Dir = 'root' | 'blog' | 'projects'

type LsItem = { name: string; hint?: string; slug?: string }

type HistoryEntry =
  | { type: 'text';        cmd: string; result: string; isError?: boolean }
  | { type: 'fastfetch';   cmd: string }
  | { type: 'ls-root';     cmd: string }
  | { type: 'ls-loading';  cmd: string }
  | { type: 'ls-items';    cmd: string; items: LsItem[]; dir: 'blog' | 'projects' }
  | { type: 'cat-exp';     cmd: string; data: ExperienceEntry[] }
  | { type: 'cat-skills';  cmd: string; data: SkillCategory[] }

/* ─── Component ──────────────────────────────────────────────────────────── */

export default function TerminalInputBar({
  fastfetch,
  experience,
  skills,
}: {
  fastfetch?: FastfetchProp
  experience?: ExperienceEntry[] | null
  skills?: SkillCategory[] | null
}) {
  const header = fastfetch?.header || DEFAULT_HEADER
  const info: [string, string][] = fastfetch?.items?.length
    ? [['', header], ['', '─────────────────────────'], ...fastfetch.items.map(({ key, value }) => [key ?? '', value] as [string, string])]
    : DEFAULT_ITEMS

  const [value,   setValue]   = useState('')
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [cwd,     setCwd]     = useState<Dir>('root')
  const inputRef  = useRef<HTMLInputElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const router    = useRouter()

  // per-dir cache so tab completion works after first ls
  const lsCache = useRef<Partial<Record<'blog' | 'projects', LsItem[]>>>({})

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history])

  function push(entry: HistoryEntry) {
    setHistory(h => [...h, entry].slice(-10))
    setValue('')
  }

  async function fetchLs(dir: 'blog' | 'projects'): Promise<LsItem[]> {
    if (lsCache.current[dir]) return lsCache.current[dir]!

    const url = dir === 'blog'
      ? '/api/posts?limit=10&sort=-publishedAt&depth=0'
      : '/api/projects?limit=0&sort=_order&depth=0'

    const res  = await fetch(url)
    const data = await res.json()

    const items: LsItem[] = (data.docs ?? []).map((p: { slug?: string; title?: string }) => ({
      name: dir === 'blog' ? `${p.slug ?? p.title}.md` : `${p.slug ?? p.title}/`,
      hint: p.title,
      slug: p.slug ?? p.title,
    }))

    lsCache.current[dir] = items
    return items
  }

  /* ── Tab autocomplete ── */
  function handleTab(e: React.KeyboardEvent<HTMLInputElement>) {
    e.preventDefault()
    const typed = value
    if (!typed) return

    let candidates: string[]

    if (cwd === 'root') {
      candidates = ROOT_TAB_CANDIDATES
    } else {
      const cached = lsCache.current[cwd] ?? []
      const slugs  = cached.map(i => i.slug).filter(Boolean) as string[]
      const names  = cached.map(i => i.name)

      candidates = ['ls', 'pwd', 'cd ..', 'cd ~', 'clear', 'help', 'whoami', ...names]

      if (cwd === 'blog') {
        candidates.push(...slugs.map(s => `cat ${s}.md`), ...slugs.map(s => `open ${s}`))
      } else {
        candidates.push(...slugs.map(s => `cd ${s}`), ...slugs.map(s => `open ${s}`))
      }
    }

    const matches = candidates.filter(c => c.startsWith(typed) && c !== typed)
    if (matches.length === 0) return

    if (matches.length === 1) {
      setValue(matches[0])
      return
    }

    // complete to common prefix
    const prefix = matches.reduce((a, b) => {
      let i = 0
      while (i < a.length && i < b.length && a[i] === b[i]) i++
      return a.slice(0, i)
    })
    if (prefix.length > typed.length) setValue(prefix)
  }

  /* ── Command runner ── */
  async function run(raw: string) {
    const trimmed = raw.trim()
    if (!trimmed) return
    const cmd = trimmed.toLowerCase()

    /* clear */
    if (cmd === 'clear') { setHistory([]); setValue(''); return }

    /* pwd */
    if (cmd === 'pwd') {
      push({ type: 'text', cmd: trimmed, result: cwd === 'root' ? '~' : `~/${cwd}` })
      return
    }

    /* cd back to root */
    if (cmd === 'cd' || cmd === 'cd ~' || cmd === 'cd /' || cmd === 'cd ..') {
      setCwd('root')
      push({ type: 'text', cmd: trimmed, result: '~' })
      return
    }

    /* cd blog | cd projects (from anywhere) */
    const cdDir = cmd.match(/^cd\s+(blog|projects)\/?$/)
    if (cdDir) {
      const target = cdDir[1] as 'blog' | 'projects'
      setCwd(target)
      push({ type: 'text', cmd: trimmed, result: `~/${target}` })
      fetchLs(target).catch(() => {}) // warm cache for tab completion
      return
    }

    /* cd <project-slug> inside ~/projects → navigate to project page */
    if (cwd === 'projects') {
      const m = cmd.match(/^cd\s+([\w-]+)\/?$/)
      if (m) {
        const slug  = m[1]
        const items = lsCache.current['projects'] ?? []
        const found = items.find(i => i.slug === slug)
        if (found) {
          push({ type: 'text', cmd: trimmed, result: `Opening /projects/${slug}...` })
          router.push(`/projects/${slug}` as any)
        } else {
          push({ type: 'text', cmd: trimmed, result: `cd: ${slug}: No such directory`, isError: true })
        }
        return
      }
    }

    /* any other cd → contextual error */
    if (/^cd(\s|$)/.test(cmd)) {
      const arg = trimmed.slice(3).trim()
      push({ type: 'text', cmd: trimmed, result: `cd: ${arg || '~'}: No such file or directory`, isError: true })
      return
    }

    /* ls — supports ls, ls -la, ls ./blog, ls -la ./projects, ls ./blog --sort=date */
    if (/^ls(\s|$)/.test(cmd)) {
      const pathMatch = cmd.match(/\b(blog|projects)\b/)
      const targetDir = pathMatch
        ? (pathMatch[1] as 'blog' | 'projects')
        : (cwd === 'root' ? null : (cwd as 'blog' | 'projects'))

      if (!targetDir) {
        push({ type: 'ls-root', cmd: trimmed })
      } else {
        setHistory(h => [...h, { type: 'ls-loading', cmd: trimmed }].slice(-10))
        setValue('')
        const items = await fetchLs(targetDir)
        setHistory(h => {
          const copy = [...h]
          const idx  = copy.findLastIndex(e => e.type === 'ls-loading')
          if (idx !== -1) copy[idx] = { type: 'ls-items', cmd: trimmed, items, dir: targetDir }
          return copy
        })
      }
      return
    }

    /* cat experience.json */
    if (cmd === 'cat experience.json') {
      if (experience?.length) {
        push({ type: 'cat-exp', cmd: trimmed, data: experience })
      } else {
        push({ type: 'text', cmd: trimmed, result: 'cat: experience.json: empty' })
      }
      return
    }

    /* cat skills.txt */
    if (cmd === 'cat skills.txt') {
      if (skills?.length) {
        push({ type: 'cat-skills', cmd: trimmed, data: skills })
      } else {
        push({ type: 'text', cmd: trimmed, result: 'cat: skills.txt: empty' })
      }
      return
    }

    /* cat contact.txt */
    if (cmd === 'cat contact.txt' || cmd === 'contact') {
      push({
        type: 'text',
        cmd: trimmed,
        result: 'email:    roman@veiag.dev\ngithub:   github.com/VeiaG\nlocation: Kyiv, Ukraine',
      })
      return
    }

    /* cat / open <slug> inside ~/blog */
    if (cwd === 'blog') {
      const m = cmd.match(/^(?:cat|open)\s+([\w-]+)(?:\.md)?$/)
      if (m) {
        const slug  = m[1]
        const items = lsCache.current['blog'] ?? []
        const found = items.find(i => i.slug === slug)
        if (found) {
          push({ type: 'text', cmd: trimmed, result: `Opening /blog/${slug}...` })
          router.push(`/blog/${slug}` as any)
        } else {
          push({ type: 'text', cmd: trimmed, result: `cat: ${m[1]}.md: No such file`, isError: true })
        }
        return
      }
    }

    /* open <slug> inside ~/projects */
    if (cwd === 'projects') {
      const m = cmd.match(/^open\s+([\w-]+)\/?$/)
      if (m) {
        const slug  = m[1]
        const items = lsCache.current['projects'] ?? []
        const found = items.find(i => i.slug === slug)
        if (found) {
          push({ type: 'text', cmd: trimmed, result: `Opening /projects/${slug}...` })
          router.push(`/projects/${slug}` as any)
        } else {
          push({ type: 'text', cmd: trimmed, result: `open: ${m[1]}: Not found`, isError: true })
        }
        return
      }
    }

    /* open blog | open projects */
    if (cmd === 'open blog')     { router.push('/blog');     push({ type: 'text', cmd: trimmed, result: 'Opening /blog...' });     return }
    if (cmd === 'open projects') { router.push('/projects'); push({ type: 'text', cmd: trimmed, result: 'Opening /projects...' }); return }

    /* misc */
    let result: string
    switch (cmd) {
      case 'help': {
        const lines = [
          'Navigation:  cd <dir>  cd ..  pwd',
          'Listing:     ls  ls ./blog  ls ./projects  ls -la ./projects',
          'Files:       cat experience.json  cat skills.txt  cat contact.txt',
          'Other:       open blog  open projects  fastfetch  whoami  clear',
        ]
        if (cwd === 'blog')     lines.push('Blog dir:    cat <slug>.md  open <slug>  [click file to open]')
        if (cwd === 'projects') lines.push('Projects dir: cd <slug>  open <slug>  [click dir to open]')
        result = lines.join('\n')
        break
      }
      case 'whoami': {
        const get = (key: string) => info.find(([k]) => k === key)?.[1]
        const role     = get('Host')
        const location = get('Location')
        result = [header, role, location].filter(Boolean).join(' · ')
        break
      }
      case 'fastfetch':
        push({ type: 'fastfetch', cmd: trimmed })
        return
      default:
        result = `command not found: ${trimmed.split(' ')[0]}. Type 'help'`
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
          {history.map((h, i) => (
            <div key={i} className="py-1.5">
              {/* prompt line */}
              <div className="text-[10px] mb-0.5">
                <span className="text-term-blue">roman</span>
                <span className="text-term-dim">@</span>
                <span className="text-term-amber">veiag.dev</span>
                <span className="text-term-dim">:{cwdLabel} $</span>{' '}
                <span className="text-term-dim">{h.cmd}</span>
              </div>

              {/* fastfetch */}
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

              {/* ls ~ */}
              {h.type === 'ls-root' && (
                <div className="flex flex-wrap gap-x-6 gap-y-0.5 mt-0.5 pl-2">
                  {ROOT_ENTRIES.map(({ name, color, hint }) => (
                    <span key={name} className="flex items-center gap-1.5">
                      <span className={`${color} font-bold`}>{name}</span>
                      {hint && <span className="text-term-dim text-[10px]">— {hint}</span>}
                    </span>
                  ))}
                </div>
              )}

              {/* loading dots */}
              {h.type === 'ls-loading' && (
                <div className="flex items-center gap-2 pl-2 mt-1">
                  {[0, 1, 2].map(j => (
                    <span
                      key={j}
                      className="inline-block w-1.5 h-1.5 rounded-full bg-term-amber animate-pulse"
                      style={{ animationDelay: `${j * 0.18}s` }}
                    />
                  ))}
                  <span className="text-term-dim text-[10px]">fetching...</span>
                </div>
              )}

              {/* ls blog | ls projects — clickable items */}
              {h.type === 'ls-items' && (
                <div className="flex flex-wrap gap-x-6 gap-y-0.5 mt-0.5 pl-2">
                  {h.items.map(({ name, hint, slug }) => (
                    <button
                      key={name}
                      onClick={e => {
                        e.stopPropagation()
                        if (!slug) return
                        router.push((h.dir === 'blog' ? `/blog/${slug}` : `/projects/${slug}`) as any)
                      }}
                      className="flex items-center gap-1.5 group text-left"
                    >
                      <span className={`${
                        name.endsWith('/')   ? 'text-term-blue font-bold' :
                        name.endsWith('.md') ? 'text-term-green' :
                                              'text-term-text'
                      } group-hover:underline`}>
                        {name}
                      </span>
                      {hint && <span className="text-term-dim text-[10px]">— {hint}</span>}
                    </button>
                  ))}
                </div>
              )}

              {/* cat experience.json */}
              {h.type === 'cat-exp' && (
                <div className="pl-2 mt-0.5 flex flex-col gap-px">
                  {h.data.map((job, j) => (
                    <div key={j} className="text-[10px]">
                      <span className="text-term-amber">{job.company}</span>
                      <span className="text-term-dim"> · </span>
                      <span className="text-term-text">{job.position}</span>
                      <span className="text-term-dim">
                        {' '}[{job.startDate} – {job.isPresent ? 'Present' : (job.endDate ?? '?')}]
                      </span>
                      {job.location && (
                        <span className="text-term-dim"> @ {job.location}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* cat skills.txt */}
              {h.type === 'cat-skills' && (
                <div className="pl-2 mt-0.5 flex flex-wrap gap-x-6 gap-y-0.5">
                  {h.data.map(cat => (
                    <div key={cat.category} className="text-[10px]">
                      <span className="text-term-amber">[{cat.category}]</span>
                      <span className="text-term-dim"> {(cat.items ?? []).join(', ')}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* plain text / errors */}
              {h.type === 'text' && (
                <div className={`${h.isError ? 'text-term-red' : 'text-term-muted'} pl-2 whitespace-pre-wrap`}>
                  {h.result}
                </div>
              )}
            </div>
          ))}
          <div ref={bottomRef} />
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
          onKeyDown={e => {
            if (e.key === 'Enter') run(value)
            if (e.key === 'Tab')   handleTab(e)
          }}
          placeholder="type a command... (Tab to complete)"
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
