import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath } from 'next/cache'
import { App } from '@/payload-types'

// Apps are listed on a single page; non-localized fields (url, flags) affect every locale
const revalidateAppsPage = () => revalidatePath('/[locale]/apps', 'page')

export const revalidateApps: CollectionAfterChangeHook<App> = ({ doc, previousDoc, req: { payload, context } }) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published' || previousDoc?._status === 'published') {
      payload.logger.info('Revalidating apps page')
      revalidateAppsPage()
    }
  }
  return doc
}

export const revalidateDeleteApp: CollectionAfterDeleteHook<App> = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    revalidateAppsPage()
  }
  return doc
}
