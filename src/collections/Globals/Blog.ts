import { GlobalConfig } from 'payload'
import { revalidateBlog } from '../hooks/revalidateBlog'

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
      localized: true,
    },
  ],
  hooks: {
    afterChange: [revalidateBlog],
  },
}
