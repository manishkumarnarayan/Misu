import { useEffect, useRef } from 'react'
import { motion } from 'motion/react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { CONFIG } from '../../config'

export default function Lightbox({ index, onChange, onClose }) {
  const photos = CONFIG.photos
  const photo = photos[index]
  const closeRef = useRef(null)

  const prev = () => onChange((index - 1 + photos.length) % photos.length)
  const next = () => onChange((index + 1) % photos.length)

  useEffect(() => {
    const opener = document.activeElement
    closeRef.current?.focus()
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prevOverflow
      opener?.focus?.()
    }
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={photo.title}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-night/90 p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <button
        ref={closeRef}
        onClick={onClose}
        aria-label="Close photo"
        className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25"
      >
        <X className="h-5 w-5" aria-hidden />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation()
          prev()
        }}
        aria-label="Previous photo"
        className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25 sm:left-6"
      >
        <ChevronLeft className="h-6 w-6" aria-hidden />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation()
          next()
        }}
        aria-label="Next photo"
        className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25 sm:right-6"
      >
        <ChevronRight className="h-6 w-6" aria-hidden />
      </button>

      <figure className="max-h-full max-w-3xl text-center" onClick={(e) => e.stopPropagation()}>
        <img src={photo.src} alt={photo.alt} className="mx-auto max-h-[72vh] w-auto rounded-xl object-contain shadow-2xl" />
        <figcaption className="mt-4 text-white">
          <p className="font-serif text-xl font-semibold">{photo.title}</p>
          <p className="mx-auto mt-1 max-w-md font-hand text-xl text-pink-200">{photo.note}</p>
          <p className="mt-2 text-xs text-white/50">
            {index + 1} / {photos.length}
          </p>
        </figcaption>
      </figure>
    </motion.div>
  )
}
