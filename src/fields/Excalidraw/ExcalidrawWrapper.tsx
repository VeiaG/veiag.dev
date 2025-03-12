'use client'
import { Excalidraw, exportToSvg } from '@excalidraw/excalidraw'

import '@excalidraw/excalidraw/index.css'
import { ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types'
import { useState } from 'react'
type ExcalidrawWrapperProps = {
  onSave: (svg: string, elements: string) => void
  initialElements?: string
}
const ExcalidrawWrapper: React.FC<ExcalidrawWrapperProps> = ({ onSave, initialElements }) => {
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
    console.log({
      elements,
      appState: {
        ...excalidrawAPI.getAppState(),
        exportWithDarkMode: true,
        exportBackground: false,
      },
      files: excalidrawAPI.getFiles(),
    })
    console.log(svg) //cosole logs as html elemet (svg)
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
            <button
              style={{
                background: '#70b1ec',
                border: 'none',
                color: '#fff',
                width: 'max-content',
                fontWeight: 'bold',
              }}
              onClick={() => {
                // window.alert('This is dummy top right UI')
                handleExportToSVG()
              }}
            >
              Зберегти
            </button>
          )
        }}
      ></Excalidraw>
    </div>
  )
}
export default ExcalidrawWrapper
