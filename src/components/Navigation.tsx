import { Link } from '@/i18n/navigation'
import React from 'react'
import { Button } from './ui/button'
import NavigationAdmin from './NavigationAdmin'
import MobileNav from './MobileNav'
import { useLocale, useTranslations } from 'next-intl'
import ChangeLocaleButton from './ChangeLocaleButton'

const Navigation = () => {
  const locale = useLocale()
  const t = useTranslations('Navigation')
  return (
    <nav className="sticky top-0 py-4 z-50 w-full pb-6">
      <div
        className={`z-[-1] absolute w-full h-full  pointer-events-none inset-0 [mask:linear-gradient(black_60%,_transparent_100%)]
           bg-[length:4px_4px] bg-[radial-gradient(transparent_1px,var(--color-zinc-950)_1px)] backdrop-blur-xs
          `}
      />
      <div className="container mx-auto justify-between flex items-center gap-2">
        <Link href="/" className="text-2xl font-bold">
          veiag.dev
        </Link>

        <div className="hidden gap-1 items-center md:flex ">
          <Button variant="ghostBlurry" asChild className="z-10">
            <Link href="/blog">{t('blog')}</Link>
          </Button>
          <Button variant="ghostBlurry" asChild className="z-10">
            <Link href="/projects">{t('projects')}</Link>
          </Button>
          <Button variant="ghostBlurry" asChild className="z-10">
            <Link href="/#about">{t('about')}</Link>
          </Button>
          <ChangeLocaleButton currentLocale={locale} />
          <NavigationAdmin />
        </div>
        <MobileNav
          translations={{
            blog: t('blog'),
            projects: t('projects'),
            about: t('about'),
          }}
        />
      </div>
    </nav>
  )
}

export default Navigation
