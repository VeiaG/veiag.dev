import React, { cache } from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Metadata } from 'next'
import { generateMeta } from '@/lib/generateMeta'
import { notFound } from 'next/navigation'
//TODO : update lexical from canary to stable release , when they fix image issue
import Image from 'next/image'
import RichText from '@/components/RichText'
import NoiseOverlay from '@/components/NoiseOverlay'
import { ArrowLeft, ArrowUpRight, Figma, Github } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'
import { AvaibleLocale } from '@/i18n/routing'
export async function generateStaticParams() {
  const payload = await getPayload({ config: config })
  const posts = await payload.find({
    collection: 'projects',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
    locale: 'all',
  })

  const params = posts.docs.flatMap((doc) => {
    const localizedSlugs = doc.slug || {}
    return Object.entries(localizedSlugs).map(([locale, localizedSlug]) => ({
      locale,
      slug: localizedSlug,
    }))
  })

  return params
}
type Args = {
  params: Promise<{
    slug?: string
    locale?: AvaibleLocale
  }>
}

const ProjectPage = async ({ params }: Args) => {
  const { slug = '', locale = 'en' } = await params
  const project = await queryProjectBySlug({ slug, locale })
  if (!project) return notFound()
  return (
    <div>
      <div className="relative min-h-[512px] flex flex-col">
        <Image
          src={(typeof project.image === 'string' ? project.image : project.image.url) || ''}
          alt={project.title}
          fill
          className="object-cover absolute select-none blur-lg z-0 brightness-50"
          placeholder="blur"
          blurDataURL={
            typeof project.image === 'string' ? undefined : (project.image.blurDataUrl ?? undefined)
          }
        />
        <NoiseOverlay className="z-10 opacity-70 mix-blend-multiply" />
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3 py-32 container mx-auto z-10 relative min-h-[inherit] max-w-[1280px] ">
          <Link
            href="/projects"
            className="left-3 md:left-0 top-8 absolute flex gap-1 items-center z-10 hover:text-yellow-500 transition-colors "
          >
            <ArrowLeft />
            <span>Back</span>
          </Link>
          <div className="flex flex-col gap-2 justify-center col-span-1 md:col-span-2">
            <h1 className="text-4xl md:text-7xl font-bold">{project.title}</h1>

            <RichText data={project.fullDescription} className="text-xl w-full text-zinc-50" />
            <div className="flex gap-2 w-full flex-wrap">
              {project.tags?.map((tag, index) => (
                <span
                  key={index}
                  className="bg-zinc-950 text-zinc-100 px-2 py-1 rounded-md text-xs"
                >
                  {typeof tag === 'string' ? tag : tag.title}
                </span>
              ))}
            </div>
            <div className="flex gap-2 w-full flex-wrap items-center mt-3">
              {project.projectLink && (
                <Button variant="default" asChild>
                  <Link href={project.projectLink || 'https://veiag.dev'}>
                    Website
                    <ArrowUpRight />
                  </Link>
                </Button>
              )}
              {project.githubLink && (
                <Button variant="ghostBlurry" asChild size={'icon'}>
                  <Link href={project.githubLink || 'https://github.com/VeiaG'}>
                    <Github />
                  </Link>
                </Button>
              )}
              {project.figmaLink && (
                <Button variant="ghostBlurry" asChild size={'icon'}>
                  <Link href={project.figmaLink || 'https://www.figma.com/@veiag'}>
                    <Figma />
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="py-6 mt-8 container mx-auto max-w-[1280px] text-lg">
        <RichText data={project.content} />
      </div>
    </div>
  )
}
export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '', locale = 'en' } = await paramsPromise
  const project = await queryProjectBySlug({ slug, locale })

  return generateMeta({ doc: project })
}
const queryProjectBySlug = cache(
  async ({ slug, locale }: { slug: string; locale: AvaibleLocale }) => {
    const payload = await getPayload({ config: config })

    const result = await payload.find({
      collection: 'projects',
      limit: 1,
      pagination: false,
      overrideAccess: false,
      depth: 2,
      where: {
        slug: {
          equals: slug,
        },
      },
      locale: locale,
    })

    return result.docs?.[0] || null
  },
)
export default ProjectPage
