'use client'
import React from 'react'

import {
  EmailShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
} from 'react-share'
import { Facebook, Linkedin, Share2, Twitter } from 'lucide-react'
import { getClientSideURL } from '@/lib/getURL'
import { usePathname } from 'next/navigation'
const SharePost = ({
  translation,
}: {
  translation: {
    shareThis: string
  }
}) => {
  const base = getClientSideURL()
  const path = usePathname()
  const url = `${base}${path}`
  const btnCls = "flex items-center justify-center w-8 h-8 border border-term-border bg-term-bg text-term-muted hover:border-term-amber hover:text-term-amber transition-colors duration-150"

  return (
    <div className="mt-8 py-4 border-t border-term-border flex gap-2 justify-between items-center">
      <span className="font-mono text-[12px] text-term-dim">{translation.shareThis}</span>
      <div className="flex gap-1 items-center">
        <TwitterShareButton url={url} resetButtonStyle={false} className={btnCls}>
          <Twitter className="w-3.5 h-3.5" />
        </TwitterShareButton>
        <FacebookShareButton url={url} resetButtonStyle={false} className={btnCls}>
          <Facebook className="w-3.5 h-3.5" />
        </FacebookShareButton>
        <LinkedinShareButton url={url} resetButtonStyle={false} className={btnCls}>
          <Linkedin className="w-3.5 h-3.5" />
        </LinkedinShareButton>
        <EmailShareButton url={url} resetButtonStyle={false} className={btnCls}>
          <Share2 className="w-3.5 h-3.5" />
        </EmailShareButton>
      </div>
    </div>
  )
}

export default SharePost
