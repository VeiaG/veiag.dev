'use client'

import { useState, type ReactNode } from 'react'
import { Dialog, DialogContent, DialogClose, DialogTitle } from '@/components/ui/dialog'
import { X } from 'lucide-react'

type ImageModalProps = {
  /**
   * The content to be displayed in normal view (clickable to open dialog)
   */
  children: ReactNode
  /**
   * The content to be displayed in the full-screen dialog
   * If not provided, the same children will be used
   */
  fullScreenContent?: ReactNode
  /**
   * Optional class name for the wrapper div
   */
  className?: string
}

export default function ImageModal({
  children,
  fullScreenContent,
  className = '',
}: ImageModalProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleOpen = () => {
    setIsOpen(true)
  }

  return (
    <>
      <div className={`cursor-pointer ${className}`} onClick={handleOpen}>
        {children}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          className="w-screen h-screen p-0 border-none bg-transparent max-w-none!"
          onClick={() => setIsOpen(false)}
        >
          <DialogTitle className="sr-only">Full Screen Image</DialogTitle>
          <div className="flex items-center justify-center w-full h-full p-4 ">
            {fullScreenContent || children}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
