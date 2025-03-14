import { Block } from 'payload'

export const Gallery: Block = {
  slug: 'gallery',
  labels: {
    singular: {
      en: 'Gallery',
      uk: 'Галерея',
    },
    plural: {
      en: 'Galleries',
      uk: 'Галереї',
    },
  },
  fields: [
    {
      type: 'upload',
      name: 'images',
      relationTo: 'media',
      hasMany: true,
      label: {
        en: 'Images',
        uk: 'Зображення',
      },
    },
  ],
}
