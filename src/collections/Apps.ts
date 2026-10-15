import type { CollectionConfig } from 'payload'
import { revalidateApps, revalidateDeleteApp } from './hooks/revalidateApps'

export const Apps: CollectionConfig = {
  slug: 'apps',
  labels: {
    singular: {
      en: 'App',
      uk: 'Застосунок',
    },
    plural: {
      en: 'Apps',
      uk: 'Застосунки',
    },
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'url', 'madeWithAI', '_status'],
    group: {
      en: 'Projects',
      uk: 'Проекти',
    },
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
      name: 'description',
      label: {
        en: 'Description',
        uk: 'Опис',
      },
      type: 'textarea',
      required: true,
      localized: true,
      admin: {
        description: {
          en: 'What it does and how to use it — shown on the card',
          uk: 'Що робить і як користуватись — показується на картці',
        },
      },
    },
    {
      name: 'url',
      label: {
        en: 'App URL',
        uk: 'Посилання на застосунок',
      },
      type: 'text',
      required: true,
    },
    {
      name: 'image',
      label: {
        en: 'Image',
        uk: 'Зображення',
      },
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'tags',
      label: {
        en: 'Tags',
        uk: 'Теги',
      },
      type: 'relationship',
      relationTo: 'project-tags',
      hasMany: true,
    },
    {
      name: 'madeWithAI',
      label: {
        en: 'Made with AI',
        uk: 'Зроблено з AI',
      },
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: {
          en: 'Shows a "made with AI" badge on the card',
          uk: 'Показує бейдж "made with AI" на картці',
        },
      },
    },
    {
      name: 'githubLink',
      label: {
        en: 'Github Link',
        uk: 'Посилання на Github',
      },
      type: 'text',
      admin: {
        position: 'sidebar',
      },
    },
  ],
  hooks: {
    afterChange: [revalidateApps],
    afterDelete: [revalidateDeleteApp],
  },
  versions: {
    maxPerDoc: 5,
    drafts: true,
  },
}
