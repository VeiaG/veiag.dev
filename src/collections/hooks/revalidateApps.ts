import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from 'payload'

import { revalidatePath } from 'next/cache'
import { App } from '@/payload-types'

// Non-localized fields (links, flags) affect every locale, so revalidate the route patterns
const revalidateAppsPage = () => {
  revalidatePath('/[locale]/apps', 'page')
  revalidatePath('/[locale]/apps/[slug]', 'page')
}

export const revalidateApps: CollectionAfterChangeHook<App> = ({ doc, previousDoc, req: { payload, context } }) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published' || previousDoc?._status === 'published') {
      payload.logger.info('Revalidating apps pages')
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

export const revalidateAppsPageGlobal: GlobalAfterChangeHook = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    revalidateAppsPage()
  }
  return doc
}
