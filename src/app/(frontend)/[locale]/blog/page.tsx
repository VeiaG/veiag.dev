import { getPayload } from 'payload'
import config from '@payload-config'
import PostCard from '@/components/PostCard'
import CollectionPagination from '@/components/CollectionPagination'
import TerminalPrompt from '@/components/TerminalPrompt'
import TerminalCursor from '@/components/TerminalCursor'
import TerminalTag from '@/components/TerminalTag'
import { AvaibleLocale } from '@/i18n/routing'

export const metadata = {
  title: 'Blog — veiag.dev',
  description: 'Writing about web development, tools, and open-source.',
}

type Props = {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
  params: Promise<{ locale: AvaibleLocale }>
}

export default async function BlogPage({ searchParams, params }: Props) {
  const sp     = await searchParams
  const page   = sp?.page ? Number(sp.page) : 1
  const filter = typeof sp?.tag === 'string' ? sp.tag : null
  const { locale } = await params

  const payload = await getPayload({ config })

  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 8,
    sort: '_order',
    page,
    overrideAccess: false,
    select: { title: true, slug: true, shortDescription: true, image: true, categories: true, publishedAt: true },
    populate: { 'post-categories': { title: true } },
    locale,
  })

  /* Gather all tags from current posts for the filter bar */
  const allTags = Array.from(
    new Set(
      posts.docs.flatMap(p =>
        (p.categories ?? []).map(c => (typeof c === 'string' ? c : c.title)),
      ),
    ),
  )

  const displayed = filter
    ? posts.docs.filter(p =>
        (p.categories ?? []).some(c => (typeof c === 'string' ? c : c.title) === filter),
      )
    : posts.docs

  return (
    <div className="max-w-[860px] mx-auto px-4 sm:px-8">

      {/* Page header */}
      <div className="pb-10 pt-12 border-b border-term-border mb-0">
        <div className="text-term-muted text-[12px] font-mono mb-2">
          <span className="text-term-blue">roman</span>
          <span className="text-term-dim">@</span>
          <span className="text-term-amber">veiag.dev</span>
          <span className="text-term-dim">:~ $</span>
        </div>
        <div className="text-term-bright text-[13px] font-mono mb-6">
          ls -la ./blog --sort=date --reverse
        </div>
        <h1 className="text-[30px] font-bold text-term-bright tracking-tight mb-2">
          Blog <span className="text-term-amber">Posts</span>
        </h1>
        <p className="text-term-muted text-[12px]">
          {posts.totalDocs} article{posts.totalDocs !== 1 ? 's' : ''} found · writing about web dev, tools &amp; open-source
        </p>
      </div>

      {/* Tag filter bar */}
      {allTags.length > 0 && (
        <div className="flex items-center gap-0 border-b border-term-border bg-term-bg2 px-4 flex-wrap">
          <span className="text-term-dim text-[11px] tracking-wider uppercase py-3 mr-3 shrink-0">
            FILTER:
          </span>
          <TagFilterLink label="all" active={!filter} />
          {allTags.map(tag => (
            <TagFilterLink key={tag} label={tag} active={filter === tag} />
          ))}
        </div>
      )}

      {/* Posts list */}
      <div className="border-x border-term-border animate-fade-in-up">
        {displayed.map((post, i) => (
          <PostCard
            key={post.id}
            title={post.title}
            description={post.shortDescription}
            categories={post.categories}
            image={post.image}
            slug={post.slug ?? ''}
            publishedAt={post.publishedAt}
            index={i}
          />
        ))}

        <div className="px-6 py-4 text-term-dim text-[12px] font-mono flex items-center gap-2 border-t border-term-border">
          <span className="text-term-amber">$</span>
          more posts coming soon
          <TerminalCursor />
        </div>
      </div>

      {posts.totalPages > 1 && (
        <div className="mt-6">
          <CollectionPagination totalPages={posts.totalPages} />
        </div>
      )}
    </div>
  )
}

function TagFilterLink({ label, active }: { label: string; active: boolean }) {
  return (
    <a
      href={label === 'all' ? '/blog' : `/blog?tag=${encodeURIComponent(label)}`}
      className={`
        px-4 py-3 text-[11px] font-mono border-r border-term-border transition-colors duration-150
        ${active
          ? 'text-term-amber bg-term-amber/5 hover:bg-term-amber/10'
          : 'text-term-muted hover:text-term-text hover:bg-term-bg3'
        }
      `}
    >
      {label}
    </a>
  )
}
