import React from 'react'
import './styles.css'
import NoiseOverlay from '../../../components/NoiseOverlay'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'

export const metadata = {
  description:
    'Welcome to my portfolio! I’m Roman, a web developer passionate about building modern, user-friendly websites and applications. Check out my projects and see what I’ve been working on!',
  title: 'veiag.dev',
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }
  return (
    <html lang="en">
      {/* <script crossOrigin="anonymous" src="//unpkg.com/react-scan/dist/auto.global.js" /> */}
      <body className="bg-zinc-950 text-white relative dark flex flex-col">
        <NextIntlClientProvider>
          <Navigation />
          <NoiseOverlay className="z-[-1]" />
          <main className="grow">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
