import React, { cache } from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Metadata } from 'next'
import { generateMeta } from '@/lib/generateMeta'
import { notFound } from 'next/navigation'
//TODO : update lexical from canary to stable release , when they fix image issue
import Image from 'next/image'
import RichText from '@/components/RichText'
import { ArrowLeft, Calendar } from 'lucide-react'
import Link from 'next/link'
import SharePost from '@/components/SharePost'

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
  }>
}

const CMSPage = async ({ params }: Args) => {
  const { slug = '' } = await params
  const post = await queryPageBySlug({ slug })
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
  const { slug = '' } = await paramsPromise
  const post = await queryPageBySlug({ slug })

  return generateMeta({ doc: post })
}
const queryPageBySlug = cache(async ({ slug }: { slug: string }) => {
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
  })

  return result.docs?.[0] || null
})

export default CMSPage
