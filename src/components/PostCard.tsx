import { Media, PostCategory } from '@/payload-types'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import TerminalTag from './TerminalTag'

type Props = {
  title: string
  description?: string | null
  categories?: (string | PostCategory)[] | null
  image?: string | Media | null
  slug: string
  publishedAt?: string | null
  /** Row index used as a display number (e.g. "// 001"). */
  index?: number
  className?: string
  /** When true, renders a more compact row without the side image column. */
  compact?: boolean
}

export default function PostCard({
  title,
  description,
  categories,
  image,
  slug,
  publishedAt,
  index,
  className,
  compact = false,
}: Props) {
  const dateStr = publishedAt
    ? new Date(publishedAt).toISOString().slice(0, 10)
    : null

  const imgSrc  = typeof image === 'string' ? image : image?.url ?? null
  const imgAlt  = (image as Media)?.alt ?? title
  const imgBlur = typeof image === 'object' && image !== null ? (image as Media).blurDataUrl ?? undefined : undefined

  return (
    <Link
      href={`/blog/${slug}`}
      className={cn(
        'group flex items-stretch border-b border-term-border bg-term-bg transition-colors duration-150 hover:bg-term-bg2',
        className,
      )}
    >
      {/* Left image column (hidden in compact mode) */}
      {!compact && (
        <div className="w-[180px] shrink-0 border-r border-term-border overflow-hidden hidden sm:block">
          {imgSrc ? (
            <div className="relative w-full h-full min-h-[130px]">
              <Image
                src={imgSrc}
                alt={imgAlt}
                fill
                className="object-cover grayscale-[30%] brightness-[0.85] transition-[filter] duration-300 group-hover:grayscale-0 group-hover:brightness-100"
                placeholder={imgBlur ? 'blur' : 'empty'}
                blurDataURL={imgBlur}
              />
            </div>
          ) : (
            <div className="w-full h-full min-h-[130px] bg-term-bg3 flex items-center justify-center text-term-dim text-[10px] tracking-[2px]">
              NO PREVIEW
            </div>
          )}
        </div>
      )}

      {/* Body */}
      <div className="flex-1 px-6 py-5 flex flex-col justify-between gap-3 min-w-0">
        <div>
          <div className="flex items-center gap-3 mb-2">
            {dateStr && (
              <span className="text-term-dim text-[11px]">{dateStr}</span>
            )}
          </div>
          <div className="text-term-bright text-[15px] font-semibold leading-snug mb-2 transition-colors duration-150 group-hover:text-term-amber line-clamp-2">
            {title}
          </div>
          {description && (
            <p className="text-term-muted text-[12px] leading-relaxed line-clamp-2">
              {description}
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {categories?.map((cat, i) => (
            <TerminalTag key={i} variant="amber">
              {typeof cat === 'string' ? cat : cat.title}
            </TerminalTag>
          ))}
        </div>
      </div>

      {/* Right side */}
      <div className="border-l border-term-border px-4 py-5 hidden sm:flex flex-col justify-between items-end min-w-[90px]">
        {index !== undefined && (
          <span className="text-term-dim text-[11px]">{'// '}{String(index + 1).padStart(3, '0')}</span>
        )}
        <span className="text-term-dim text-lg transition-[color,transform] duration-150 group-hover:text-term-amber group-hover:translate-x-[2px] group-hover:translate-y-[-2px] inline-block">
          ↗
        </span>
      </div>
    </Link>
  )
}
