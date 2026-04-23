import { GlobalConfig } from 'payload'
import { revalidateHome } from '../hooks/revalidateHome'

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
      label: { en: 'Avatar', uk: 'Аватар' },
    },
    {
      name: 'cv',
      type: 'upload',
      relationTo: 'files',
      label: { en: 'CV', uk: 'Резюме' },
    },
    {
      name: 'about',
      type: 'richText',
      label: { en: 'About', uk: 'Про мене' },
      localized: true,
    },
    /* ── Categorized skills (replaces flat `skills` on the frontend) ── */
    {
      name: 'skillCategories',
      type: 'array',
      label: { en: 'Skill Categories', uk: 'Категорії навичок' },
      admin: {
        description: 'Define skill groups shown in the terminal skills grid (e.g. Frontend, Backend, Other).',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'category',
          type: 'text',
          required: true,
          label: { en: 'Category name', uk: 'Назва категорії' },
          admin: { placeholder: 'e.g. Frontend' },
        },
        {
          name: 'items',
          type: 'text',
          hasMany: true,
          required: true,
          label: { en: 'Skills', uk: 'Навички' },
          admin: { description: 'Each skill shown as a row inside the category column.' },
        },
      ],
    },
    /* ── Hero tags (shown in the whoami output box) ── */
    {
      name: 'heroTags',
      type: 'array',
      label: { en: 'Hero Tags', uk: 'Теги в герої' },
      admin: {
        description: 'Tech tags displayed in the whoami hero section. Each tag can have a colour variant.',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          label: { en: 'Label', uk: 'Текст' },
        },
        {
          name: 'variant',
          type: 'select',
          label: { en: 'Colour', uk: 'Колір' },
          defaultValue: 'default',
          options: [
            { label: 'Default (dim)',  value: 'default' },
            { label: 'Green',         value: 'green'   },
            { label: 'Blue',          value: 'blue'    },
            { label: 'Amber',         value: 'amber'   },
          ],
        },
      ],
    },
    /* ── Fastfetch terminal command data ── */
    {
      name: 'fastfetch',
      type: 'group',
      label: { en: 'Fastfetch', uk: 'Fastfetch' },
      admin: {
        description: 'Data shown when "fastfetch" is typed in the bottom terminal bar.',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'header',
          type: 'text',
          label: { en: 'Header (first line)', uk: 'Заголовок' },
          defaultValue: 'roman@veiag.dev',
          admin: { description: 'Displayed as the bold first line above the separator.' },
        },
        {
          name: 'items',
          type: 'array',
          label: { en: 'Info rows', uk: 'Рядки' },
          admin: {
            description: 'Leave "Key" empty to output the value as a plain decoration row (separator, dots, etc.).',
          },
          defaultValue: [
            { key: 'OS',       value: 'veiag.dev Portfolio 2.0' },
            { key: 'Host',     value: 'Full-stack Developer'     },
            { key: 'Uptime',   value: '22 years'                 },
            { key: 'Location', value: 'Kyiv, Ukraine'            },
            { key: 'Shell',    value: 'TypeScript'               },
            { key: 'DE',       value: 'React + Next.JS'          },
            { key: 'WM',       value: 'PayloadCMS'               },
            { key: 'Terminal', value: 'JetBrains Mono'           },
            { key: 'CPU',      value: 'Brain @ 3.2GHz (sometimes)' },
            { key: 'Memory',   value: '☕ coffee / 1 cat'        },
            { key: '',         value: ''                          },
            { key: '',         value: '● ● ● ● ● ● ●'            },
          ],
          fields: [
            {
              name: 'key',
              type: 'text',
              label: { en: 'Key', uk: 'Ключ' },
              admin: { placeholder: 'e.g. OS, Host, CPU — leave empty for decoration rows' },
            },
            {
              name: 'value',
              type: 'text',
              label: { en: 'Value', uk: 'Значення' },
              required: true,
            },
          ],
        },
      ],
    },
    /* ── Legacy flat skills list (kept for backwards compatibility) ── */
    {
      name: 'skills',
      type: 'text',
      defaultValue: [],
      hasMany: true,
      label: { en: 'Skills (legacy)', uk: 'Навички (застаріло)' },
      admin: {
        description:
          '⚠️ Deprecated — use "Skill Categories" and "Hero Tags" instead. ' +
          'This field is no longer rendered on the frontend.',
      },
    },
    {
      name: 'selectedProjects',
      type: 'relationship',
      relationTo: 'projects',
      hasMany: true,
      label: { en: 'Selected Projects', uk: 'Обрані проекти' },
    },
    {
      name: 'selectedPosts',
      type: 'relationship',
      relationTo: 'posts',
      hasMany: true,
      label: { en: 'Selected Posts', uk: 'Обрані пости' },
    },
    {
      name: 'workExperience',
      type: 'array',
      label: { en: 'Work Experience', uk: 'Досвід роботи' },
      fields: [
        {
          name: 'company',
          type: 'text',
          required: true,
          label: { en: 'Company', uk: 'Компанія' },
        },
        {
          name: 'position',
          type: 'text',
          required: true,
          label: { en: 'Position', uk: 'Посада' },
        },
        {
          name: 'startDate',
          type: 'date',
          required: true,
          label: { en: 'Start Date', uk: 'Дата початку' },
        },
        {
          name: 'endDate',
          type: 'date',
          required: true,
          label: { en: 'End Date', uk: 'Дата закінчення' },
        },
        {
          name: 'description',
          type: 'richText',
          required: true,
          label: { en: 'Description', uk: 'Опис' },
          localized: true,
        },
        {
          name: 'location',
          type: 'text',
          required: true,
          label: { en: 'Location', uk: 'Місце розташування' },
          localized: true,
        },
        {
          name: 'isPresent',
          type: 'checkbox',
          defaultValue: false,
          label: { en: 'Is Present', uk: 'Триває' },
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateHome],
  },
}
