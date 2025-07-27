import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'
import { Page } from '@/payload-types'

export const revalidatePage: CollectionAfterChangeHook<Page> = ({
  doc,
  previousDoc,
  req: { payload, context, i18n },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const locale = i18n.language
      const path = `/${locale}/${doc.slug}`

      payload.logger.info(`Revalidating Page at path: ${path}`)

      revalidatePath(path)
      revalidateTag('blog-sitemap')
    }

    // If the post was previously published, we need to revalidate the old path
    if (previousDoc._status === 'published' && doc._status !== 'published') {
      const locale = i18n.language
      const oldPath = `/${locale}/${previousDoc.slug}`

      payload.logger.info(`Revalidating old Page at path: ${oldPath} `)

      revalidatePath(oldPath)
    }
  }
  return doc
}

export const revalidateDeletePage: CollectionAfterDeleteHook<Page> = ({
  doc,
  req: { context, i18n },
}) => {
  if (!context.disableRevalidate) {
    const locale = i18n.language
    const path = `/${locale}/${doc?.slug}`

    revalidatePath(path)
  }

  return doc
}
