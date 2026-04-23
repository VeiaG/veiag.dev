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
import { Github, Figma, ExternalLink } from 'lucide-react'

export async function generateStaticParams() {
  const payload = await getPayload({ config })
  const projects = await payload.find({
    collection: 'projects',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: { slug: true },
    locale: 'all',
  })
  return projects.docs.flatMap(doc =>
    Object.entries(doc.slug || {}).map(([locale, slug]) => ({ locale, slug })),
  )
}

type Args = { params: Promise<{ slug?: string; locale?: AvaibleLocale }> }

export default async function ProjectPage({ params }: Args) {
  const { slug = '', locale = 'en' } = await params
  const project = await queryProject(slug, locale)
  if (!project) notFound()

  /* Derive display year from updatedAt if no dedicated year field */
  const year = (project as any).year as string | undefined
    ?? new Date(project.updatedAt).getFullYear().toString()

  const status = (project as any).status as 'active' | 'archived' | undefined ?? 'active'

  const tags = project.tags ?? []

  return (
    <div className="max-w-[860px] mx-auto px-4 sm:px-8 pb-16 animate-fade-in-up">

      {/* Breadcrumb */}
      <TerminalBreadcrumb
        segments={[
          { label: '~',        href: '/' },
          { label: 'projects', href: '/projects' },
          { label: project.slug ?? slug },
        ]}
      />

      {/* Hero grid */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-px bg-term-border border border-term-border mb-10">
        {/* Left: info */}
        <div className="bg-term-bg2 p-8">
          <div className="text-term-dim text-[11px] font-mono tracking-wider mb-3">
            {'// '}{String(1).padStart(3, '0')}
          </div>
          <h1 className="text-[30px] sm:text-[36px] font-bold text-term-bright tracking-[-1.5px] leading-tight mb-3">
            {project.title}
          </h1>
          <p className="text-term-muted text-[13px] leading-relaxed mb-6">
            {project.shortDescription}
          </p>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-8">
            <span className={`text-[10px] px-2.5 py-1 border font-mono tracking-wide ${
              status === 'active'
                ? 'border-term-green text-term-green bg-term-green/5'
                : 'border-term-dim text-term-dim'
            }`}>
              {status === 'active' ? '● active' : '○ archived'}
            </span>
            <span className="text-[10px] px-2.5 py-1 border border-term-amber text-term-amber bg-term-amber/5 font-mono tracking-wide">
              {year}
            </span>
            {project.githubLink && (
              <span className="text-[10px] px-2.5 py-1 border border-term-border text-term-dim font-mono tracking-wide">
                open-source
              </span>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-0">
            {project.projectLink && (
              <Link
                href={project.projectLink}
                target="_blank"
                className="px-4 py-2 text-[12px] font-mono text-black bg-term-amber border border-term-amber hover:bg-term-amber/80 transition-colors duration-150 flex items-center gap-2 -mr-px"
              >
                <ExternalLink size={12} /> live demo
              </Link>
            )}
            {project.githubLink && (
              <Link
                href={project.githubLink}
                target="_blank"
                className="px-4 py-2 text-[12px] font-mono text-term-muted border border-term-border hover:text-term-text hover:bg-term-bg3 transition-colors duration-150 flex items-center gap-2 -mr-px"
              >
                <Github size={12} /> github
              </Link>
            )}
            {project.figmaLink && (
              <Link
                href={project.figmaLink}
                target="_blank"
                className="px-4 py-2 text-[12px] font-mono text-term-muted border border-term-border hover:text-term-text hover:bg-term-bg3 transition-colors duration-150 flex items-center gap-2"
              >
                <Figma size={12} /> figma
              </Link>
            )}
          </div>
        </div>

        {/* Right: image */}
        <div className="bg-term-bg3 relative overflow-hidden min-h-[240px]">
          {project.image && (
            <Image
              src={(typeof project.image === 'string' ? project.image : project.image.url) ?? ''}
              alt={project.title}
              fill
              className="object-cover grayscale-[20%] brightness-[0.85]"
              placeholder="blur"
              blurDataURL={typeof project.image === 'object' ? (project.image.blurDataUrl ?? undefined) : undefined}
            />
          )}
          {!project.image && (
            <div className="absolute inset-0 flex items-center justify-center text-term-dim text-[11px] tracking-[2px]">
              NO PREVIEW
            </div>
          )}
        </div>
      </div>

      {/* Meta grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-term-border border border-term-border mb-10">
        {[
          { label: 'year',   value: year,   cls: '' },
          { label: 'status', value: status, cls: status === 'active' ? 'text-term-green' : '' },
          { label: 'type',   value: project.githubLink ? 'open-source' : 'client', cls: '' },
          { label: 'stack',  value: `${tags.length} technologies`, cls: 'text-term-amber' },
        ].map(({ label, value, cls }) => (
          <div key={label} className="bg-term-bg2 px-5 py-4">
            <div className="text-term-dim text-[10px] tracking-[1.5px] uppercase font-mono mb-1">{label}</div>
            <div className={`text-term-bright text-[13px] font-medium ${cls}`}>{value}</div>
          </div>
        ))}
      </div>

      {/* README.md */}
      <div className="mb-10">
        <SectionHeader cmd="cat README.md" />
        <div className="text-term-text text-[13px] leading-[1.9] font-light">
          <RichText data={project.fullDescription as unknown as DefaultTypedEditorState} />
        </div>
      </div>

      {/* Stack */}
      <div className="mb-10">
        <SectionHeader cmd="cat package.json | jq .dependencies" />
        <div className="flex flex-wrap gap-2">
          {tags.map((t, i) => (
            <div
              key={i}
              className="bg-term-bg2 border border-term-border px-4 py-2 text-[12px] text-term-text flex items-center gap-2"
            >
              <span className="text-term-amber">▸</span>
              {typeof t === 'string' ? t : t.title}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      {project.content && (
        <div className="mb-10">
          <SectionHeader cmd="cat NOTES.md" />
          <div className="text-term-text text-[13px] leading-[1.9]">
            <RichText data={project.content as unknown as DefaultTypedEditorState} />
          </div>
        </div>
      )}

      {/* File tree */}
      <div className="mb-10">
        <SectionHeader cmd="tree . --depth=2" />
        <div className="bg-term-bg2 border border-term-border border-l-[3px] border-l-term-border px-5 py-4 text-[12px] font-mono text-term-dim">
          <div className="text-term-amber mb-2">. ({project.slug ?? slug}/)</div>
          {[
            ['├──', 'src/',          'dir'],
            ['│   ├──', 'components/', 'file'],
            ['│   ├──', 'pages/',      'file'],
            ['│   └──', 'lib/',        'file'],
            ['├──', 'public/',       'dir'],
            ['├──', 'package.json',  'file'],
            ['└──', 'README.md',     'file'],
          ].map(([prefix, name, type], i) => (
            <div key={i} className={type === 'dir' ? 'text-term-blue' : 'text-term-dim'}>
              {prefix} {name}
            </div>
          ))}
        </div>
      </div>

      {/* Nav */}
      <div className="flex justify-between pt-10 border-t border-term-border gap-4">
        <Link
          href="/projects"
          className="px-4 py-2.5 text-[12px] font-mono text-term-muted border border-term-border hover:text-term-amber hover:border-term-amber hover:bg-term-amber/5 transition-colors duration-150 flex items-center gap-2"
        >
          ← all projects
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
  const project = await queryProject(slug, locale)
  return generateMeta({ doc: project })
}

const queryProject = cache(async (slug: string, locale: AvaibleLocale) => {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'projects',
    limit: 1,
    pagination: false,
    overrideAccess: false,
    depth: 2,
    where: { slug: { equals: slug } },
    locale,
  })
  return result.docs?.[0] ?? null
})
