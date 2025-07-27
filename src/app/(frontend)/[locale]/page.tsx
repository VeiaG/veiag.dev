import React from 'react'
import config from '@payload-config'

import './styles.css'
import { Particles } from '@/components/Particles'
import { getPayload } from 'payload'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ArrowUpRight, FileText, Send } from 'lucide-react'
import ScrollButton from '@/components/ScrollButton'
import { Link } from '@/i18n/navigation'
import { Card, CardContent } from '@/components/ui/card'
import RichText from '@/components/RichText'
import ProjectCard from '@/components/ProjectCard'
import BlogCard from '@/components/PostCard'
import ExperienceCard from '@/components/ExperienceCard'
import { MotionSection } from '@/components/Motion'
import { AvaibleLocale } from '@/i18n/routing'
import NextLink from 'next/link'
import { getTranslations } from 'next-intl/server'

type Args = {
  params: Promise<{
    locale: AvaibleLocale
  }>
}
export default async function HomePage({ params }: Args) {
  const payload = await getPayload({ config: config })
  const { locale } = await params
  const homepage = await payload.findGlobal({
    slug: 'homepage',
    depth: 2,
    populate: {
      projects: {
        title: true,
        slug: true,
        image: true,
        tags: true,
        shortDescription: true,
      },
      posts: {
        title: true,
        slug: true,
        image: true,
        categories: true,
        shortDescription: true,
        publishedAt: true,
      },
    },
    locale: locale,
  })
  const t = await getTranslations('HomePage')
  const gT = await getTranslations('Globals')
  return (
    <div className="container mx-auto">
      <MotionSection
        className="relative flex flex-col gap-2 items-center min-h-[calc(100vh-128px)] pt-24 "
        initial={{ opacity: 0, y: -16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3 }}
      >
        <div className="aspect-square mx-auto relative overflow-hidden rounded-full w-[256px] h-[256px]">
          {typeof homepage.avatar !== 'string' && (
            <Image
              src={homepage.avatar.url || ''}
              alt="Avatar"
              fill
              className="object-cover"
              placeholder="blur"
              blurDataURL={homepage.avatar.blurDataUrl || ''}
            />
          )}
        </div>
        <h1 className="text-6xl font-bold text-center">{t('name')}</h1>
        <p className="text-xl font-light">{t('title')}</p>
        <div className="flex gap-2 mt-4">
          <Button asChild>
            <Link href="https://t.me/veiag" target="_blank">
              <Send />
              {t('contact')}
            </Link>
          </Button>
          {homepage.cv && typeof homepage.cv !== 'string' && (
            <Button variant="ghost" asChild>
              <NextLink href={homepage.cv.url || ''} target="_blank">
                <FileText />
                {t('downloadCV')}
              </NextLink>
            </Button>
          )}
        </div>
        <ScrollButton />
        <Particles className="absolute inset-0 -z-10" />
      </MotionSection>
      <MotionSection
        className="py-12 flex flex-col gap-2"
        initial={{ opacity: 0, y: -16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-5xl font-bold text-center">{t('featuredProjects')}</h1>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-12">
          {homepage.selectedProjects?.map((project, index) => {
            if (!project || typeof project === 'string') return null
            return (
              <ProjectCard
                key={index}
                title={project.title}
                description={project.shortDescription}
                tags={project.tags}
                image={project.image}
                slug={project?.slug || ''}
              />
            )
          })}
        </div>
        <Button variant="outline" className="ml-auto mt-4" asChild size="lg">
          <Link href="/projects">
            {t('viewAllProjects')}
            <ArrowUpRight />
          </Link>
        </Button>
      </MotionSection>

      <MotionSection
        initial={{ opacity: 0, y: -16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.3 }}
        className="py-12 grid gap-8 grid-cols-1 md:grid-cols-2 relative items-start"
        id="about"
      >
        <h1 className="text-5xl font-bold col-span-1 md:col-span-2 text-center">{t('aboutMe')}</h1>
        <div className="text-md lg:text-xl">
          {homepage.about && <RichText data={homepage.about} className="space-y-2" />}
        </div>
        <Card className="sticky top-24">
          <CardContent>
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl">{t('skills')}</h2>
              <div className="flex gap-2 flex-wrap items-center">
                {homepage.skills?.map((skill, index) => (
                  <div
                    key={index}
                    className="text-sm border rounded-full py-2 px-4 hover:bg-accent"
                  >
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </MotionSection>
      <MotionSection
        className="py-12 flex flex-col gap-2"
        initial={{ opacity: 0, y: -16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-5xl font-bold text-center">{t('blogPosts')}</h1>
        <div className="grid gap-4 grid-cols-1  lg:grid-cols-5 mt-12 relative">
          <div className="relative col-span-1 lg:col-span-3">
            {homepage.selectedPosts?.[0] && typeof homepage.selectedPosts[0] !== 'string' && (
              <BlogCard
                title={homepage.selectedPosts[0].title}
                description={homepage.selectedPosts[0].shortDescription}
                categories={homepage.selectedPosts[0].categories}
                image={homepage.selectedPosts[0].image}
                slug={homepage.selectedPosts[0]?.slug || ''}
                publishedAt={homepage.selectedPosts[0].publishedAt}
                className={`lg:sticky lg:top-24 ${homepage.selectedPosts.length < 5 ? 'h-full' : ''}`}
                isOnHomepage
                translation={{
                  readMore: gT('readMore'),
                }}
              />
            )}
          </div>
          <div className="flex flex-col gap-4 col-span- lg:col-span-2">
            {homepage.selectedPosts?.map((post, index) => {
              if (!post || typeof post === 'string') return null
              // Skip the first post
              if (index === 0) return null
              return (
                <BlogCard
                  key={index}
                  title={post.title}
                  description={post.shortDescription}
                  categories={post.categories}
                  image={post.image}
                  slug={post?.slug || ''}
                  publishedAt={post.publishedAt}
                  hideImage
                  isOnHomepage
                  translation={{
                    readMore: gT('readMore'),
                  }}
                />
              )
            })}
          </div>
        </div>
        <Button variant="outline" className="ml-auto mt-4" asChild size="lg">
          <Link href="/blog">
            {t('viewAllPosts')}
            <ArrowUpRight />
          </Link>
        </Button>
      </MotionSection>
      <section className="py-12 flex flex-col gap-12">
        <h1 className="text-5xl font-bold text-center">{t('workExperience')}</h1>
        <div className="flex flex-col gap-6 justify-center max-w-[800px] mx-auto">
          {homepage.workExperience?.map((job, index) => {
            if (!job || typeof job === 'string') return null
            return (
              <ExperienceCard
                key={index}
                position={job.position}
                location={job.location}
                company={job.company}
                startDate={job.startDate}
                endDate={job.endDate}
                description={job.description}
                isPresent={!!job.isPresent}
              />
            )
          })}
        </div>
      </section>
    </div>
  )
}
