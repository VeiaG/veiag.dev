import type { GlobalAfterChangeHook } from 'payload'

import { revalidatePath } from 'next/cache'

export const revalidateHome: GlobalAfterChangeHook = ({ doc, req: { context, i18n } }) => {
  if (!context.disableRevalidate) {
    const locale = i18n.language
    revalidatePath(`/${locale}`)
  }
  return doc
}
