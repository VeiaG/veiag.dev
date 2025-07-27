import type { GlobalAfterChangeHook } from 'payload'

import { revalidatePath } from 'next/cache'

export const revalidateBlog: GlobalAfterChangeHook = ({ doc, req: { context, i18n } }) => {
  if (!context.disableRevalidate) {
    const locale = i18n.language
    revalidatePath(`/${locale}/blog`)
  }
  return doc
}
