import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'
import NavigationAdmin from './NavigationAdmin'
import MobileNav from './MobileNav'

const Navigation = () => {
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
            <Link href="/blog">Blog</Link>
          </Button>
          <Button variant="ghostBlurry" asChild className="z-10">
            <Link href="/projects">Projects</Link>
          </Button>
          <Button variant="ghostBlurry" asChild className="z-10">
            <Link href="/#about">About</Link>
          </Button>
          <NavigationAdmin />
        </div>
        <MobileNav />
      </div>
    </nav>
  )
}

export default Navigation
