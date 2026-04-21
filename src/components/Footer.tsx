import { Link } from '@/i18n/navigation'
import { Github, Figma, Linkedin, Mail } from 'lucide-react'

const LINKS = [
  { href: 'https://www.linkedin.com/in/veiag/', Icon: Linkedin, label: 'LinkedIn' },
  { href: 'https://www.figma.com/@veiag',       Icon: Figma,    label: 'Figma'    },
  { href: 'https://github.com/VeiaG',            Icon: Github,   label: 'GitHub'   },
  { href: 'mailto:roman@veiag.dev',              Icon: Mail,     label: 'Email'    },
]

export default function Footer() {
  return (
    <footer className="border-t border-term-border bg-term-bg py-3 px-8">
      <div className="flex items-center justify-between gap-4 max-w-[900px] mx-auto">
        <span className="text-term-dim text-[11px] font-mono">
          © {new Date().getFullYear()} veiag.dev
        </span>
        <div className="flex items-center">
          {LINKS.map(({ href, Icon, label }) => (
            <Link
              key={label}
              href={href}
              target="_blank"
              aria-label={label}
              className="h-10 w-10 flex items-center justify-center text-term-dim hover:text-term-amber transition-colors duration-150"
            >
              <Icon size={14} />
            </Link>
          ))}
        </div>
      </div>
    </footer>
  )
}
