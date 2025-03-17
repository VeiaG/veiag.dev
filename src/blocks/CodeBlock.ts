import { Block } from 'payload'
export const languages = {
  ts: 'TypeScript',
  plaintext: 'Plain Text',
  tsx: 'TSX',
  js: 'JavaScript',
  jsx: 'JSX',
  css: 'CSS',
  html: 'HTML',
  json: 'JSON',
}
export const CodeBlock: Block = {
  slug: 'Code',
  labels: {
    singular: {
      en: 'Code Block',
      uk: 'Блок коду',
    },
    plural: {
      en: 'Code Blocks',
      uk: 'Блоки коду',
    },
  },
  fields: [
    {
      type: 'select',
      name: 'language',
      options: Object.entries(languages).map(([key, value]) => ({
        label: value,
        value: key,
      })),
      defaultValue: 'ts',
    },
    {
      admin: {
        components: {
          Field: '/fields/CodeBlock/#Code',
        },
      },
      name: 'code',
      type: 'code',
    },
  ],
  // admin: {
  //   components: {
  //     Block: '/fields/CodeBlock/#Block',
  //   },
  // },
}
