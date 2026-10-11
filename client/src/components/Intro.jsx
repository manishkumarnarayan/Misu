import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, Heart, Sparkles, Volume2 } from 'lucide-react'
import { CONFIG } from '../config'
import { audio } from '../utils/audio'
import { burst } from '../utils/confetti'

// Deterministic star field (no random layout jumps between renders)
const STARS = Array.from({ length: 36 }, (_, i) => ({
  top: (i * 37 + 11) % 97,
  left: (i * 53 + 7) % 97,
  size: i % 4 === 0 ? 3 : 2,
  delay: (i * 0.37) % 4,
}))

export default function Intro({ onEnter }) {
  const [step, setStep] = useState(0)
  const [leaving, setLeaving] = useState(false)
  const slides = CONFIG.intro
  const last = step === slides.length - 1

  // Auto-advance, but never past the last slide, and stop once she interacts.
  useEffect(() => {
    if (last) return
    const t = setTimeout(() => setStep((s) => s + 1), 4200)
    return () => clearTimeout(t)
  }, [step, last])

  const enter = () => {
    if (leaving) return
    setLeaving(true)
    audio.init()
    audio.fanfare()
    audio.startMusic()
    burst('cannon')
    setTimeout(onEnter, 700)
  }

  const advance = () => {
    audio.init()
    audio.pop(1 + step * 0.15)
    setStep((s) => Math.min(s + 1, slides.length - 1))
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-night px-4 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: leaving ? 0 : 1, scale: leaving ? 1.04 : 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7 }}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/4 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-600/20 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/5 h-80 w-80 rounded-full bg-violet-600/25 blur-[100px]" />
        <div className="absolute left-1/5 top-1/3 h-64 w-64 rounded-full bg-amber-400/10 blur-[90px]" />
        {STARS.map((s, i) => (
          <span
            key={i}
            className="twinkle absolute rounded-full bg-white"
            style={{
              top: `${s.top}%`,
              left: `${s.left}%`,
              width: s.size,
              height: s.size,
              animationDelay: `${s.delay}s`,
              boxShadow: '0 0 6px rgba(255,255,255,0.8)',
            }}
          />
        ))}
      </div>

      <div className="glass-dark relative z-10 w-full max-w-lg rounded-3xl p-6 text-center sm:p-10">
        <div className="mb-6 flex items-center justify-center gap-2" role="tablist" aria-label="Story progress">
          {slides.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === step}
              aria-label={`Slide ${i + 1}`}
              onClick={() => setStep(i)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === step ? 'w-8 bg-gradient-to-r from-pink-400 to-amber-300' : 'w-2 bg-white/25 hover:bg-white/45'
              }`}
            />
          ))}
        </div>

        <div className="flex min-h-[230px] flex-col items-center justify-center" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 14, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -12, filter: 'blur(4px)' }}
              transition={{ duration: 0.4 }}
              className="space-y-4"
            >
              <span className="inline-flex items-center gap-1.5 rounded-full border border-pink-400/30 bg-white/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-pink-200">
                <Sparkles className="h-3 w-3 text-amber-300" aria-hidden />
                {slides[step].kicker}
              </span>
              <h1 className="font-serif text-2xl font-semibold leading-tight text-white sm:text-4xl">
                {slides[step].title}
              </h1>
              <p className="mx-auto max-w-md text-sm leading-relaxed text-violet-100/80 sm:text-base">
                {slides[step].body}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-8 flex flex-col items-center gap-3">
          {last ? (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={enter}
              className="btn-primary flex w-full items-center justify-center gap-3 rounded-2xl px-7 py-4 text-base font-bold sm:text-lg"
            >
              <Sparkles className="h-5 w-5 text-amber-200" aria-hidden />
              <span>Open {CONFIG.recipient.nick}&rsquo;s surprise</span>
              <Heart className="h-4 w-4 fill-white" aria-hidden />
            </motion.button>
          ) : (
            <button
              onClick={advance}
              className="group flex w-full items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-medium text-violet-100 transition hover:bg-white/10 sm:w-auto"
            >
              Continue the story
              <ArrowRight className="h-4 w-4 text-pink-300 transition-transform group-hover:translate-x-1" aria-hidden />
            </button>
          )}
          {!last && (
            <button onClick={enter} className="text-xs text-violet-300/70 underline underline-offset-4 hover:text-pink-200">
              Skip to the surprise
            </button>
          )}
          <p className="mt-1 flex items-center gap-1.5 text-[11px] text-violet-300/60">
            <Volume2 className="h-3 w-3" aria-hidden /> Music starts when you open the surprise. You can mute it any time.
          </p>
        </div>
      </div>
    </motion.div>
  )
}
