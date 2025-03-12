import { cn } from '@/lib/utils'

const NoiseOverlay = ({ className }: { className?: string }) => {
  return (
    <span
      className={cn(
        "absolute top-0 left-0 w-full h-full pointer-events-none bg-repeat mix-blend-overlay bg-[url('/images/noise.png')]",
        className,
      )}
    />
  )
}

export default NoiseOverlay
