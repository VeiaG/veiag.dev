'use client'

import { Menu } from 'lucide-react'
import { Button } from './ui/button'
import { useState } from 'react'
import { motion } from 'motion/react'
import Link from 'next/link'

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false)
  const toggle = () => setIsOpen(!isOpen)
  const close = () => setIsOpen(false)
  return (
    <div className="flex md:hidden">
      <Button variant="outline" size="icon" onClick={toggle} className="z-[120]">
        <Menu />
      </Button>
      <motion.div
        initial={{ y: '-100%' }}
        animate={{ y: isOpen ? 0 : '-100%' }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className={`fixed top-0 right-0  left-0 z-[-1]`}
      >
        <div
          className={`z-[-1] absolute w-full h-full  pointer-events-none inset-0 [mask:linear-gradient(black_60%,_transparent_100%)]
           bg-[length:4px_4px] bg-[radial-gradient(transparent_1px,var(--color-zinc-950)_1px)] backdrop-blur-xs
          `}
        />
        <div className="flex gap-4 items-end flex-col py-24 px-2">
          <Button variant="link" asChild className="z-10 text-2xl" onClick={close}>
            <Link href="/blog">Blog</Link>
          </Button>
          <Button variant="link" asChild className="z-10 text-2xl" onClick={close}>
            <Link href="/projects">Projects</Link>
          </Button>
          <Button variant="link" asChild className="z-10 text-2xl" onClick={close}>
            <Link href="/#about">About</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

export default MobileNav
