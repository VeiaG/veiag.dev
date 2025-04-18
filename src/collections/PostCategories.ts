import type { CollectionConfig } from 'payload'

export const PostCategories: CollectionConfig = {
  slug: 'post-categories',
  access: {
    read: () => true,
  },
  labels: {
    singular: {
      en: 'Post Category',
      uk: 'Категорія посту',
    },
    plural: {
      en: 'Post Categories',
      uk: 'Категорії постів',
    },
  },
  admin: {
    useAsTitle: 'title',
    group: {
      en: 'Blog',
      uk: 'Блог',
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
  ],
}
