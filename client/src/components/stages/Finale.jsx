import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Check, Heart, MessageCircle, PartyPopper, RotateCcw, Share2, Sparkles } from 'lucide-react'
import { CONFIG, TURNING_AGE } from '../../config'
import { audio } from '../../utils/audio'
import { burst } from '../../utils/confetti'
import ScratchCard from '../finale/ScratchCard'
import Scrapbook from '../finale/Scrapbook'
import Lightbox from '../finale/Lightbox'

export default function Finale({ onReplay }) {
  const [revealed, setRevealed] = useState(false)
  const [lightbox, setLightbox] = useState(null)
  const [shared, setShared] = useState(false)
  const letterRef = useRef(null)
  const { letter } = CONFIG

  // Celebrate once when this page opens (guarded so React StrictMode doesn't fire it twice)
  const celebrated = useRef(false)
  useEffect(() => {
    if (celebrated.current) return
    celebrated.current = true
    burst('grand')
    audio.fanfare()
  }, [])

  const onReveal = () => {
    audio.fanfare()
    burst('hearts')
    setRevealed(true)
    setTimeout(() => letterRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 500)
  }

  const share = async () => {
    const url = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({ title: `Happy Birthday, ${CONFIG.recipient.nick}`, url })
      } else {
        await navigator.clipboard.writeText(url)
        setShared(true)
        setTimeout(() => setShared(false), 2500)
      }
    } catch {
      /* user cancelled the share sheet */
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-14">
      <motion.section
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="card relative overflow-hidden rounded-3xl border-2 border-pink-200 bg-gradient-to-b from-white via-pink-50/60 to-violet-50 p-6 text-center sm:p-12"
      >
        <div aria-hidden className="absolute -left-12 -top-12 h-48 w-48 rounded-full bg-pink-300/30 blur-3xl" />
        <div aria-hidden className="absolute -bottom-12 -right-12 h-48 w-48 rounded-full bg-violet-300/30 blur-3xl" />
        <div className="relative">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-pink-100 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-pink-700">
            <PartyPopper className="h-4 w-4" aria-hidden /> The grand finale
          </span>
          <h1 className="font-serif text-4xl font-semibold leading-tight text-ink sm:text-6xl">
            Happy Birthday,
            <span className="gradient-text mt-1 block font-hand text-7xl font-bold sm:text-9xl">{CONFIG.recipient.nick}</span>
          </h1>
          <p className="mx-auto mt-4 max-w-md text-base text-ink/75 sm:text-lg">
            {TURNING_AGE ? `Here is to ${TURNING_AGE} wonderful years, ` : 'Here is to another wonderful year, '}
            and to a day that is entirely about you.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => {
                audio.fanfare()
                burst('grand')
              }}
              className="btn-primary inline-flex items-center gap-2 rounded-2xl px-6 py-3 font-bold"
            >
              <Sparkles className="h-4 w-4" aria-hidden /> Fireworks
            </button>
            <button
              onClick={() => {
                audio.sparkle()
                burst('hearts')
              }}
              className="btn-soft inline-flex items-center gap-2 rounded-2xl px-6 py-3 font-bold"
            >
              <Heart className="h-4 w-4 fill-rosepink text-rosepink" aria-hidden /> Shower of hearts
            </button>
          </div>
        </div>
      </motion.section>

      <section aria-labelledby="letter-title" className="space-y-6">
        <div className="text-center">
          <h2 id="letter-title" className="font-serif text-2xl font-semibold text-ink sm:text-3xl">
            A letter from {CONFIG.from.name}
          </h2>
          <p className="mt-1 text-sm text-ink/65">Scratch the card to open it.</p>
        </div>

        <ScratchCard onReveal={onReveal} />

        <AnimatePresence>
          {revealed && (
            <motion.article
              ref={letterRef}
              initial={{ opacity: 0, height: 0, y: 20 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="overflow-hidden"
            >
              <div className="card mx-auto max-w-2xl rounded-3xl p-6 sm:p-10">
                <p className="font-hand text-4xl font-bold text-pink-600">{letter.greeting}</p>
                <div className="mt-4 space-y-4 text-base leading-relaxed text-ink/85">
                  {letter.paragraphs.map((p, i) => (
                    <motion.p
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + i * 0.5 }}
                    >
                      {p}
                    </motion.p>
                  ))}
                </div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 + letter.paragraphs.length * 0.5 }}
                  className="mt-8 border-t border-pink-100 pt-5"
                >
                  <p className="text-sm font-medium text-ink/60">{letter.signoff}</p>
                  <p className="font-hand text-4xl font-bold text-violet-700">{letter.signature}</p>
                </motion.div>
              </div>
            </motion.article>
          )}
        </AnimatePresence>
      </section>

      <section aria-labelledby="scrapbook-title" className="space-y-6">
        <div className="text-center">
          <h2 id="scrapbook-title" className="font-serif text-2xl font-semibold text-ink sm:text-3xl">
            The {CONFIG.recipient.nick} scrapbook
          </h2>
          <p className="mt-1 text-sm text-ink/65">Tap a photo to read the note on its back, or expand it to see it big.</p>
        </div>
        <Scrapbook onExpand={setLightbox} />
      </section>

      {CONFIG.videos.length > 0 && (
        <section aria-labelledby="videos-title" className="space-y-6">
          <h2 id="videos-title" className="text-center font-serif text-2xl font-semibold text-ink sm:text-3xl">
            Little moments
          </h2>
          <div className="grid gap-5 sm:grid-cols-2">
            {CONFIG.videos.map((v) => (
              <figure key={v.src} className="card overflow-hidden rounded-2xl">
                <video src={v.src} poster={v.poster} controls playsInline preload="metadata" className="aspect-video w-full bg-night" />
                {v.title && <figcaption className="p-3 text-center font-hand text-xl font-semibold text-ink">{v.title}</figcaption>}
              </figure>
            ))}
          </div>
        </section>
      )}

      <div className="flex flex-col items-center justify-center gap-3 pb-4 sm:flex-row">
        {CONFIG.replyUrl && (
          <a
            href={CONFIG.replyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center gap-2 rounded-2xl px-6 py-3 font-bold"
          >
            <MessageCircle className="h-4 w-4" aria-hidden /> Say thanks to {CONFIG.from.name}
          </a>
        )}
        <button onClick={share} className="btn-soft inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold">
          {shared ? <Check className="h-4 w-4 text-emerald-600" aria-hidden /> : <Share2 className="h-4 w-4" aria-hidden />}
          {shared ? 'Link copied' : 'Share this surprise'}
        </button>
        <button
          onClick={() => {
            audio.pop()
            onReplay()
          }}
          className="btn-soft inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold"
        >
          <RotateCcw className="h-4 w-4" aria-hidden /> Replay from the start
        </button>
      </div>

      <AnimatePresence>
        {lightbox !== null && <Lightbox index={lightbox} onChange={setLightbox} onClose={() => setLightbox(null)} />}
      </AnimatePresence>
    </div>
  )
}
