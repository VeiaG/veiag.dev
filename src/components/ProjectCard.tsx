import { Media, ProjectTag } from '@/payload-types'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import TerminalTag from './TerminalTag'

type Variant = 'grid' | 'list' | 'featured'

type Props = {
  title: string
  description?: string | null
  tags?: (string | ProjectTag)[] | null
  image?: string | Media | null
  slug: string
  status?: 'active' | 'archived'
  year?: string
  index?: number
  variant?: Variant
  className?: string
}

export default function ProjectCard({
  title,
  description,
  tags,
  image,
  slug,
  status,
  year,
  index,
  variant = 'grid',
  className,
}: Props) {
  const imgSrc  = typeof image === 'string' ? image : image?.url ?? null
  const imgAlt  = (image as Media)?.alt ?? title
  const imgBlur = typeof image === 'object' && image !== null ? (image as Media).blurDataUrl ?? undefined : undefined

  if (variant === 'list') {
    return (
      <Link
        href={`/projects/${slug}`}
        className={cn(
          'group grid bg-term-bg border-b border-term-border transition-colors duration-150 hover:bg-term-bg2',
          'grid-cols-[48px_180px_1fr_80px] sm:grid-cols-[48px_200px_1fr_100px]',
          className,
        )}
      >
        <div className="flex items-center justify-center border-r border-term-border text-term-dim text-[11px] font-mono">
          {index !== undefined ? String(index + 1).padStart(3, '0') : ''}
        </div>
        <div className="border-r border-term-border overflow-hidden">
          {imgSrc ? (
            <div className="relative w-full h-full min-h-[72px]">
              <Image
                src={imgSrc} alt={imgAlt} fill
                className="object-cover grayscale-[50%] brightness-[0.8] group-hover:grayscale-0 group-hover:brightness-100 transition-[filter] duration-300"
                placeholder={imgBlur ? 'blur' : 'empty'} blurDataURL={imgBlur}
              />
            </div>
          ) : (
            <div className="w-full h-full min-h-[72px] bg-term-bg3 flex items-center justify-center text-term-dim text-[9px] tracking-[2px]">NO PREVIEW</div>
          )}
        </div>
        <div className="px-5 py-3 flex flex-col justify-center gap-1">
          <div className="text-term-bright text-[14px] font-semibold group-hover:text-term-amber transition-colors duration-150">{title}</div>
          {description && <div className="text-term-dim text-[11px] line-clamp-1">{description}</div>}
          <div className="flex flex-wrap gap-1 mt-1">
            {tags?.slice(0, 4).map((t, i) => (
              <TerminalTag key={i}>{typeof t === 'string' ? t : t.title}</TerminalTag>
            ))}
          </div>
        </div>
        <div className="border-l border-term-border px-3 py-3 flex flex-col justify-between items-end">
          {year && <span className="text-term-dim text-[11px]">{year}</span>}
          <StatusBadge status={status} className="text-[10px]" />
        </div>
      </Link>
    )
  }

  if (variant === 'featured') {
    return (
      <Link
        href={`/projects/${slug}`}
        className={cn(
          'group grid bg-term-bg2 border border-term-border transition-colors duration-150 hover:bg-term-bg3',
          'grid-cols-1 md:grid-cols-[280px_1fr]',
          className,
        )}
      >
        <div className="border-b md:border-b-0 md:border-r border-term-border overflow-hidden">
          {imgSrc ? (
            <div className="relative w-full min-h-[200px] h-full">
              <Image
                src={imgSrc} alt={imgAlt} fill
                className="object-cover grayscale-[30%] brightness-[0.85] group-hover:grayscale-0 group-hover:brightness-100 transition-[filter] duration-300"
                placeholder={imgBlur ? 'blur' : 'empty'} blurDataURL={imgBlur}
              />
            </div>
          ) : (
            <div className="w-full min-h-[200px] bg-term-bg3 flex items-center justify-center text-term-dim text-[10px] tracking-[2px]">NO PREVIEW</div>
          )}
        </div>
        <div className="p-6 flex flex-col justify-between gap-4">
          <div>
            {index !== undefined && <div className="text-term-dim text-[11px] mb-2">{'// '}{String(index + 1).padStart(3, '0')}</div>}
            <div className="text-term-bright text-[18px] font-bold mb-2 group-hover:text-term-amber transition-colors">{title}</div>
            <p className="text-term-muted text-[12px] leading-relaxed line-clamp-3">{description}</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {tags?.map((t, i) => (
              <TerminalTag key={i}>{typeof t === 'string' ? t : t.title}</TerminalTag>
            ))}
          </div>
        </div>
      </Link>
    )
  }

  /* grid (default) */
  return (
    <Link
      href={`/projects/${slug}`}
      className={cn(
        'group flex flex-col bg-term-bg relative transition-colors duration-150 hover:bg-term-bg2',
        className,
      )}
    >
      {/* Arrow */}
      <span className="absolute top-3 right-3 text-term-dim text-sm z-10 transition-[color,transform] duration-150 group-hover:text-term-amber group-hover:translate-x-[2px] group-hover:translate-y-[-2px]">
        ↗
      </span>

      {/* Image */}
      {imgSrc ? (
        <div className="relative w-full aspect-[16/9] overflow-hidden">
          <Image
            src={imgSrc} alt={imgAlt} fill
            className="object-cover grayscale-[40%] brightness-[0.8] group-hover:grayscale-0 group-hover:brightness-100 transition-[filter] duration-300"
            placeholder={imgBlur ? 'blur' : 'empty'} blurDataURL={imgBlur}
          />
        </div>
      ) : (
        <div className="w-full aspect-[16/9] bg-term-bg3 border-b border-term-border flex items-center justify-center text-term-dim text-[10px] tracking-[2px]">
          NO PREVIEW
        </div>
      )}

      {/* Body */}
      <div className="flex flex-col flex-1 p-5 pb-8 gap-2">
        {index !== undefined && <div className="text-term-dim text-[10px] tracking-wider">{'// '}{String(index + 1).padStart(3, '0')}</div>}
        <div className="text-term-bright text-[15px] font-semibold group-hover:text-term-amber transition-colors line-clamp-1">
          {title}
        </div>
        <p className="text-term-muted text-[11px] leading-relaxed flex-1 line-clamp-2">{description}</p>
        <div className="flex flex-wrap gap-1 mt-1">
          {tags?.map((t, i) => (
            <TerminalTag key={i}>{typeof t === 'string' ? t : t.title}</TerminalTag>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 right-5 flex items-center gap-3">
        {year && <span className="text-term-dim text-[10px]">{year}</span>}
        <StatusBadge status={status} />
      </div>
    </Link>
  )
}

function StatusBadge({ status, className }: { status?: string; className?: string }) {
  if (!status) return null
  return (
    <span className={cn(
      'text-[10px] tracking-wider font-mono',
      status === 'active' ? 'text-term-green' : 'text-term-dim',
      className,
    )}>
      {status === 'active' ? '● active' : '○ archived'}
    </span>
  )
}
