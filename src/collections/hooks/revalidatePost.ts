import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'
import { Post } from '@/payload-types'

export const revalidatePost: CollectionAfterChangeHook<Post> = ({
  doc,
  previousDoc,
  req: { payload, context, i18n },
}) => {
  if (!context.disableRevalidate) {
    const locale = i18n.language
    if (doc._status === 'published') {
      const path = `/${locale}/blog/${doc.slug}`

      payload.logger.info(`Revalidating post at path: ${path}`)

      revalidatePath(path)
      revalidateTag('blog-sitemap')
    }

    // If the post was previously published, we need to revalidate the old path
    if (previousDoc._status === 'published' && doc._status !== 'published') {
      const oldPath = `/${locale}/blog/${previousDoc.slug}`

      payload.logger.info(`Revalidating old post at path: ${oldPath}`)

      revalidatePath(oldPath)
      revalidateTag('blog-sitemap')
    }
  }
  return doc
}

export const revalidateDeletePost: CollectionAfterDeleteHook<Post> = ({
  doc,
  req: { context, i18n },
}) => {
  if (!context.disableRevalidate) {
    const locale = i18n.language
    const path = `/${locale}/blog/${doc?.slug}`

    revalidatePath(path)
    revalidateTag('blog-sitemap')
  }

  return doc
}
