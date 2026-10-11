import { useState } from 'react'
import { Maximize2, Star } from 'lucide-react'
import { CONFIG } from '../../config'
import { audio } from '../../utils/audio'

const TILTS = [-2.5, 2, -1.5, 2.5, -2, 1.5, -1]

export default function Scrapbook({ onExpand }) {
  const [flipped, setFlipped] = useState(null)

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {CONFIG.photos.map((photo, i) => {
        const isFlipped = flipped === photo.id
        return (
          <div
            key={photo.id}
            className="relative"
            style={{ transform: `rotate(${TILTS[i % TILTS.length]}deg)` }}
          >
            <button
              onClick={() => {
                audio.flip()
                setFlipped(isFlipped ? null : photo.id)
              }}
              aria-pressed={isFlipped}
              aria-label={`${photo.title}. Tap to ${isFlipped ? 'show the photo' : 'read the note'}`}
              className="flip-scene block aspect-[5/5.6] w-full text-left"
            >
              <div className="flip-inner relative h-full w-full" data-flipped={isFlipped}>
                <div className="flip-face polaroid absolute inset-0 flex flex-col">
                  <div className="relative min-h-0 flex-1 overflow-hidden rounded-[3px] bg-violet-50">
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      loading="lazy"
                      draggable={false}
                      className="h-full w-full object-cover"
                      style={{ objectPosition: photo.focus }}
                    />
                    <span className="absolute left-2 top-2 rounded-full bg-white/85 px-2.5 py-0.5 text-[11px] font-bold text-ink shadow">
                      {photo.vibe}
                    </span>
                  </div>
                  <div className="pt-2 text-center">
                    <p className="font-hand text-2xl font-bold leading-tight text-ink">{photo.title}</p>
                    <p className="text-[11px] font-medium text-ink/45">Tap to read the note</p>
                  </div>
                </div>

                <div className="flip-face flip-back card absolute inset-0 flex flex-col items-center justify-center rounded-md border-2 border-pink-200 bg-gradient-to-br from-white to-pink-50 p-6 text-center">
                  <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-pink-100 text-pink-600">
                    <Star className="h-5 w-5 fill-pink-500" aria-hidden />
                  </span>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-pink-600">{photo.title}</p>
                  <p className="mt-2 font-hand text-2xl font-semibold leading-snug text-ink">{photo.note}</p>
                  <p className="mt-4 text-[11px] font-medium text-ink/45">Tap to flip back</p>
                </div>
              </div>
            </button>

            {/* Sibling of the flip button (not nested) so both stay valid, focusable controls */}
            <button
              onClick={() => onExpand(i)}
              aria-label={`View ${photo.title} full size`}
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink shadow transition hover:bg-white"
            >
              <Maximize2 className="h-4 w-4" aria-hidden />
            </button>
          </div>
        )
      })}
    </div>
  )
}
