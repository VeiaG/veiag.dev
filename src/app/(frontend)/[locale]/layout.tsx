import React from 'react'
import './styles.css'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import TerminalInputBar from '@/components/TerminalInputBar'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import Script from 'next/script'

export const metadata = {
  description:
    'Portfolio of Roman Palamar — Full-stack Developer based in Kyiv. Next.js, React, TypeScript, PayloadCMS.',
  title: 'veiag.dev',
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()

  return (
    <html lang={locale}>
      <Script
        defer
        src="https://analytics.veiag.dev/script.js"
        data-website-id="7070bfb1-5627-4b18-80af-e0af4ec20282"
      />
      {/* Always dark — terminal aesthetic */}
      <body className="bg-term-bg text-term-text relative dark flex flex-col min-h-screen">
        <NextIntlClientProvider>
          <Navigation />
          {/* pt-12 = nav height; pb-[49px] = terminal bar height */}
          <main className="grow pt-12 pb-[49px]">{children}</main>
          <Footer />
          <TerminalInputBar />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
