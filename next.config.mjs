import { withPayload } from '@payloadcms/next/withPayload'
import createNextIntlPlugin from 'next-intl/plugin'
const withNextIntl = createNextIntlPlugin()

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Your Next.js config here
}

export default withNextIntl(
  withPayload(nextConfig, {
    devBundleServerPackages: true,
  }),
)
