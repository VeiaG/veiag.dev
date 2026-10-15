import React, { cache } from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Metadata } from 'next'
import { generateMeta } from '@/lib/generateMeta'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import RichText from '@/components/RichText'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import TerminalBreadcrumb from '@/components/TerminalBreadcrumb'
import TerminalTag from '@/components/TerminalTag'
import SectionHeader from '@/components/SectionHeader'
import { Link } from '@/i18n/navigation'
import { AvaibleLocale } from '@/i18n/routing'
import { Github, ExternalLink } from 'lucide-react'

export async function generateStaticParams() {
  const payload = await getPayload({ config })
  const apps = await payload.find({
    collection: 'apps',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: { slug: true },
    locale: 'all',
  })
  return apps.docs.flatMap(doc =>
    Object.entries(doc.slug || {}).map(([locale, slug]) => ({ locale, slug })),
  )
}

type Args = { params: Promise<{ slug?: string; locale?: AvaibleLocale }> }

export default async function AppPage({ params }: Args) {
  const { slug = '', locale = 'en' } = await params
  const app = await queryApp(slug, locale)
  if (!app) notFound()

  const tags   = app.tags ?? []
  const image  = typeof app.image === 'object' ? app.image : null
  const repo   = app.githubLink.replace(/^https?:\/\/(www\.)?github\.com\//, '').replace(/\/$/, '')

  const linkCls = 'px-4 py-2 text-[12px] font-mono border flex items-center gap-2 -mr-px transition-colors duration-150'
  const primary = `${linkCls} text-black bg-term-amber border-term-amber hover:bg-term-amber/80`
  const secondary = `${linkCls} text-term-muted border-term-border hover:text-term-text hover:bg-term-bg3`

  return (
    <div className="max-w-[860px] mx-auto px-4 sm:px-8 pb-16 animate-fade-in-up">

      {/* Breadcrumb */}
      <TerminalBreadcrumb
        segments={[
          { label: '~',    href: '/' },
          { label: 'apps', href: '/apps' },
          { label: app.slug ?? slug },
        ]}
      />

      {/* Hero grid */}
      <div className={`grid grid-cols-1 ${image ? 'md:grid-cols-[1fr_280px]' : ''} gap-px bg-term-border border border-term-border mb-10`}>
        {/* Left: info */}
        <div className="bg-term-bg2 p-8">
          <h1 className="text-[30px] sm:text-[36px] font-bold text-term-bright tracking-[-1.5px] leading-tight mb-3">
            {app.title}
          </h1>
          <p className="text-term-muted text-[13px] leading-relaxed mb-6 whitespace-pre-line">
            {app.description}
          </p>

          {/* Badges */}
          {(app.madeWithAI || tags.length > 0) && (
            <div className="flex flex-wrap gap-1 mb-8">
              {app.madeWithAI && <TerminalTag variant="amber">✦ made with AI</TerminalTag>}
              {tags.map((t, i) => (
                <TerminalTag key={i}>{typeof t === 'string' ? t : t.title}</TerminalTag>
              ))}
            </div>
          )}

          {/* Action buttons: web apps launch, desktop tools go to the repo */}
          <div className="flex flex-wrap gap-0">
            {app.url && (
              <a href={app.url} target="_blank" rel="noopener noreferrer" className={primary}>
                <ExternalLink size={12} /> launch
              </a>
            )}
            <a
              href={app.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className={app.url ? secondary : primary}
            >
              <Github size={12} /> {repo || 'github'}
            </a>
          </div>
        </div>

        {/* Right: image */}
        {image?.url && (
          <div className="bg-term-bg3 relative overflow-hidden min-h-[240px]">
            <Image
              src={image.url}
              alt={image.alt ?? app.title}
              fill
              className="object-cover grayscale-[20%] brightness-[0.85]"
              placeholder={image.blurDataUrl ? 'blur' : 'empty'}
              blurDataURL={image.blurDataUrl ?? undefined}
            />
          </div>
        )}
      </div>

      {/* README.md */}
      {app.content && (
        <div className="mb-10">
          <SectionHeader cmd="cat README.md" />
          <div className="text-term-text text-[13px] leading-[1.9]">
            <RichText data={app.content as unknown as DefaultTypedEditorState} />
          </div>
        </div>
      )}

      {/* Nav */}
      <div className="flex justify-between pt-10 border-t border-term-border gap-4">
        <Link
          href="/apps"
          className="px-4 py-2.5 text-[12px] font-mono text-term-muted border border-term-border hover:text-term-amber hover:border-term-amber hover:bg-term-amber/5 transition-colors duration-150 flex items-center gap-2"
        >
          ← all apps
        </Link>
        <Link
          href="/"
          className="px-4 py-2.5 text-[12px] font-mono text-term-muted border border-term-border hover:text-term-amber hover:border-term-amber hover:bg-term-amber/5 transition-colors duration-150 flex items-center gap-2"
        >
          ~/home ↗
        </Link>
      </div>
    </div>
  )
}

export async function generateMetadata({ params: p }: Args): Promise<Metadata> {
  const { slug = '', locale = 'en' } = await p
  const app = await queryApp(slug, locale)
  return generateMeta({ doc: app })
}

const queryApp = cache(async (slug: string, locale: AvaibleLocale) => {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'apps',
    limit: 1,
    pagination: false,
    overrideAccess: false,
    depth: 2,
    where: { slug: { equals: slug } },
    locale,
  })
  return result.docs?.[0] ?? null
})
