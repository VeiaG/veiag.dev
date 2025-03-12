import React, { cache } from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Metadata } from 'next'
import { generateMeta } from '@/lib/generateMeta'
import { notFound } from 'next/navigation'
//TODO : update lexical from canary to stable release , when they fix image issue
import Image from 'next/image'
import RichText from '@/components/RichText'
import NoiseOverlay from '@/components/NoiseOverlay'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

type Args = {
  params: Promise<{
    slug?: string
  }>
}

const PostPage = async ({ params }: Args) => {
  const { slug = '' } = await params
  const post = await queryPostBySlug({ slug })
  if (!post) return notFound()
  return (
    <div>
      <div className="relative min-h-[512px] flex flex-col">
        <Image
          src={(typeof post.image === 'string' ? post.image : post.image.url) || ''}
          alt={post.title}
          fill
          className="object-cover absolute select-none z-0 brightness-50"
          placeholder="blur"
          blurDataURL={
            typeof post.image === 'string' ? undefined : (post.image.blurDataUrl ?? undefined)
          }
        />
        <NoiseOverlay className="z-10 opacity-70 mix-blend-multiply" />
        <div className="grid gap-4 grid-cols-3 py-32 container mx-auto z-10 relative min-h-[inherit] max-w-[1280px] ">
          <Link
            href="/blog"
            className="left-0 top-8 absolute flex gap-1 items-center z-10 hover:text-red-500 transition-colors "
          >
            <ArrowLeft />
            <span>Back</span>
          </Link>
          <div className="flex flex-col gap-2 justify-center col-span-2">
            <h1 className="text-7xl font-bold">{post.title}</h1>
            <p className="text-2xl font-light">{post.shortDescription}</p>
            <div className="flex gap-2 w-full flex-wrap">
              {post.categories?.map((category, index) => (
                <span
                  key={index}
                  className="bg-zinc-950 text-zinc-100 px-2 py-1 rounded-md text-xs"
                >
                  {typeof category === 'string' ? category : category.title}
                </span>
              ))}
            </div>
          </div>
          {/* <div className="relative w-full h-full">
            <Image
              src={(typeof post.image === 'string' ? post.image : post.image.url) || ''}
              alt={post.title}
              fill
              className="object-cover rounded-lg w-full h-full"
               placeholder="blur"
          blurDataURL={
            typeof post.image === 'string' ? undefined : (post.image.blurDataUrl ?? undefined)
          }
            />
          </div> */}
        </div>
      </div>

      <div className="py-6 mt-8 container mx-auto max-w-[1280px] text-lg">
        <RichText data={post.content} className="space-y-2" />
      </div>
    </div>
  )
}
export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const post = await queryPostBySlug({ slug })

  return generateMeta({ doc: post })
}
const queryPostBySlug = cache(async ({ slug }: { slug: string }) => {
  const payload = await getPayload({ config: config })

  const result = await payload.find({
    collection: 'posts',
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
export default PostPage
