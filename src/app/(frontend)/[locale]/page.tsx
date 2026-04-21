import React from 'react'
import config from '@payload-config'
import { getPayload } from 'payload'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import NextLink from 'next/link'
import { getTranslations } from 'next-intl/server'

import { AvaibleLocale } from '@/i18n/routing'
import SectionHeader from '@/components/SectionHeader'
import TerminalTag, { skillVariant } from '@/components/TerminalTag'
import TerminalCursor from '@/components/TerminalCursor'
import TerminalPrompt from '@/components/TerminalPrompt'
import PostCard from '@/components/PostCard'
import ProjectCard from '@/components/ProjectCard'
import ExperienceCard from '@/components/ExperienceCard'
import RichText from '@/components/RichText'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

type Args = { params: Promise<{ locale: AvaibleLocale }> }

/* ─── Skill categorisation for the 3-col grid ───────────────────────────── */
const CATEGORY_LISTS: Record<string, string[]> = {
  Frontend: ['react', 'next.js', 'typescript', 'tailwind', 'tailwind css', 'css', 'html', 'vue', 'svelte'],
  Backend:  ['node.js', 'payloadcms', 'payload cms', 'postgresql', 'mysql', 'mongodb', 'rest', 'trpc', 'graphql', 'express', 'python'],
  Other:    ['design', 'figma', 'docker', 'git', 'linux', 'aws', 'vercel', 'c#'],
}

function categorise(skills: string[]): Record<string, string[]> {
  const result: Record<string, string[]> = { Frontend: [], Backend: [], Other: [] }
  const used = new Set<string>()

  skills.forEach(skill => {
    const s = skill.toLowerCase()
    let placed = false
    for (const [cat, list] of Object.entries(CATEGORY_LISTS)) {
      if (list.some(k => s.includes(k))) {
        result[cat].push(skill)
        used.add(skill)
        placed = true
        break
      }
    }
    if (!placed) result.Other.push(skill)
  })

  return result
}

