import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'
import { Post, Project } from '@/payload-types'

export const revalidateProject: CollectionAfterChangeHook<Project> = ({
  doc,
  previousDoc,
  req: { payload, context, i18n },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const locale = i18n.language
      const path = `/${locale}/projects/${doc.slug}`

      payload.logger.info(`Revalidating post at path: ${path}`)

      revalidatePath(path)
      revalidateTag('projects-sitemap')
    }

    // If the post was previously published, we need to revalidate the old path
    if (previousDoc._status === 'published' && doc._status !== 'published') {
      const locale = i18n.language
      const oldPath = `/${locale}/projects/${previousDoc.slug}`

      payload.logger.info(`Revalidating old post at path: ${oldPath}`)

      revalidatePath(oldPath)
      revalidateTag('projects-sitemap')
    }
  }
  return doc
}

export const revalidateDeleteProject: CollectionAfterDeleteHook<Post> = ({
  doc,
  req: { context, i18n },
}) => {
  if (!context.disableRevalidate) {
    const locale = i18n.language
    const path = `/${locale}/projects/${doc?.slug}`

    revalidatePath(path)
    revalidateTag('projects-sitemap')
  }

  return doc
}
