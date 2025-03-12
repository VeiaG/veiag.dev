import NoiseOverlay from '@/components/NoiseOverlay'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Media, PostCategory } from '@/payload-types'
import Image from 'next/image'

type BlogCardProps = {
  title: string
  description: string
  categories: (string | PostCategory)[] | null | undefined
  image: string | Media
  slug: string
}

const BlogCard = ({ title, description, categories, image, slug }: BlogCardProps) => {
  return (
    <Link className="relative flex flex-col gap-2" href={`/blog/${slug}`}>
      <div className="relative h-[256px] aspect-video w-auto overflow-hidden rounded-md">
        <Image
          src={(typeof image === 'string' ? image : image.url) || ''}
          alt={(image as Media)?.alt || title}
          fill
          className="object-cover "
          placeholder="blur"
          blurDataURL={typeof image === 'string' ? undefined : (image.blurDataUrl ?? undefined)}
        />
      </div>
      <div className="flex flex-col px-2">
        {/* <NoiseOverlay className="z-0" /> */}
        <div className="flex gap-2 w-full flex-wrap my-1">
          {categories?.map((category, index) => (
            <span key={index} className="bg-zinc-800 text-zinc-100 px-2 py-1 rounded-md text-xs">
              {typeof category === 'string' ? category : category.title}
            </span>
          ))}
        </div>
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-lg font-light ">{description}</p>
      </div>
    </Link>
  )
}
const BlogPage = async () => {
  const payload = await getPayload({ config: config })
  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 12,
    overrideAccess: false,
    select: {
      title: true,
      slug: true,
      shortDescription: true,
      image: true,
      categories: true,
    },
    populate: {
      'post-categories': {
        title: true,
      },
    },
  })

  const categories = await payload.find({
    collection: 'post-categories',
    depth: 1,
    overrideAccess: false,
    select: {
      title: true,
    },
  })
  return (
    <div className="container mx-auto">
      <div className="flex gap-2 items-center">
        <span>Categories:</span>
        {categories.docs.map((category, index) => (
          <button key={index} className="bg-zinc-800 text-zinc-100 px-2 py-1 rounded-md">
            {category.title}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-4 gap-6 py-6">
        {posts.docs.map((post, index) => (
          <BlogCard
            key={index}
            title={post.title}
            description={post.shortDescription}
            categories={post.categories}
            image={post.image}
            slug={post?.slug || ''}
          />
        ))}
      </div>
    </div>
  )
}

export default BlogPage
