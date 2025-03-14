import { slugField } from '@/fields/slug'
import type { CollectionConfig } from 'payload'
import { revalidateDeleteProject, revalidateProject } from './hooks/revalidateProject'

export const Projects: CollectionConfig = {
  slug: 'projects',
  labels: {
    singular: {
      en: 'Project',
      uk: 'Проект',
    },
    plural: {
      en: 'Projects',
      uk: 'Проекти',
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
      name: 'fullDescription',
      label: {
        en: 'Full Description',
        uk: 'Повний опис',
      },
      type: 'richText',
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
  hooks: {
    afterChange: [revalidateProject],
    afterDelete: [revalidateDeleteProject],
  },
  versions: {
    maxPerDoc: 5,
    drafts: true,
  },
}
