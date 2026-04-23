'use client'

import { usePathname, useRouter } from '@/i18n/navigation'

const ChangeLocaleButton = ({ currentLocale }: { currentLocale?: string }) => {
  const router     = useRouter()
  const pathname   = usePathname()
  const nextLocale = currentLocale === 'en' ? 'uk' : 'en'

  let newPath = pathname
  if (pathname.startsWith('/blog/'))     newPath = '/blog'
  if (pathname.startsWith('/projects/')) newPath = '/projects'

  return (
    <button
      onClick={() => router.replace(newPath, { locale: nextLocale })}
      className="h-12 px-4 text-[13px] font-mono text-term-amber hover:bg-term-amber/5 transition-colors duration-150 cursor-pointer"
    >
      {currentLocale === 'en' ? 'UA' : 'EN'}
    </button>
  )
}

export default ChangeLocaleButton
