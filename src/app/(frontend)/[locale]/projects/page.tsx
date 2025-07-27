import { getPayload } from 'payload'
import config from '@payload-config'
import ProjectCard from '@/components/ProjectCard'
import TagsFilter from '@/components/TagsFilter'

import type { Where } from 'payload'
import { AvaibleLocale } from '@/i18n/routing'
import { getTranslations } from 'next-intl/server'

export const metadata = {
  description:
    "Explore my web development projects – from modern websites to dynamic applications. Check out the work I've done ",
  title: 'veiag.dev - Projects',
}

type ProjectsPageProps = {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
  params: Promise<{ locale: AvaibleLocale }>
}
const ProjectsPage = async ({ searchParams, params }: ProjectsPageProps) => {
  const payload = await getPayload({ config: config })
  const { locale } = await params
  const searchParameters = await searchParams

  const query: Where =
    searchParameters?.tags && searchParameters.tags.length > 0
      ? {
          and: [
            {
              'tags.title': {
                in: searchParameters.tags,
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
    locale: locale,
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
  const t = await getTranslations('ProjectsPage')
  return (
    <div className="container mx-auto">
      <TagsFilter
        tags={tags.docs}
        initialTags={
          searchParameters?.tags
            ? Array.isArray(searchParameters.tags)
              ? searchParameters.tags
              : [searchParameters.tags]
            : []
        }
        translations={{
          filters: t('filters'),
        }}
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
