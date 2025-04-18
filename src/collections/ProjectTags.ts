import type { CollectionConfig } from 'payload'

export const ProjectTags: CollectionConfig = {
  slug: 'project-tags',
  access: {
    read: () => true,
  },
  labels: {
    singular: {
      en: 'Project Tag',
      uk: 'Тег проекту',
    },
    plural: {
      en: 'Project Tags',
      uk: 'Теги проектів',
    },
  },
  admin: {
    useAsTitle: 'title',
    group: {
      en: 'Projects',
      uk: 'Проекти',
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
