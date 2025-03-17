import { Block } from 'payload'

export const ExcalidrawBlock: Block = {
  slug: 'excalidraw',

  fields: [
    {
      type: 'json',
      name: 'code',
      label: 'Code',
      admin: {
        components: {
          Field: './fields/Excalidraw#EmptyElement',
        },
      },
    },
    {
      type: 'select',
      name: 'height',
      label: {
        en: 'Height',
        uk: 'Висота',
      },
      options: [
        {
          label: {
            en: 'Default',
            uk: 'За замовчуванням',
          },
          value: 'default',
        },
        {
          label: {
            en: 'Square',
            uk: 'Квадрат',
          },
          value: 'square',
        },
        {
          label: {
            en: 'Unrestricted',
            uk: 'Необмежено',
          },
          value: 'unrestricted',
        },
      ],
      defaultValue: 'default',
    },
    {
      type: 'textarea',
      maxLength: 999999,
      name: 'svg',
      admin: {
        components: {
          Field: './fields/Excalidraw',
        },
      },
    },
  ],
}
