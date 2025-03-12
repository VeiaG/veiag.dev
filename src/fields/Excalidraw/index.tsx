'use client'

import { Button, Modal, useField, useForm, useFormFields, useModal } from '@payloadcms/ui'
import dynamic from 'next/dynamic'
import { JSONFieldClientProps } from 'payload'
import './index.scss'

// Since client components get prerenderd on server as well hence importing
// the excalidraw stuff dynamically with ssr false

const ExcalidrawWrapper = dynamic(() => import('@/fields/Excalidraw/ExcalidrawWrapper'), {
  ssr: false,
})

const ExcalidrawBlock: React.FC<JSONFieldClientProps> = ({ field, path }) => {
  const { toggleModal, closeModal } = useModal()
  const { dispatchFields } = useForm()
  const { value, setValue } = useField<string>({ path: path || field.name })

  const jsonFieldPath = path?.includes('.') ? `${path}.${'code'}` : 'code'

  //the value of json code field
  const json = useFormFields(([fields]) => {
    return fields['code']?.value as string
  })

  const handleSave = (svg: string, elements: string) => {
    closeModal('excalidraw')
    console.log('Saving:', elements)
    dispatchFields({
      type: 'UPDATE',
      path: jsonFieldPath,
      value: elements,
    })

    setValue(svg)
  }
  return (
    <div className="excalidraw-block">
      <div dangerouslySetInnerHTML={{ __html: value }} className="excalidraw-svg"></div>

      <Button onClick={() => toggleModal('excalidraw')} className="excalidraw-edit">
        Open Excalidraw
      </Button>
      <Modal slug="excalidraw" className="excalidraw-modal">
        {/* <Button onClick={() => closeModal('excalidraw')} className="excalidraw-close">
          Close
        </Button> */}
        <ExcalidrawWrapper onSave={handleSave} initialElements={json} />
      </Modal>
    </div>
  )
}

export const EmptyElement = () => {
  return null
}
export default ExcalidrawBlock
