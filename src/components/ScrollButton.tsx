'use client'
import React from 'react'
import { Button } from './ui/button'
import { ArrowDown } from 'lucide-react'

const ScrollButton = () => {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="absolute bottom-4 animate-bounce p-0"
      onClick={() => {
        window.scrollTo({ top: window.innerHeight - 128, behavior: 'smooth' })
      }}
    >
      <ArrowDown className="w-6! h-6!" />
    </Button>
  )
}

export default ScrollButton
