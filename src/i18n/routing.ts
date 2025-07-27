import { defineRouting } from 'next-intl/routing'

export type AvaibleLocale = 'en' | 'uk'

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'uk'],

  // Used when no locale matches
  defaultLocale: 'en',
})
