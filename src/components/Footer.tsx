import Link from 'next/link'
import { Button } from './ui/button'
import { Figma, Github, Linkedin, Mail } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="border-t py-4 mt-12">
      <div className="container mx-auto flex gap-2 justify-between items-center">
        <div>
          © {new Date().getFullYear()} veiag.dev
          <span className="hidden md:inline">. All rights reserved.</span>
        </div>
        <div className="flex gap-2 items-center">
          <Button variant="ghost" size="icon" asChild>
            <Link href="https://www.linkedin.com/in/veiag/" target="_blank">
              <Linkedin />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href="https://www.figma.com/@veiag">
              <Figma />
            </Link>
          </Button>

          <Button variant="ghost" size="icon" asChild>
            <Link href="https://github.com/VeiaG" target="_blank">
              <Github />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href="mailto:veiag.work@gmail.com">
              <Mail />
            </Link>
          </Button>
        </div>
      </div>
    </footer>
  )
}

export default Footer
