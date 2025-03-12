import { cn } from '@/lib/utils'
import { Code, Excalidraw } from '@/payload-types'
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

type NodeTypes = DefaultNodeTypes | SerializedBlockNode<Code | Excalidraw>

const languageKeyToPrismlanguageMap = {
  plaintext: 'text',
  ts: 'typescript',
  tsx: 'tsx',
  js: 'javascript',
  jsx: 'jsx',
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
  heading: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({ nodes: node.children })
    const Tag = node.tag
    let className = ''
    // Add tailwind classes based on the heading level
    switch (node.tag) {
      case 'h1':
        className = 'text-4xl font-bold'
        break
      case 'h2':
        className = 'text-3xl font-bold'
        break
      case 'h3':
        className = 'text-2xl font-bold'
        break
      case 'h4':
        className = 'text-xl font-bold'
        break
      case 'h5':
        className = 'text-lg font-bold'
        break
      case 'h6':
        className = 'text-base font-bold'
        break
    }
    return <Tag className={className}>{children}</Tag>
  },

  list: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({ nodes: node.children })
    const Tag = node.tag
    let className = ''
    if (node.listType === 'number') {
      className = 'list-decimal list-inside'
    }
    if (node.listType === 'bullet') {
      className = 'list-disc list-inside'
    }
    if (node.listType === 'check') {
      className = 'list-disc list-inside'
    }
    return <Tag className={className}>{children}</Tag>
  },
  quote: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({ nodes: node.children })
    return (
      <blockquote className="border-l-4 border-muted-foreground pl-4 py-2 bg-secondary">
        {children}
      </blockquote>
    )
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
          className = '*:max-h-[360px]'
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
          className={cn('w-full h-auto *:w-full *:h-auto  mt-4 mb-8', className)}
        />
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
  const { className, enableProse = true, enableGutter = true, ...rest } = props
  return (
    <ConvertRichText
      converters={jsxConverters}
      className={cn(
        'payload-richtext',
        {
          container: enableGutter,
          'max-w-none': !enableGutter,
          'mx-auto prose md:prose-md dark:prose-invert': enableProse,
        },
        className,
      )}
      {...rest}
    />
  )
}
