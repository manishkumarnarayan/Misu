import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, Award, RotateCcw, Wand2 } from 'lucide-react'
import { CONFIG } from '../../config'
import { audio } from '../../utils/audio'
import { burst } from '../../utils/confetti'
import StageHeader from './StageHeader'

const { questions, fortunes, reading } = CONFIG.quiz

export default function FortuneQuiz({ onNext, onUnlock, done }) {
  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState(null)
  const [tally, setTally] = useState({})
  const [result, setResult] = useState(null)

  const q = questions[index]

  const choose = (opt, i) => {
    if (picked !== null) return
    audio.sparkle()
    setPicked(i)
    const nextTally = { ...tally, [opt.trait]: (tally[opt.trait] || 0) + 1 }
    setTally(nextTally)

    setTimeout(() => {
      if (index + 1 < questions.length) {
        setIndex(index + 1)
        setPicked(null)
      } else {
        // Highest tally wins; the earliest question's pick breaks ties.
        const top = Object.entries(nextTally).sort((a, b) => b[1] - a[1])[0][0]
        setResult(fortunes[top])
        audio.fanfare()
        burst('hearts')
        onUnlock('fortune')
      }
    }, 650)
  }

  const restart = () => {
    audio.pop()
    setIndex(0)
    setPicked(null)
    setTally({})
    setResult(null)
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <StageHeader icon={Wand2} kicker="Trial 2 / Fortune quiz" title="What does your year hold?">
        There are no wrong answers. Go with your gut.
      </StageHeader>

      {!result ? (
        <div className="card rounded-3xl p-5 sm:p-8">
          <div className="mb-5 flex items-center gap-3" aria-label={`Question ${index + 1} of ${questions.length}`}>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-violet-100">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-pink-500 to-violet-500"
                animate={{ width: `${((index + (picked !== null ? 1 : 0)) / questions.length) * 100}%` }}
              />
            </div>
            <span className="text-xs font-bold tabular-nums text-ink/60">
              {index + 1}/{questions.length}
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.25 }}
            >
              <h2 className="font-serif text-xl font-semibold text-ink sm:text-2xl">{q.q}</h2>
              <div className="mt-5 grid gap-3">
                {q.options.map((opt, i) => {
                  const selected = picked === i
                  return (
                    <button
                      key={opt.text}
                      onClick={() => choose(opt, i)}
                      disabled={picked !== null}
                      className={`rounded-2xl border-2 px-4 py-3.5 text-left text-sm font-medium transition sm:text-base ${
                        selected
                          ? 'border-pink-500 bg-pink-50 text-ink shadow-md'
                          : 'border-violet-100 bg-white text-ink hover:border-pink-300 hover:bg-pink-50/60 disabled:opacity-60'
                      }`}
                    >
                      {opt.text}
                    </button>
                  )
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.93 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card rounded-3xl border-2 border-violet-200 bg-gradient-to-b from-white to-pink-50/70 p-6 text-center sm:p-10"
        >
          <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-violet-100 text-violet-600">
            <Award className="h-7 w-7" aria-hidden />
          </span>
          <p className="text-xs font-bold uppercase tracking-widest text-pink-600">Your fortune</p>
          <h2 className="gradient-text mt-1 font-hand text-5xl font-bold sm:text-6xl">{result.title}</h2>
          <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-ink/80">{result.text}</p>
          <p className="mt-4 font-hand text-xl text-ink/60">{reading}</p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button onClick={restart} className="btn-soft inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold">
              <RotateCcw className="h-4 w-4" aria-hidden /> Try another fortune
            </button>
            <button onClick={onNext} className="btn-primary inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3 font-bold">
              Next: Cake and Wish <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </motion.div>
      )}

      {!result && done && (
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
