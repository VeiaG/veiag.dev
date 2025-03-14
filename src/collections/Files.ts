import type { CollectionConfig } from 'payload'

export const Files: CollectionConfig = {
  slug: 'files',
  labels: {
    singular: {
      en: 'File',
      uk: 'Файл',
    },
    plural: {
      en: 'Files',
      uk: 'Файли',
    },
  },
  access: {
    read: () => true,
  },
  fields: [],
  upload: true,
}
