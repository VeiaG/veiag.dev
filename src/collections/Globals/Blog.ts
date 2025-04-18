import { GlobalConfig } from 'payload'
import { revalidateBlog } from '../hooks/revalidateBlog'

//TODO add after change hook, to revalidate homepage cache
export const Blog: GlobalConfig = {
  slug: 'blog',
  admin: {
    group: {
      en: 'Blog',
      uk: 'Блог',
    },
  },
  label: {
    en: 'Blog',
    uk: 'Блог',
  },
  fields: [
    {
      name: 'hero',
      type: 'richText',
      label: {
        en: 'Hero',
        uk: 'Головний блок',
      },
    },
  ],
  hooks: {
    afterChange: [revalidateBlog],
  },
}