export default async function HomePage({ params }: Args) {
  const { locale } = await params
  const payload    = await getPayload({ config })

  const homepage = await payload.findGlobal({
    slug: 'homepage',
    depth: 2,
    locale,
    populate: {
      projects: { title: true, slug: true, image: true, tags: true, shortDescription: true },
      posts:    { title: true, slug: true, image: true, categories: true, shortDescription: true, publishedAt: true },
    },
  })

  const t  = await getTranslations('HomePage')
  const gT = await getTranslations('Globals')

  const skillGroups = categorise(homepage.skills?.filter(Boolean) as string[] ?? [])

  return (
    <div className="max-w-[900px] mx-auto px-4 sm:px-8">

      {/* ══════════════════════════════ HERO ═══════════════════════════════ */}
      <section
        id="home"
        className="min-h-[calc(100vh-48px)] flex flex-col justify-center py-16"
      >
        {/* whoami command */}
        <div className="text-[13px] font-mono text-term-muted mb-1.5">
          <TerminalPrompt />
        </div>
        <div className="text-[13px] font-mono text-term-bright mb-6">
          whoami <TerminalCursor />
        </div>

        {/* Output box */}
        <div className="bg-term-bg2 border border-term-border border-l-[3px] border-l-term-amber p-6 animate-fade-in-up">
          {/* Avatar */}
          {typeof homepage.avatar !== 'string' && homepage.avatar?.url && (
            <div className="relative w-16 h-16 mb-5 border-2 border-term-amber shrink-0">
              <Image
                src={homepage.avatar.url}
                alt="Roman Palamar"
                fill
                className="object-cover grayscale-[20%]"
                placeholder={homepage.avatar.blurDataUrl ? 'blur' : 'empty'}
                blurDataURL={homepage.avatar.blurDataUrl ?? undefined}
              />
            </div>
          )}

          {/* Name */}
          <h1 className="text-[36px] sm:text-[44px] font-bold text-term-bright tracking-[-1.5px] leading-none mb-2">
            Roman <span className="text-term-amber">Palamar</span>
          </h1>
          <p className="text-term-muted text-[14px] mb-5">
            // Full-stack Developer · Kyiv, Ukraine
          </p>

          {/* Skills as tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {(homepage.skills ?? []).map((skill, i) => (
              <TerminalTag key={i} variant={skillVariant(String(skill))}>
                {String(skill)}
              </TerminalTag>
            ))}
          </div>

          {/* Action links */}
          <div className="flex flex-wrap gap-0">
            <Link
              href="mailto:roman@veiag.dev"
              className="px-4 py-2 text-[13px] font-mono text-term-amber border border-term-amber bg-term-amber/5 hover:bg-term-amber hover:text-black transition-colors duration-150"
            >
              ./contact
            </Link>
            <Link
              href="https://github.com/VeiaG"
              target="_blank"
              className="px-4 py-2 text-[13px] font-mono text-term-muted border border-term-border bg-transparent hover:bg-term-bg3 hover:text-term-text transition-colors duration-150 -ml-px"
            >
              ./github
            </Link>
            {homepage.cv && typeof homepage.cv !== 'string' && homepage.cv.url && (
              <NextLink
                href={homepage.cv.url}
                target="_blank"
                className="px-4 py-2 text-[13px] font-mono text-term-muted border border-term-border bg-transparent hover:bg-term-bg3 hover:text-term-text transition-colors duration-150 -ml-px"
              >
                ./cv
              </NextLink>
            )}
            <Link
              href="#projects"
              className="px-4 py-2 text-[13px] font-mono text-term-muted border border-term-border bg-transparent hover:bg-term-bg3 hover:text-term-text transition-colors duration-150 -ml-px"
            >
              ./projects
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ PROJECTS ══════════════════════════════ */}
      <section id="projects" className="mb-24 animate-fade-in-up">
        <SectionHeader cmd="ls -la ./projects" comment="featured work" />
        <p className="text-term-dim text-[11px] mb-4 font-mono tracking-wider">
          drwxr-xr-x&nbsp;&nbsp;{(homepage.selectedProjects?.length ?? 0)} projects/
        </p>

        <div className="flex flex-col gap-px bg-term-border border border-term-border">
          {homepage.selectedProjects?.map((project, i) => {
            if (!project || typeof project === 'string') return null
            return (
              <ProjectCard
                key={i}
                title={project.title}
                description={project.shortDescription}
                tags={project.tags}
                image={project.image}
                slug={project.slug ?? ''}
                index={i}
                variant={i === 0 ? 'featured' : 'grid'}
              />
            )
          })}
        </div>

        <div className="mt-4 flex justify-end">
          <Link
            href="/projects"
            className="px-4 py-2 text-[12px] font-mono text-term-muted border border-term-border hover:text-term-amber hover:border-term-amber hover:bg-term-amber/5 transition-colors duration-150 flex items-center gap-2"
          >
            {t('viewAllProjects')} ↗
          </Link>
        </div>
      </section>

      {/* ════════════════════════════ BLOG ═════════════════════════════════ */}
      <section id="blog" className="mb-24 animate-fade-in-up">
        <SectionHeader cmd="ls ./blog --sort=date" comment="writing" />
        <p className="text-term-dim text-[11px] mb-4 font-mono tracking-wider">
          -rw-r--r--&nbsp;&nbsp;{(homepage.selectedPosts?.length ?? 0)} post(s) found
        </p>

        <div className="border border-term-border">
          {homepage.selectedPosts?.map((post, i) => {
            if (!post || typeof post === 'string') return null
            return (
              <PostCard
                key={i}
                title={post.title}
                description={post.shortDescription}
                categories={post.categories}
                image={post.image}
                slug={post.slug ?? ''}
                publishedAt={post.publishedAt}
                index={i}
              />
            )
          })}

          {/* Coming soon row */}
          <div className="px-6 py-4 text-term-dim text-[12px] font-mono flex items-center gap-2 border-t border-term-border">
            <span className="text-term-amber">$</span>
            more posts coming soon...
            <TerminalCursor className="ml-1" />
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <Link
            href="/blog"
            className="px-4 py-2 text-[12px] font-mono text-term-muted border border-term-border hover:text-term-amber hover:border-term-amber hover:bg-term-amber/5 transition-colors duration-150 flex items-center gap-2"
          >
            {t('viewAllPosts')} ↗
          </Link>
        </div>
      </section>

      {/* ══════════════════════════ EXPERIENCE ═════════════════════════════ */}
      <section id="about" className="mb-24 animate-fade-in-up">
        <SectionHeader cmd="cat experience.json" comment="work history" />
        <div className="flex flex-col">
          {homepage.workExperience?.map((job, i) => {
            if (!job) return null
            return (
              <ExperienceCard
                key={i}
                company={job.company ?? ''}
                position={job.position ?? ''}
                startDate={job.startDate ?? ''}
                endDate={job.endDate}
                description={job.description as unknown as DefaultTypedEditorState}
                location={job.location}
                isPresent={!!job.isPresent}
              />
            )
          })}
        </div>
      </section>

      {/* ══════════════════════════ SKILLS ═════════════════════════════════ */}
      <section className="mb-24 animate-fade-in-up">
        <SectionHeader cmd="cat skills.txt" comment="tech" />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-term-border border border-term-border mb-6">
          {Object.entries(skillGroups).map(([cat, items]) => (
            items.length > 0 && (
              <div key={cat} className="bg-term-bg p-5">
                <div className="text-[10px] font-mono text-term-dim tracking-[1.5px] uppercase mb-3">{cat}</div>
                <div className="flex flex-col gap-1">
                  {items.map(skill => (
                    <div key={skill} className="text-[12px] text-term-text flex items-center gap-2">
                      <span className="text-term-dim">─</span>
                      {skill}
                    </div>
                  ))}
                </div>
              </div>
            )
          ))}
        </div>

        {/* About bio */}
        {homepage.about && (
          <div className="bg-term-bg2 border border-term-border border-l-[3px] border-l-term-blue px-6 py-5 text-term-muted text-[13px] leading-[1.8]">
            <span className="text-term-dim">/*</span>
            <br />
            <RichText data={homepage.about as unknown as DefaultTypedEditorState} enableGutter={false} />
            <br />
            <span className="text-term-dim">*/</span>
          </div>
        )}
      </section>

    </div>
  )
}
