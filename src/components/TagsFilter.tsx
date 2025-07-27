'use client'
import React, { useEffect } from 'react'
import { Button } from './ui/button'
import { X } from 'lucide-react'
import { usePathname, useRouter } from '@/i18n/navigation'
type TagsFilterProps = {
  tags: {
    id: string
    title: string
  }[]
  initialTags: string[]
  translations: {
    filters: string
  }
}
const TagsFilter: React.FC<TagsFilterProps> = ({ tags, initialTags, translations }) => {
  const [selectedTags, setSelectedTags] = React.useState<string[]>(initialTags)

  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    //add selected tags to url
    const searchParams = new URLSearchParams()
    selectedTags.forEach((tag) => {
      searchParams.append('tags', tag)
    })
    router.push(`${pathname}?${searchParams.toString()}`)
  }, [selectedTags, pathname, router])

  return (
    <div className="flex gap-2 items-center flex-wrap w-full">
      <span>{translations.filters}:</span>
      {selectedTags.map((tag) => (
        <Button
          key={tag}
          variant="default"
          size="sm"
          onClick={() => {
            setSelectedTags((prev) => prev.filter((t) => t !== tag))
          }}
        >
          {tag}
          <X />
        </Button>
      ))}
      {tags
        .filter((tag) => {
          return !selectedTags.includes(tag.title)
        })
        .map((tag) => (
          <Button
            key={tag.id}
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedTags((prev) => [...prev, tag.title])
            }}
          >
            {tag.title}
          </Button>
        ))}
    </div>
  )
}

export default TagsFilter
