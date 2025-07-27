import { getPayload } from 'payload'
import config from '@payload-config'
import BlogCard from '@/components/PostCard'
import CollectionPagination from '@/components/CollectionPagination'
import RichText from '@/components/RichText'
import NoiseOverlay from '@/components/NoiseOverlay'
import { AvaibleLocale } from '@/i18n/routing'
import { getTranslations } from 'next-intl/server'

export const metadata = {
  description:
    'Welcome to my blog! I share insights on web development, coding tips, and my experiences with modern technologies. Dive in and explore my latest thoughts and discoveries!',
  title: 'veiag.dev - Blog',
}
type BlogPageProps = {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
  params: Promise<{ locale: AvaibleLocale }>
}
const BlogPage = async ({ searchParams, params }: BlogPageProps) => {
  const searchParameters = await searchParams
  const page = searchParameters?.page ? Number(searchParameters.page) : 1
  const { locale } = await params

  const payload = await getPayload({ config: config })
  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 8,
    sort: '_order',
    page: page,
    overrideAccess: false,
    select: {
      title: true,
      slug: true,
      shortDescription: true,
      image: true,
      categories: true,
      publishedAt: true,
    },
    populate: {
      'post-categories': {
        title: true,
      },
    },
    locale: locale,
  })
  const blog = await payload.findGlobal({
    slug: 'blog',
    depth: 2,
    populate: {
      posts: {
        title: true,
        slug: true,
        image: true,
        categories: true,
        shortDescription: true,
        publishedAt: true,
      },
    },
    locale: locale,
  })
  const t = await getTranslations('Globals')
  return (
    <>
      <section className="py-24 relative">
        <NoiseOverlay className="opacity-70" />
        <div className="bg-gradient-to-bl from-zinc-950 to-zinc-800/50 blur-2xl w-full h-full -z-10 absolute top-0 left-0" />
        <div className="container mx-auto relative">
          <div className="w-full lg:w-1/2">
            {blog.hero && (
              <RichText data={blog.hero} className=" [&_h1]:text-5xl text-xl space-y-2 " />
            )}
          </div>
        </div>
      </section>
      <section className="container mx-auto pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 py-6">
          {posts.docs.map((post, index) => (
            <BlogCard
              key={index}
              title={post.title}
              description={post.shortDescription}
              categories={post.categories}
              image={post.image}
              slug={post?.slug || ''}
              publishedAt={post.publishedAt}
              translation={{
                readMore: t('readMore'),
              }}
            />
          ))}
        </div>
        {posts.totalPages > 1 && <CollectionPagination totalPages={posts.totalPages} />}
      </section>
    </>
  )
}

export default BlogPage
