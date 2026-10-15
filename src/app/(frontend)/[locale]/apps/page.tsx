import { getPayload } from 'payload'
import config from '@payload-config'
import AppCard from '@/components/AppCard'
import { AvaibleLocale } from '@/i18n/routing'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import RichText from '@/components/RichText'

export const metadata = {
  title: 'Apps — veiag.dev',
  description: 'Small apps and tools — free to use.',
}

type Props = {
  params: Promise<{ locale: AvaibleLocale }>
}

export default async function AppsPage({ params }: Props) {
  const { locale } = await params

  const payload = await getPayload({ config })
  const apps    = await payload.find({
    collection: 'apps',
    depth: 1,
    limit: 0,
    sort: '_order',
    overrideAccess: false,
    select: { title: true, description: true, url: true, githubLink: true, tags: true, image: true, madeWithAI: true },
    populate: { 'project-tags': { title: true } },
    locale,
  })

  const appsPage = await payload.findGlobal({ slug: 'apps-page', locale })

  const t = await getTranslations('AppsPage')

  return (
    <div className="max-w-[1000px] mx-auto px-4 sm:px-8">

      {/* Page header */}
      <div className="pb-10 pt-12 border-b border-term-border mb-0">
        <div className="text-muted text-[12px] font-mono mb-2">
          <span className="text-term-blue">roman</span>
          <span className="text-term-dim">@</span>
          <span className="text-term-amber">veiag.dev</span>
          <span className="text-term-dim">:~ $</span>
        </div>
        <div className="text-term-bright text-[13px] font-mono mb-6">
          ls ./apps
        </div>
        <h1 className="text-[30px] font-bold text-term-bright tracking-tight mb-2">
          {t('titleStart')} <span className="text-term-amber">{t('titleAccent')}</span>
        </h1>
        {appsPage.intro && (
          <RichText data={appsPage.intro} className="mx-0 max-w-[600px] prose-sm text-term-muted" />
        )}
      </div>

      {apps.docs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-term-border border border-term-border border-t-0 animate-fade-in-up">
          {apps.docs.map((app, i) => (
            <AppCard
              key={app.id}
              title={app.title}
              description={app.description}
              url={app.url}
              githubLink={app.githubLink}
              tags={app.tags}
              image={app.image}
              madeWithAI={app.madeWithAI}
              index={i}
            />
          ))}
        </div>
      ) : (
        <p className="text-term-dim text-[12px] font-mono py-10">{t('empty')}</p>
      )}

      <div className="py-8 text-[12px] font-mono text-term-dim">
        {'// '}
        <Link href="/projects" className="text-term-muted hover:text-term-amber transition-colors">
          {t('backToProjects')}
        </Link>
      </div>
    </div>
  )
}
