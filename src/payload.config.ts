// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { BlocksFeature, FixedToolbarFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { ProjectTags } from './collections/ProjectTags'
import { Projects } from './collections/Projects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { en } from '@payloadcms/translations/languages/en'
import { uk } from '@payloadcms/translations/languages/uk'
import { blurDataUrlsPlugin } from '@oversightstudio/blur-data-urls'
import { CodeBlock } from './blocks/CodeBlock'
import { ExcalidrawBlock } from './blocks/Excalidraw'
import { PostCategories } from './collections/PostCategories'
import { Post } from './collections/Post'
import { Gallery } from './blocks/Gallery'
import { Homepage } from './collections/Globals/HomePage'
import { Blog } from './collections/Globals/Blog'
import { Files } from './collections/Files'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  blocks: [CodeBlock, ExcalidrawBlock, Gallery],
  i18n: {
    fallbackLanguage: 'en',
    supportedLanguages: { en, uk },
  },
  collections: [Users, Media, ProjectTags, Projects, PostCategories, Post, Files],
  globals: [Homepage, Blog],
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      FixedToolbarFeature(),
      BlocksFeature({
        blocks: ['Code', 'excalidraw', 'gallery'],
        inlineBlocks: [],
      }),
    ],
  }),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    seoPlugin({
      collections: ['projects', 'posts'],
      uploadsCollection: 'media',
      generateTitle: ({ doc }) => `${doc.title}`,
      generateDescription: ({ doc }) => doc.description || doc.shortDescription,
      generateImage: ({ doc }) => doc.image,
    }),
    blurDataUrlsPlugin({
      enabled: true,
      collections: [Media],
      // Blur data URLs Settings (Optional)
      blurOptions: {
        blur: 18,
        width: 12,
        height: 'auto',
      },
    }),
    // storage-adapter-placeholder
  ],
})
