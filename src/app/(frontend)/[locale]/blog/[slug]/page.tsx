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
    collection: 'posts',
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

const PostPage = async ({ params }: Args) => {
  const { slug = '' } = await params
  const post = await queryPostBySlug({ slug })
  const avatar = await getAvatar()
  if (!post) return notFound()
  return (
    <div className="py-4 md:py-8 container mx-auto max-w-[900px] text-lg relative">
      <Link
        href="/blog"
        className=" flex gap-1 items-center z-10 hover:text-yellow-500 transition-colors mb-6"
      >
        <ArrowLeft />
        <span>Back to blog</span>
      </Link>
      <div className="flex flex-col gap-4 justify-center col-span-2 mb-12">
        <h1 className="text-3xl md:text-5xl font-bold">{post.title}</h1>
        <div className="flex gap-4 items-center mb-2">
          <div className="aspect-square relative overflow-hidden rounded-full w-[48px] h-[48px]">
            {avatar && (
              <Image
                src={avatar.url || ''}
                alt="Avatar"
                width={48}
                height={48}
                placeholder="blur"
                blurDataURL={avatar.blurDataUrl || ''}
                className="object-cover rounded-full"
              />
            )}
          </div>
          <div className="flex flex-col">
            <h2 className="font-bold ">veiag.dev</h2>
            <div className="text-zinc-50/80 text-sm flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(post.publishedAt).toDateString()}
            </div>
          </div>
        </div>
        <Image
          src={(typeof post.image === 'string' ? post.image : post.image.url) || ''}
          alt={post.title}
          sizes="100vw"
          className="object-cover h-auto w-full aspect-video rounded-lg"
          style={{ width: '100%', height: 'auto' }}
          width={0}
          height={0}
          placeholder="blur"
          blurDataURL={
            typeof post.image === 'string' ? undefined : (post.image.blurDataUrl ?? undefined)
          }
        />
        <div className="flex gap-2 w-full flex-wrap">
          {post.categories?.map((category, index) => (
            <span key={index} className="bg-zinc-800 text-zinc-100 px-2 py-1 rounded-md text-sm">
              {typeof category === 'string' ? category : category.title}
            </span>
          ))}
        </div>
      </div>

      <RichText data={post.content} />
      <SharePost />
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

const getAvatar = cache(async () => {
  const payload = await getPayload({ config: config })
  const homepage = await payload.findGlobal({
    slug: 'homepage',
    depth: 2,
    select: {
      avatar: true,
    },
  })
  if (homepage.avatar && typeof homepage.avatar !== 'string') {
    return homepage.avatar
  }
  return null
})
export default PostPage
