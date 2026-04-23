import { getPayload } from 'payload'
import config from '@payload-config'
import ProjectCard from '@/components/ProjectCard'
import TagsFilter from '@/components/TagsFilter'
import type { Where } from 'payload'
import { AvaibleLocale } from '@/i18n/routing'
import { getTranslations } from 'next-intl/server'
import ProjectViewToggle from '@/components/ProjectViewToggle'
import { Suspense } from 'react'

export const metadata = {
  title: 'Projects — veiag.dev',
  description: 'Open-source and client web development projects.',
}

type Props = {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
  params: Promise<{ locale: AvaibleLocale }>
}

export default async function ProjectsPage({ searchParams, params }: Props) {
  const sp     = await searchParams
  const { locale } = await params
  const view   = sp?.view === 'list' ? 'list' : 'grid'

  const query: Where =
    sp?.tags && sp.tags.length > 0
      ? { and: [{ 'tags.title': { in: sp.tags } }] }
      : {}

  const payload  = await getPayload({ config })
  const projects = await payload.find({
    collection: 'projects',
    depth: 1,
    limit: 0,
    sort: '_order',
    overrideAccess: false,
    select: { title: true, slug: true, tags: true, shortDescription: true, image: true },
    populate: { 'project-tags': { title: true } },
    where: query,
    locale,
  })

  const tags = await payload.find({
    collection: 'project-tags',
    depth: 1,
    limit: 0,
    pagination: false,
    select: { title: true },
  })

  const t = await getTranslations('ProjectsPage')

  return (
    <div className="max-w-[1000px] mx-auto px-4 sm:px-8">

      {/* Page header */}
      <div className="pb-10 pt-12 border-b border-term-border mb-0">
        <div className="text-muted text-[12px] font-mono mb-2">
          <span className="text-term-blue">roman</span>
          <span className="text-term-dim">@</span>
          <span className="text-term-amber">veiag.dev</span>
          <span className="text-term-dim">:~ $</span>
        </div>
        <div className="text-term-bright text-[13px] font-mono mb-6">
          ls -la ./projects --all
        </div>
        <h1 className="text-[30px] font-bold text-term-bright tracking-tight mb-2">
          All <span className="text-term-amber">Projects</span>
        </h1>
        <p className="text-term-muted text-[12px]">
          {projects.totalDocs} projects · open-source and client work
        </p>
      </div>

      {/* Toolbar: filter + view toggle */}
      <div className="flex items-stretch border-b border-term-border bg-term-bg2">
        <div className="flex-1 min-w-0">
          <TagsFilter
            tags={tags.docs}
            initialTags={
              sp?.tags
                ? Array.isArray(sp.tags) ? sp.tags : [sp.tags]
                : []
            }
            translations={{ filters: t('filters') }}
          />
        </div>
        <Suspense fallback={null}>
          <ProjectViewToggle currentView={view} count={projects.totalDocs} />
        </Suspense>
      </div>

      {/* Grid view */}
      {view === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-term-border border border-term-border mt-0 animate-fade-in-up">
          {projects.docs.map((p, i) => (
            <ProjectCard
              key={p.id}
              title={p.title}
              description={p.shortDescription}
              tags={p.tags}
              image={p.image}
              slug={p.slug ?? ''}
              index={i}
              variant="grid"
            />
          ))}
        </div>
      )}

      {/* List view */}
      {view === 'list' && (
        <div className="border border-term-border animate-fade-in-up">
          {projects.docs.map((p, i) => (
            <ProjectCard
              key={p.id}
              title={p.title}
              description={p.shortDescription}
              tags={p.tags}
              image={p.image}
              slug={p.slug ?? ''}
              index={i}
              variant="list"
            />
          ))}
        </div>
      )}
    </div>
  )
}
