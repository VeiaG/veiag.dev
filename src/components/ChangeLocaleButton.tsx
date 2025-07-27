'use client'

import { usePathname, useRouter } from '@/i18n/navigation'
import { Button } from './ui/button'

const ChangeLocaleButton = ({ currentLocale }: { currentLocale?: string }) => {
  const router = useRouter()
  const pathname = usePathname()

  const nextLocale = currentLocale === 'en' ? 'uk' : 'en'

  let newPath = pathname

  if (pathname.startsWith('/blog/')) {
    newPath = '/blog'
  } else if (pathname.startsWith('/projects/')) {
    newPath = '/projects'
  }

  const handleChangeLocale = () => {
    router.replace(newPath, { locale: nextLocale })
  }

  return (
    <Button variant="ghostBlurry" onClick={handleChangeLocale}>
      {currentLocale === 'en' ? 'UA' : 'EN'}
    </Button>
  )
}

export default ChangeLocaleButton
