import { withPayload } from '@payloadcms/next/withPayload'
import createNextIntlPlugin from 'next-intl/plugin'
const withNextIntl = createNextIntlPlugin()

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  typescript:{
    ignoreBuildErrors: true,
  },
  // Fix for scss on windows machines (payload-enhanced-sidebar)
  // Shouldn't affect other runtime environments
  sassOptions: {
    loadPaths: ['./node_modules/@payloadcms/ui/dist/scss/'],
  },
}

export default withNextIntl(
  withPayload(nextConfig, {
    devBundleServerPackages: true,
  }),
)
