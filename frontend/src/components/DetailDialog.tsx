import { ExternalLink, XIcon } from 'lucide-react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
import type { DetailContent } from '@/lib/details'
import { assetUrl } from '@/lib/asset'
import { Figure } from './Figure'

interface DetailDialogProps {
  content?: DetailContent
  open: boolean
  onOpenChange: (open: boolean) => void
  /** The element that opened the popup; focus returns here on close. */
  returnFocusTo?: HTMLElement | null
}

/**
 * The one popup shared by Skills, Timeline, and Projects. Radix handles the three
 * close paths (close button, outside click, Escape). It's opened from app state rather
 * than a Radix trigger, so focus is handed back to the opener explicitly.
 */
export function DetailDialog({ content, open, onOpenChange, returnFocusTo }: DetailDialogProps) {
  if (!content) return null
  const [cover, ...gallery] = content.images ?? []
  const hasPlaceholder = content.notes?.some((note) => !note.text)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[85svh] gap-0 overflow-y-auto rounded-none p-0 sm:max-w-lg"
        {...(!content.subtitle && { 'aria-describedby': undefined })}
        onCloseAutoFocus={(event) => {
          if (!returnFocusTo?.isConnected) return
          event.preventDefault()
          // preventScroll: closing must leave the page exactly where it was
          returnFocusTo.focus({ preventScroll: true })
        }}
      >
        <div className="relative">
          <Figure image={cover} icon={content.icon} alt={content.title} className="aspect-[21/9] border-b" />
          <DialogClose className="absolute top-3 right-3 flex size-8 cursor-pointer items-center justify-center border bg-background transition-colors hover:border-orange-600 hover:text-orange-600 focus-visible:ring-2 focus-visible:ring-orange-600 focus-visible:outline-none">
            <XIcon className="size-4" aria-hidden="true" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </div>

        <div className="p-6">
          <p className="font-mono text-[11px] tracking-widest text-orange-600 uppercase">{content.kind}</p>
          <DialogTitle className="mt-1 text-xl leading-tight font-bold">{content.title}</DialogTitle>
          {content.subtitle && <DialogDescription className="mt-1.5">{content.subtitle}</DialogDescription>}
          {content.dates && <p className="mt-2 font-mono text-xs text-muted-foreground">{content.dates}</p>}

          {content.summary && <p className="mt-4 text-sm">{content.summary}</p>}

          {content.bullets && content.bullets.length > 0 && (
            <ul className="mt-4 list-disc space-y-1.5 pl-5 text-sm leading-relaxed marker:text-muted-foreground">
              {content.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          )}

          {content.notes && (
            <dl className="mt-5 grid gap-3">
              {content.notes.map((note) => (
                <div key={note.label}>
                  <dt className="font-mono text-[11px] tracking-wider text-muted-foreground uppercase">{note.label}</dt>
                  <dd className="mt-1 text-sm">
                    {note.text ?? (
                      <span
                        data-placeholder
                        className="inline-block border border-dashed px-2 py-0.5 text-muted-foreground italic"
                      >
                        — add your notes here —
                      </span>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          )}
          {hasPlaceholder && (
            <p className="mt-4 font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
              Placeholder · notes not written yet
            </p>
          )}

          {gallery.length > 0 && (
            <div className="mt-5 grid grid-cols-2 gap-2">
              {gallery.map((image) => (
                <img key={image} src={assetUrl(image)} alt={content.title} className="aspect-video w-full border object-cover" />
              ))}
            </div>
          )}

          {content.link && (
            <a
              href={content.link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-1.5 border px-3 py-1.5 font-mono text-xs transition-colors hover:border-orange-600 hover:text-orange-600"
            >
              {content.link.label}
              <ExternalLink className="size-3.5" aria-hidden="true" />
            </a>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
