import { cn } from '@/lib/utils'
import { Code, Excalidraw, Gallery } from '@/payload-types'
import {
  DefaultNodeTypes,
  SerializedBlockNode,
  SerializedUploadNode,
  type DefaultTypedEditorState,
} from '@payloadcms/richtext-lexical'
import {
  JSXConvertersFunction,
  RichText as ConvertRichText,
} from '@payloadcms/richtext-lexical/react'
import Image from 'next/image'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import CopyButton from './CopyButton'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import ImageModal from './ImageModal'

type NodeTypes = DefaultNodeTypes | SerializedBlockNode<Code | Excalidraw | Gallery>

const languageKeyToPrismlanguageMap = {
  plaintext: 'text',
  ts: 'typescript',
  tsx: 'tsx',
  js: 'javascript',
  jsx: 'jsx',
  css: 'css',
  html: 'html',
  json: 'json',
}

const CustomUploadComponent: React.FC<{
  node: SerializedUploadNode
}> = ({ node }) => {
  if (node.relationTo === 'media') {
    const uploadDoc = node.value
    if (typeof uploadDoc !== 'object') {
      return null
    }
    const { alt, height, url, width, blurDataUrl } = uploadDoc
    return (
      <Image
        alt={alt || ''}
        height={height || 0}
        src={url || ''}
        width={width || 0}
        className="w-full object-cover rounded-lg "
        placeholder="blur"
        blurDataURL={blurDataUrl ?? undefined}
      />
    )
  }

  return null
}

const jsxConverters: JSXConvertersFunction<NodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  upload: ({ node }) => {
    return <CustomUploadComponent node={node} />
  },
  blocks: {
    Code: ({ node }) => {
      return (
        <div className="relative">
          <CopyButton text={String(node.fields.code)} />
          <SyntaxHighlighter
            style={vscDarkPlus}
            showLineNumbers
            wrapLongLines
            language={
              languageKeyToPrismlanguageMap[
                (node.fields.language as keyof typeof languageKeyToPrismlanguageMap) || 'plaintext'
              ]
            }
            customStyle={{
              padding: '1.5rem 1rem',
            }}
            className="light-scroll"
          >
            {String(node.fields.code)}
          </SyntaxHighlighter>
        </div>
      )
    },
    excalidraw: ({ node }) => {
      let className = ''
      switch (node.fields.height) {
        case 'default':
          className = '*:max-h-[360px]' //This also provided in styles for compatability ( ios sucks )
          break
        case 'square':
          className = '*:aspect-square'
          break
        case 'unrestricted':
          className = ''
          break
      }
      return (
        <div
          dangerouslySetInnerHTML={{ __html: node.fields.svg || '' }}
          className={cn(
            'w-full h-auto *:w-full *:h-auto  mt-4 mb-8',
            className,
            `exclaidraw-${node.fields.height}`,
          )}
        />
      )
    },
    gallery: ({ node }) => {
      return (
        <Carousel className="my-8 mx-12 lg:mx-0">
          <CarouselContent>
            {node.fields.images?.map((image, index) => {
              if (typeof image === 'string' || !image.url) {
                return null
              }
              return (
                <CarouselItem key={index} className="lg:basis-1/2 ">
                  <ImageModal
                    fullScreenContent={
                      <Image
                        src={image.url || ''}
                        alt={image.alt}
                        sizes="100vw"
                        width={0}
                        height={0}
                        style={{ width: '100%', height: '100%' }}
                        className="object-contain max-h-[90vh] max-w-[90vw] not-prose"
                        placeholder="blur"
                        blurDataURL={image.blurDataUrl || ''}
                      />
                    }
                  >
                    <div className="relative p-1 h-auto  w-full aspect-video">
                      <Image
                        src={image.url}
                        alt={image.alt}
                        width={image.width || 0}
                        height={image.height || 0}
                        style={{ width: 'auto', height: '100%' }}
                        placeholder="blur"
                        className="object-cover rounded-xl not-prose  aspect-video"
                        blurDataURL={image.blurDataUrl || ''}
                        draggable={false}
                      />
                    </div>
                  </ImageModal>
                </CarouselItem>
              )
            })}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      )
    },
  },
})

type Props = {
  data: DefaultTypedEditorState
  enableGutter?: boolean
  enableProse?: boolean
} & React.HTMLAttributes<HTMLDivElement>

export default function RichText(props: Props) {
  const { className, enableProse = true, enableGutter = false, ...rest } = props
  return (
    <ConvertRichText
      converters={jsxConverters}
      className={cn(
        'payload-richtext',
        {
          container: enableGutter,
          'max-w-none': !enableGutter,
          'mx-auto prose prose-zinc md:prose-md dark:prose-invert': enableProse,
        },
        className,
      )}
      {...rest}
    />
  )
}
