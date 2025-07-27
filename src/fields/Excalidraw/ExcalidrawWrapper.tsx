'use client'
import { Excalidraw, exportToSvg } from '@excalidraw/excalidraw'

import '@excalidraw/excalidraw/index.css'
import { ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types'
import { Button } from '@payloadcms/ui'
import { useState } from 'react'
type ExcalidrawWrapperProps = {
  onSave: (svg: string, elements: string) => void
  initialElements?: string
  closeModal: () => void
}
const ExcalidrawWrapper: React.FC<ExcalidrawWrapperProps> = ({
  onSave,
  initialElements,
  closeModal,
}) => {
  const [excalidrawAPI, setExcalidrawAPI] = useState<ExcalidrawImperativeAPI>()

  const handleExportToSVG = async () => {
    if (!excalidrawAPI) {
      return
    }
    const elements = excalidrawAPI.getSceneElements()
    if (!elements || !elements.length) {
      return
    }
    const svg = await exportToSvg({
      elements,
      appState: {
        ...excalidrawAPI.getAppState(),
        exportWithDarkMode: true,
        exportBackground: false,
      },
      files: excalidrawAPI.getFiles(),
    })

    // save svg to file (blob saving bad , writing [object SVGSVGElement] in file)
    // save normally
    onSave(svg.outerHTML, JSON.stringify(elements))

    // const svgString = new XMLSerializer().serializeToString(svg)
    // const blob = new Blob([svgString], { type: 'image/svg+xml' })
    // const url = URL.createObjectURL(blob)
    // const a = document.createElement('a')
    // a.href = url
    // a.download = 'excalidraw.svg'
    // a.click()
  }
  return (
    <div className="excalidraw-wrapper">
      <Excalidraw
        theme="dark"
        excalidrawAPI={(api) => setExcalidrawAPI(api)}
        initialData={{
          elements: JSON.parse(initialElements || '[]'),
        }}
        renderTopRightUI={() => {
          return (
            <>
              <Button
                buttonStyle="secondary"
                onClick={() => {
                  closeModal()
                }}
                className="remove-margins"
              >
                Вийти
              </Button>
              <Button
                buttonStyle="primary"
                onClick={() => {
                  handleExportToSVG()
                }}
                className="remove-margins"
              >
                Зберегти
              </Button>
            </>
          )
        }}
      ></Excalidraw>
    </div>
  )
}
export default ExcalidrawWrapper
