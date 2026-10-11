import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, Award, Check, Layers, RotateCcw } from 'lucide-react'
import { CONFIG } from '../../config'
import { audio } from '../../utils/audio'
import { burst } from '../../utils/confetti'
import StageHeader from './StageHeader'

const PAIRS = Math.min(6, CONFIG.photos.length)

function shuffle(list) {
  const a = [...list]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildDeck() {
  const picks = shuffle(CONFIG.photos).slice(0, PAIRS)
  return shuffle(picks.flatMap((p) => [{ ...p, key: `${p.id}-a` }, { ...p, key: `${p.id}-b` }]))
}

export default function MemoryGame({ onNext, onUnlock, done }) {
  const [deck, setDeck] = useState(buildDeck)
  const [open, setOpen] = useState([]) // indices currently face-up (max 2)
  const [matched, setMatched] = useState([]) // photo ids
  const [moves, setMoves] = useState(0)
  const [note, setNote] = useState(null)
  const lock = useRef(false)
  const timers = useRef([])

  const later = (fn, ms) => {
    const t = setTimeout(fn, ms)
    timers.current.push(t)
  }
  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const won = matched.length === PAIRS

  const reset = useCallback(() => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    lock.current = false
    setDeck(buildDeck())
    setOpen([])
    setMatched([])
    setMoves(0)
    setNote(null)
  }, [])

  const flipCard = (i) => {
    if (lock.current || won || open.includes(i) || matched.includes(deck[i].id)) return
    audio.flip()
    const nextOpen = [...open, i]
    setOpen(nextOpen)
    if (nextOpen.length < 2) return

    lock.current = true
    setMoves((m) => m + 1)
    const [a, b] = nextOpen.map((n) => deck[n])
    if (a.id === b.id) {
      later(() => {
        audio.match()
        burst('default')
        const next = [...matched, a.id]
        setMatched(next)
        setOpen([])
        setNote(a)
        lock.current = false
        if (next.length === PAIRS) {
          audio.fanfare()
          burst('cannon')
          onUnlock('memory')
        }
      }, 450)
    } else {
      later(() => {
        audio.oops()
        setOpen([])
        lock.current = false
      }, 900)
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <StageHeader icon={Layers} kicker="Trial 1 / Memory match" title="Match the moments">
        Flip two cards at a time and find all {PAIRS} pairs.
        <div className="mt-5 flex items-center justify-center gap-3 sm:gap-5">
          <Stat label="Moves" value={moves} />
          <Stat label="Pairs" value={`${matched.length}/${PAIRS}`} accent />
          <button
            onClick={() => {
              audio.pop()
              reset()
            }}
            className="btn-soft flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold"
          >
            <RotateCcw className="h-4 w-4" aria-hidden /> Restart
          </button>
        </div>
      </StageHeader>

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4">
        {deck.map((card, i) => {
          const isMatched = matched.includes(card.id)
          const faceUp = open.includes(i) || isMatched
          return (
            <button
              key={card.key}
              onClick={() => flipCard(i)}
              disabled={isMatched}
              aria-label={faceUp ? `${card.title}, revealed` : 'Hidden card, tap to flip'}
              className="flip-scene aspect-square w-full select-none rounded-2xl"
            >
              <div className="flip-inner relative h-full w-full" data-flipped={faceUp}>
                <div className="flip-face card absolute inset-0 flex items-center justify-center rounded-2xl bg-gradient-to-br from-pink-100 via-white to-violet-100">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-violet-500 font-serif text-xl font-bold text-white shadow">
                    ?
                  </span>
                </div>
                <div
                  className={`flip-face flip-back absolute inset-0 overflow-hidden rounded-2xl border-[3px] bg-white shadow-lg ${
                    isMatched ? 'border-emerald-400' : 'border-pink-300'
                  }`}
                >
                  <img
                    src={card.src}
                    alt={card.alt}
                    loading="lazy"
                    draggable={false}
                    className="h-full w-full object-cover"
                    style={{ objectPosition: card.focus }}
                  />
                  {isMatched && (
                    <span className="absolute right-1.5 top-1.5 rounded-full bg-emerald-500 p-0.5 text-white shadow">
                      <Check className="h-3.5 w-3.5" aria-hidden />
                    </span>
                  )}
                </div>
              </div>
            </button>
          )
        })}
      </div>

      <div aria-live="polite" className={won ? '' : 'min-h-[76px]'}>
        <AnimatePresence mode="wait">
          {note && !won && (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="glass mx-auto max-w-md rounded-2xl p-4 text-center"
            >
              <p className="text-xs font-bold uppercase tracking-wider text-pink-600">{note.title}</p>
              <p className="mt-1 font-hand text-xl font-semibold text-ink">{note.note}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {won && (
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card mx-auto max-w-md rounded-3xl border-2 border-emerald-300 p-6 text-center"
        >
          <span className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <Award className="h-7 w-7" aria-hidden />
          </span>
          <h2 className="font-serif text-2xl font-semibold text-ink">Trial 1 cleared</h2>
          <p className="mt-1 text-sm text-ink/70">
            All pairs found in <strong className="text-pink-600">{moves} moves</strong>. Badge unlocked:{' '}
            <strong className="text-emerald-600">Memory Keeper</strong>.
          </p>
          <button onClick={onNext} className="btn-primary mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-3.5 font-bold">
            Next: Fortune Quiz <ArrowRight className="h-4 w-4" aria-hidden />
          </button>
        </motion.div>
      )}

      {!won && done && (
        <p className="text-center text-sm text-ink/60">
          You already earned this badge.{' '}
          <button onClick={onNext} className="font-semibold text-violet-600 underline underline-offset-4">
            Skip ahead
          </button>
        </p>
      )}
    </div>
  )
}

function Stat({ label, value, accent }) {
  return (
    <div className="rounded-xl bg-violet-50 px-4 py-2 text-center shadow-inner">
      <span className="block text-[11px] font-semibold uppercase tracking-wider text-ink/55">{label}</span>
      <span className={`font-serif text-xl font-bold ${accent ? 'text-pink-600' : 'text-ink'}`}>{value}</span>
    </div>
  )
}
