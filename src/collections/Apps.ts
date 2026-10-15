import { slugField } from '@/fields/slug'
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
    defaultColumns: ['title', 'githubLink', 'madeWithAI', '_status'],
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
      type: 'tabs',
      tabs: [
        {
          label: { en: 'Overview', uk: 'Загальне' },
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
                  en: 'Short summary — shown on the card and under the title',
                  uk: 'Короткий опис — показується на картці та під заголовком',
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
              required: true,
            },
            {
              name: 'url',
              label: {
                en: 'Live URL',
                uk: 'Посилання на сайт',
              },
              type: 'text',
              admin: {
                description: {
                  en: 'Only for web apps — adds a "launch" button',
                  uk: 'Тільки для веб-апок — додає кнопку "launch"',
                },
              },
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
          ],
        },
        {
          label: { en: 'Content', uk: 'Контент' },
          fields: [
            {
              name: 'content',
              label: {
                en: 'Content',
                uk: 'Контент',
              },
              type: 'richText',
              localized: true,
              admin: {
                description: {
                  en: 'Shown on the app page: features, how to install and use',
                  uk: 'Показується на сторінці апки: можливості, як встановити й користуватись',
                },
              },
            },
          ],
        },
      ],
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
    ...slugField(),
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
