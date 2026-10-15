import { Media, ProjectTag } from '@/payload-types'
import Image from 'next/image'
import { Github, ExternalLink } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import TerminalTag from './TerminalTag'

type Props = {
  title: string
  slug?: string | null
  description?: string | null
  url?: string | null
  githubLink?: string | null
  tags?: (string | ProjectTag)[] | null
  image?: string | Media | null
  madeWithAI?: boolean | null
  index?: number
  className?: string
}

export default function AppCard({
  title,
  slug,
  description,
  url,
  githubLink,
  tags,
  image,
  madeWithAI,
  index,
  className,
}: Props) {
  const imgSrc  = typeof image === 'string' ? image : image?.url ?? null
  const imgAlt  = (image as Media)?.alt ?? title
  const imgBlur = typeof image === 'object' && image !== null ? (image as Media).blurDataUrl ?? undefined : undefined

  return (
    <div
      className={cn(
        'group flex flex-col bg-term-bg relative transition-colors duration-150 hover:bg-term-bg2',
        className,
      )}
    >
      {/* Arrow */}
      <span className="absolute top-3 right-3 text-term-dim text-sm z-10 transition-[color,transform] duration-150 group-hover:text-term-amber group-hover:translate-x-[2px] group-hover:translate-y-[-2px]">
        ↗
      </span>

      {imgSrc && (
        <div className="relative w-full aspect-[16/9] overflow-hidden border-b border-term-border">
          <Image
            src={imgSrc} alt={imgAlt} fill
            className="object-cover grayscale-[40%] brightness-[0.8] group-hover:grayscale-0 group-hover:brightness-100 transition-[filter] duration-300"
            placeholder={imgBlur ? 'blur' : 'empty'} blurDataURL={imgBlur}
          />
        </div>
      )}

      <div className="flex flex-col flex-1 p-5 gap-2">
        {index !== undefined && <div className="text-term-dim text-[10px] tracking-wider">{'// '}{String(index + 1).padStart(3, '0')}</div>}
        {/* Stretched link: the whole card opens the app page */}
        <Link
          // Docs saved before slugs existed have none until re-saved
          href={slug ? `/apps/${slug}` : (githubLink || url || '/apps')}
          className="text-term-bright text-[15px] font-semibold group-hover:text-term-amber transition-colors line-clamp-1 pr-6 after:absolute after:inset-0 after:content-['']"
        >
          {title}
        </Link>
        <p className="text-term-muted text-[11px] leading-relaxed flex-1 line-clamp-3">{description}</p>
        <div className="flex flex-wrap items-center gap-1 mt-1">
          {madeWithAI && <TerminalTag variant="amber">✦ made with AI</TerminalTag>}
          {tags?.map((t, i) => (
            <TerminalTag key={i}>{typeof t === 'string' ? t : t.title}</TerminalTag>
          ))}
          <span className="relative z-10 ml-auto flex items-center gap-3">
            {url && (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Launch"
                className="text-term-dim hover:text-term-amber transition-colors"
              >
                <ExternalLink size={14} />
              </a>
            )}
            {githubLink && (
              <a
                href={githubLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="text-term-dim hover:text-term-amber transition-colors"
              >
                <Github size={14} />
              </a>
            )}
          </span>
        </div>
      </div>
    </div>
  )
}
