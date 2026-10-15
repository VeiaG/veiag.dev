import { GlobalConfig } from 'payload'
import { revalidateAppsPageGlobal } from '../hooks/revalidateApps'

export const AppsPage: GlobalConfig = {
  slug: 'apps-page',
  admin: {
    group: {
      en: 'Projects',
      uk: 'Проекти',
    },
  },
  label: {
    en: 'Apps Page',
    uk: 'Сторінка застосунків',
  },
  fields: [
    {
      name: 'intro',
      type: 'richText',
      label: {
        en: 'Intro',
        uk: 'Вступ',
      },
      localized: true,
      admin: {
        description: {
          en: 'Text under the page title',
          uk: 'Текст під заголовком сторінки',
        },
      },
    },
  ],
  hooks: {
    afterChange: [revalidateAppsPageGlobal],
  },
}
