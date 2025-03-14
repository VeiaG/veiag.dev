import { GlobalConfig } from 'payload'
import { revalidateHome } from '../hooks/revalidateHome'

//TODO add after change hook, to revalidate homepage cache
export const Homepage: GlobalConfig = {
  slug: 'homepage',
  label: {
    en: 'Homepage',
    uk: 'Головна сторінка',
  },
  fields: [
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: {
        en: 'Avatar',
        uk: 'Аватар',
      },
    },
    {
      name: 'cv',
      type: 'upload',
      relationTo: 'files',
      label: {
        en: 'CV',
        uk: 'Резюме',
      },
    },
    {
      name: 'about',
      type: 'richText',
      label: {
        en: 'About',
        uk: 'Про мене',
      },
    },
    {
      name: 'skills',
      type: 'text',
      defaultValue: [],
      hasMany: true,
      label: {
        en: 'Skills',
        uk: 'Навички',
      },
    },
    {
      name: 'selectedProjects',
      type: 'relationship',
      relationTo: 'projects',
      hasMany: true,
      label: {
        en: 'Selected Projects',
        uk: 'Обрані проекти',
      },
    },
    {
      name: 'selectedPosts',
      type: 'relationship',
      relationTo: 'posts',
      hasMany: true,
      label: {
        en: 'Selected Posts',
        uk: 'Обрані пости',
      },
    },
    {
      name: 'workExperience',
      type: 'array',
      fields: [
        {
          name: 'company',
          type: 'text',
          required: true,
          label: {
            en: 'Company',
            uk: 'Компанія',
          },
        },
        {
          name: 'position',
          type: 'text',
          required: true,
          label: {
            en: 'Position',
            uk: 'Посада',
          },
        },
        {
          name: 'startDate',
          type: 'date',
          required: true,
          label: {
            en: 'Start Date',
            uk: 'Дата початку',
          },
        },
        {
          name: 'endDate',
          type: 'date',
          required: true,
          label: {
            en: 'End Date',
            uk: 'Дата закінчення',
          },
        },
        {
          name: 'description',
          type: 'richText',
          required: true,
          label: {
            en: 'Description',
            uk: 'Опис',
          },
        },
        {
          name: 'location',
          type: 'text',
          required: true,
          label: {
            en: 'Location',
            uk: 'Місце розташування',
          },
        },
        {
          name: 'isPresent',
          type: 'checkbox',
          defaultValue: false,
          label: {
            en: 'Is Present',
            uk: 'Триває',
          },
        },
      ],
      label: {
        en: 'Work Experience',
        uk: 'Досвід роботи',
      },
    },
  ],
  hooks: {
    afterChange: [revalidateHome],
  },
}
