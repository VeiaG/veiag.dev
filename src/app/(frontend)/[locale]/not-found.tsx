import { Button } from '@/components/ui/button'
import { Link } from '@/i18n/navigation'

export default function NotFound() {
  return (
    <div className="container mx-auto flex justify-center items-center flex-col w-full min-h-[70vh]">
      <h2 className="text-2xl md:text-6xl font-bold">404</h2>
      <h3 className="text-xl md:text-2xl mt-2">Page Not Found</h3>

      <Button variant="outline" className="mt-4" asChild>
        <Link href="/">Return Home</Link>
      </Button>
    </div>
  )
}
