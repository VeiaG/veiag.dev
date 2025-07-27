import { getServerSideSitemap } from 'next-sitemap'
import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'

const SUPPORTED_LOCALES = ['en', 'uk']

const getPostsSitemap = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const SITE_URL =
      process.env.NEXT_PUBLIC_SERVER_URL ||
      process.env.VERCEL_PROJECT_PRODUCTION_URL ||
      'https://example.com'

    const results = await payload.find({
      collection: 'posts',
      overrideAccess: false,
      draft: false,
      depth: 0,
      limit: 1000,
      pagination: false,
      where: {
        _status: {
          equals: 'published',
        },
      },
      select: {
        slug: true,
        updatedAt: true,
      },
      locale: 'all',
    })

    const dateFallback = new Date().toISOString()

    const sitemapEntries =
      results.docs?.flatMap((post) => {
        return SUPPORTED_LOCALES.flatMap((locale) => {
          //@ts-expect-error : post.slug is an object with locale keys
          const slug = post.slug?.[locale]
          if (!slug) return []

          return {
            loc: `${SITE_URL}/${locale}/blog/${slug}`,
            lastmod: post.updatedAt || dateFallback,
          }
        })
      }) ?? []

    return sitemapEntries
  },
  ['posts-sitemap'],
  {
    tags: ['posts-sitemap'],
  },
)

export async function GET() {
  const sitemap = await getPostsSitemap()

  return getServerSideSitemap(sitemap)
}
