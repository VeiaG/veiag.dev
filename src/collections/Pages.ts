import { slugField } from '@/fields/slug'
import type { CollectionConfig } from 'payload'
import { revalidateDeletePage, revalidatePage } from './hooks/revalidatePage'

export const Page: CollectionConfig = {
  slug: 'pages',
  labels: {
    singular: {
      en: 'Page',
      uk: 'Сторінка',
    },
    plural: {
      en: 'Pages',
      uk: 'Сторінки',
    },
  },
  admin: {
    useAsTitle: 'title',
  },
  orderable: true,
  access: {
    read: ({ req }) => {
      if (req.user) {
        return true
      }
      return {
        or: [
          {
            _status: {
              equals: 'published',
            },
          },
          {
            _status: {
              exists: false,
            },
          },
        ],
      }
    },
  },
  fields: [
    {
      name: 'title',
      label: {
        en: 'Title',
        uk: 'Назва',
      },
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'content',
      label: {
        en: 'Content',
        uk: 'Контент',
      },
      type: 'richText',
      required: true,
      localized: true,
    },
    ...slugField(),
  ],
  hooks: {
    afterChange: [revalidatePage],
    afterDelete: [revalidateDeletePage],
  },
  versions: {
    maxPerDoc: 5,
    drafts: true,
  },
}
