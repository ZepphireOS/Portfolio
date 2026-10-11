import { cn } from 'cn'
import type { LucideIcon } from 'lucide-react'
import { useState } from 'react'
import type { ImagePath } from '@/data/types'
import { assetUrl } from '@/lib/asset'

interface FigureProps {
  image?: ImagePath
  /** Shown instead when there's no image, or the image fails to load. */
  icon: LucideIcon
  alt: string
  className?: string
}

/** Image slot that never renders blank: a real image when there is one, otherwise a deliberate icon on a hatched ground. */
export function Figure({ image, icon: Icon, alt, className }: FigureProps) {
  const [failed, setFailed] = useState(false)

  if (image && !failed) {
    return (
      <img
        src={assetUrl(image)}
        alt={alt}
        onError={() => setFailed(true)}
        className={cn('w-full object-cover', className)}
      />
    )
  }
  return (
    <div
      aria-hidden="true"
      data-figure="icon"
      className={cn(
        'flex items-center justify-center bg-[repeating-linear-gradient(135deg,var(--border)_0_1px,transparent_1px_9px)] text-muted-foreground',
        className,
      )}
    >
      <Icon className="size-10" strokeWidth={1.5} />
    </div>
  )
}
