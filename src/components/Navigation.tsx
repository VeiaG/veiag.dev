import { Link } from '@/i18n/navigation'
import { useLocale } from 'next-intl'
import ChangeLocaleButton from './ChangeLocaleButton'
import NavigationAdmin from './NavigationAdmin'
import MobileNav from './MobileNav'
import { useTranslations } from 'next-intl'

const Navigation = () => {
  const locale = useLocale()
  const t = useTranslations('Navigation')

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] h-12 flex items-center px-8 bg-term-bg/[0.95] backdrop-blur-sm border-b border-term-border">
      {/* Logo */}
      <Link href="/" className="font-mono font-bold text-[15px] text-term-amber mr-auto tracking-tight">
        <span className="text-term-muted">~/</span>veiag.dev
      </Link>

      {/* Desktop links */}
      <ul className="hidden md:flex list-none">
        <NavLink href="/blog"    label={t('blog')} />
        <NavLink href="/projects" label={t('projects')} />
        <NavLink href="/#about"  label={t('about')} />
        <li className="border-l border-term-border">
          <ChangeLocaleButton currentLocale={locale} />
        </li>
        <NavigationAdmin />
      </ul>

      {/* Mobile */}
      <MobileNav
        translations={{ blog: t('blog'), projects: t('projects'), about: t('about') }}
      />
    </nav>
  )
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <li className="border-l border-term-border">
      <Link
        href={href}
        className="h-12 px-4 flex items-center text-[13px] font-mono text-term-muted hover:text-term-amber hover:bg-term-amber/5 transition-colors duration-150 before:content-['./'] before:text-term-dim"
      >
        {label}
      </Link>
    </li>
  )
}

export default Navigation
