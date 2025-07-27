import React, { cache } from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Metadata } from 'next'
import { generateMeta } from '@/lib/generateMeta'
import { notFound } from 'next/navigation'

import RichText from '@/components/RichText'
import { AvaibleLocale } from '@/i18n/routing'

export async function generateStaticParams() {
  const payload = await getPayload({ config: config })
  const posts = await payload.find({
    collection: 'pages',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const params = posts.docs.map(({ slug }) => {
    return { slug }
  })

  return params
}
type Args = {
  params: Promise<{
    slug?: string
    locale?: AvaibleLocale
  }>
}

const CMSPage = async ({ params }: Args) => {
  const { slug = '', locale = 'en' } = await params
  const post = await queryPageBySlug({ slug, locale })
  if (!post) return notFound()
  return (
    <div className="py-4 md:py-8 container mx-auto max-w-[900px] text-lg relative">
      <div className="flex flex-col gap-4 justify-center col-span-2 mb-12">
        <h1 className="text-3xl md:text-5xl font-bold">{post.title}</h1>
      </div>

      <RichText data={post.content} />
    </div>
  )
}
export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '', locale = 'en' } = await paramsPromise
  const post = await queryPageBySlug({ slug, locale })

  return generateMeta({ doc: post })
}
const queryPageBySlug = cache(async ({ slug, locale }: { slug: string; locale: AvaibleLocale }) => {
  const payload = await getPayload({ config: config })

  const result = await payload.find({
    collection: 'pages',
    limit: 1,
    pagination: false,
    overrideAccess: false,
    depth: 2,
    where: {
      slug: {
        equals: slug,
      },
    },
    locale: locale,
  })

  return result.docs?.[0] || null
})

export default CMSPage
