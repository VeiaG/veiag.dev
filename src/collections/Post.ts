import { slugField } from '@/fields/slug'
import type { CollectionConfig } from 'payload'

export const Post: CollectionConfig = {
  slug: 'posts',
  labels: {
    singular: {
      en: 'Post',
      uk: 'Пост',
    },
    plural: {
      en: 'Posts',
      uk: 'Пости',
    },
  },
  admin: {
    useAsTitle: 'title',
  },
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
    },
    {
      name: 'shortDescription',
      label: {
        en: 'Short Description',
        uk: 'Короткий опис',
      },
      type: 'textarea',
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
      required: true,
    },
    {
      name: 'categories',
      label: {
        en: 'Categories',
        uk: 'Категорії',
      },
      type: 'relationship',
      relationTo: 'post-categories',
      hasMany: true,
    },
    {
      name: 'content',
      label: {
        en: 'Content',
        uk: 'Контент',
      },
      type: 'richText',
      required: true,
    },
    ...slugField(),
  ],
  versions: {
    maxPerDoc: 5,
    drafts: true,
  },
}
