type FrontmatterLine = { key: string; value: string }

type Props = {
  /** e.g. "blog/my-post.md" */
  filePath: string
  /** e.g. "cat blog/my-post.md" */
  cmd: string
  frontmatter: FrontmatterLine[]
}

/** Terminal window with macOS-style dots + frontmatter display. */
export default function TerminalFileHeader({ filePath, cmd, frontmatter }: Props) {
  return (
    <div className="bg-term-bg2 border border-term-border mb-10">
      {/* Title bar */}
      <div className="bg-term-bg3 border-b border-term-border px-4 py-2 flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-term-red    shrink-0" />
        <span className="w-2.5 h-2.5 rounded-full bg-term-amber  shrink-0" />
        <span className="w-2.5 h-2.5 rounded-full bg-term-green  shrink-0" />
        <span className="text-term-dim text-[11px] ml-2 font-mono">
          <span className="text-term-amber">~/</span>
          {filePath}
        </span>
      </div>

      {/* Body */}
      <div className="px-5 py-4 text-[12px] leading-[2] font-mono">
        <div>
          <span className="text-term-amber">roman@veiag.dev</span>
          <span className="text-term-dim">:</span>
          <span className="text-term-amber">~</span>
          {' $ '}
          <span className="text-term-bright">{cmd}</span>
        </div>
        <div className="text-term-dim">---</div>
        {frontmatter.map(({ key, value }) => (
          <div key={key}>
            <span className="text-term-blue">{key}:</span>
            {' '}
            <span className="text-term-text">{value}</span>
          </div>
        ))}
        <div className="text-term-dim">---</div>
      </div>
    </div>
  )
}
