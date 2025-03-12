'use client'
import React from 'react'
import { Button } from './ui/button'
import { Check, Copy } from 'lucide-react'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'

const CopyButton = ({ text }: { text: string }) => {
  const [copiedText, copy] = useCopyToClipboard()
  return (
    <Button
      variant="default"
      size="icon"
      className="absolute top-2 right-2 z-10"
      onClick={() => copy(text)}
      disabled={!!copiedText}
    >
      {copiedText ? <Check /> : <Copy />}
    </Button>
  )
}

export default CopyButton
