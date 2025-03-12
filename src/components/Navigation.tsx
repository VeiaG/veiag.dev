import Link from 'next/link'
import React from 'react'
import NoiseOverlay from './NoiseOverlay'
import { Button } from './ui/button'

const Navigation = () => {
  return (
    <nav className="sticky top-0 bg-[rgba(0,0,0,0.1)] py-4 z-50 backdrop-blur-2xl">
      <NoiseOverlay className="z-[-1] opacity-10 " />
      <div className="container mx-auto justify-between flex items-center gap-2">
        <Link href="/" className="text-2xl font-bold">
          VeiaG
        </Link>

        <div className="flex gap-1 items-center">
          <Button variant="ghostBlurry" asChild className="z-10">
            <Link href="/blog">Blog</Link>
          </Button>
          <Button variant="ghostBlurry" asChild className="z-10">
            <Link href="/projects">Projects</Link>
          </Button>
          <Button variant="ghostBlurry" asChild className="z-10">
            <Link href="/about">About</Link>
          </Button>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
