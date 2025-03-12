import NoiseOverlay from '@/components/NoiseOverlay'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Media, ProjectTag } from '@/payload-types'
import Image from 'next/image'

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
      <div className=" aspect-[1.35] relative overflow-hidden">
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
        <ArrowRight className="absolute right-4 bottom-4 transition-colors duration-300 group-hover:text-red-500" />
      </div>
    </Link>
  )
}
const ProjectsPage = async () => {
  const payload = await getPayload({ config: config })
  const projects = await payload.find({
    collection: 'projects',
    depth: 1,
    limit: 12,
    overrideAccess: false,
    select: {
      title: true,
      slug: true,
      tags: true,
      shortDescription: true,
      image: true,
    },
    populate: {
      'project-tags': {
        title: true,
      },
    },
  })
  console.log(projects)

  const tags = await payload.find({
    collection: 'project-tags',
    depth: 1,
    overrideAccess: false,
    select: {
      title: true,
    },
  })
  return (
    <div className="container mx-auto">
      <div className="flex gap-2 items-center">
        <span>Filters:</span>
        {tags.docs.map((tag, index) => (
          <button key={index} className="bg-zinc-800 text-zinc-100 px-2 py-1 rounded-md">
            {tag.title}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-4 gap-6 py-6">
        {projects.docs.map((project, index) => (
          <ProjectCard
            key={index}
            title={project.title}
            description={project.shortDescription}
            tags={project.tags}
            image={project.image}
            slug={project?.slug || ''}
          />
        ))}
      </div>
    </div>
  )
}

export default ProjectsPage
