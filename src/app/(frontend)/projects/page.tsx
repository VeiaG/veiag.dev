import { getPayload } from 'payload'
import config from '@payload-config'
import ProjectCard from '@/components/ProjectCard'
import TagsFilter from '@/components/TagsFilter'

import type { Where } from 'payload'

export const metadata = {
  description:
    "Explore my web development projects – from modern websites to dynamic applications. Check out the work I've done ",
  title: 'veiag.dev - Projects',
}

type ProjectsPageProps = {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}
const ProjectsPage = async ({ searchParams }: ProjectsPageProps) => {
  const payload = await getPayload({ config: config })
  //get current tags from url params (tags)
  const params = await searchParams
  // console.log(params)

  const query: Where =
    params?.tags && params.tags.length > 0
      ? {
          and: [
            {
              'tags.title': {
                in: params.tags,
              },
            },
          ],
        }
      : {}

  const projects = await payload.find({
    collection: 'projects',
    depth: 1,
    limit: 0,
    sort: '_order',
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
    where: query,
  })

  const tags = await payload.find({
    collection: 'project-tags',
    depth: 1,
    limit: 0,
    pagination: false,
    select: {
      title: true,
    },
  })
  return (
    <div className="container mx-auto">
      <TagsFilter
        tags={tags.docs}
        initialTags={params?.tags ? (Array.isArray(params.tags) ? params.tags : [params.tags]) : []}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 py-8">
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
