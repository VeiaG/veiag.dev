import React, { cache } from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Metadata } from 'next'
import { generateMeta } from '@/lib/generateMeta'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import RichText from '@/components/RichText'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import TerminalFileHeader from '@/components/TerminalFileHeader'
import TerminalBreadcrumb from '@/components/TerminalBreadcrumb'
import TerminalTag from '@/components/TerminalTag'
import SharePost from '@/components/SharePost'
import { Link } from '@/i18n/navigation'
import { AvaibleLocale } from '@/i18n/routing'
import { getTranslations } from 'next-intl/server'

export async function generateStaticParams() {
  const payload = await getPayload({ config })
  const posts = await payload.find({
    collection: 'posts',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: { slug: true },
    locale: 'all',
  })
  return posts.docs.flatMap(doc =>
    Object.entries(doc.slug || {}).map(([locale, slug]) => ({ locale, slug })),
  )
}

type Args = { params: Promise<{ slug?: string; locale?: AvaibleLocale }> }

export default async function PostPage({ params }: Args) {
  const { slug = '', locale = 'en' } = await params
  const post   = await queryPost(slug, locale)
  const avatar = await getAvatar()
  if (!post) notFound()

  const t = await getTranslations('Globals')

  const dateStr = new Date(post.publishedAt).toISOString().slice(0, 10)

  return (
    <div className="max-w-[900px] mx-auto px-4 sm:px-8 pb-16 animate-fade-in-up">
      {/* Breadcrumb */}
      <TerminalBreadcrumb
        segments={[
          { label: '~',    href: '/' },
          { label: 'blog', href: '/blog' },
          { label: post.slug ?? slug },
        ]}
      />

      {/* Terminal file header */}
      <TerminalFileHeader
        filePath={`blog/${post.slug ?? slug}.md`}
        cmd={`cat blog/${post.slug ?? slug}.md`}
        frontmatter={[
          { key: 'title',   value: post.title },
          { key: 'date',    value: dateStr },
          { key: 'tags',    value: `[${(post.categories ?? []).map(c => typeof c === 'string' ? c : c.title).join(', ')}]` },
        ]}
      />

      {/* Hero image */}
      {post.image && (
        <div className="relative w-full aspect-video mb-10 border border-term-border overflow-hidden">
          <Image
            src={(typeof post.image === 'string' ? post.image : post.image.url) ?? ''}
            alt={post.title}
            fill
            className="object-cover grayscale-[20%] brightness-90"
            placeholder="blur"
            blurDataURL={typeof post.image === 'object' ? (post.image.blurDataUrl ?? undefined) : undefined}
          />
        </div>
      )}

      {/* Post meta */}
      <div className="flex flex-wrap items-center gap-3 mb-4 text-[12px] font-mono">
        <span className="text-term-dim">{dateStr}</span>
        {(post.categories ?? []).map((c, i) => (
          <TerminalTag key={i} variant="amber">
            {typeof c === 'string' ? c : c.title}
          </TerminalTag>
        ))}
      </div>

      {/* Title */}
      <h1 className="text-[28px] sm:text-[34px] font-bold text-term-bright tracking-[-1px] leading-tight mb-8">
        {post.title}
      </h1>

      <hr className="border-term-border mb-10" />

      {/* Content */}
      <div className="post-content text-term-text text-[14px] leading-[1.9] font-light">
        <RichText data={post.content as unknown as DefaultTypedEditorState} />
      </div>

      <SharePost translation={{ shareThis: t('shareThisArticle') }} />

      {/* Nav */}
      <div className="flex justify-between pt-10 mt-16 border-t border-term-border gap-4">
        <Link
          href="/blog"
          className="px-4 py-2.5 text-[12px] font-mono text-term-muted border border-term-border hover:text-term-amber hover:border-term-amber hover:bg-term-amber/5 transition-colors duration-150 flex items-center gap-2"
        >
          ← back to blog
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
  const post = await queryPost(slug, locale)
  return generateMeta({ doc: post })
}

const queryPost = cache(async (slug: string, locale: AvaibleLocale) => {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'posts',
    limit: 1,
    pagination: false,
    overrideAccess: false,
    depth: 2,
    where: { slug: { equals: slug } },
    locale,
  })
  return result.docs?.[0] ?? null
})

const getAvatar = cache(async () => {
  const payload  = await getPayload({ config })
  const homepage = await payload.findGlobal({ slug: 'homepage', depth: 2, select: { avatar: true } })
  return typeof homepage.avatar !== 'string' ? homepage.avatar : null
})
