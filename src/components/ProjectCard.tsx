import { Media, ProjectTag } from '@/payload-types'
import Image from 'next/image'
import NoiseOverlay from '@/components/NoiseOverlay'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
type ProjectCardProps = {
  title: string
  description: string
  tags: (string | ProjectTag)[] | null | undefined
  image: string | Media
  slug: string
}

const ProjectCard = ({ title, description, tags, image, slug }: ProjectCardProps) => {
  return (
    <Link
      className="bg-zinc-900 rounded-xl overflow-hidden relative group transition-transform duration-300 hover:-translate-y-2 flex flex-col"
      href={`/projects/${slug}`}
    >
      <div className=" aspect-video relative overflow-hidden">
        <Image
          src={(typeof image === 'string' ? image : image.url) || ''}
          alt={(image as Media)?.alt || title}
          fill
          className="object-cover w-full h-full"
          placeholder="blur"
          blurDataURL={typeof image === 'string' ? undefined : (image.blurDataUrl ?? undefined)}
        />
      </div>
      <div className="flex flex-col gap-2 p-4 pr-8 relative grow">
        <NoiseOverlay className="z-0" />
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-lg font-light ">{description}</p>
        <div className="flex gap-2 w-full flex-wrap">
          {tags?.map((tag, index) => (
            <span key={index} className="bg-zinc-950 text-zinc-100 px-2 py-1 rounded-md text-xs">
              {typeof tag === 'string' ? tag : tag.title}
            </span>
          ))}
        </div>
        <ArrowRight className="absolute right-4 bottom-4 transition-colors duration-300 group-hover:text-yellow-500" />
      </div>
    </Link>
  )
}
export default ProjectCard
