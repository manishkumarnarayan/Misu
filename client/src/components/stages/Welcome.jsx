import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { ArrowRight, Check, Heart, Layers, Wand2, Cake, Clock } from 'lucide-react'
import { CONFIG, BIRTH, TURNING_AGE } from '../../config'
import { audio } from '../../utils/audio'
import { burst } from '../../utils/confetti'

const TRIALS = [
  { id: 'memory', icon: Layers, title: 'Trial 1: Memory Match', desc: 'Flip the cards and pair up the photos.' },
  { id: 'fortune', icon: Wand2, title: 'Trial 2: Fortune Quiz', desc: 'Four quick picks reveal your year ahead.' },
  { id: 'cake', icon: Cake, title: 'Trial 3: Cake and Wish', desc: 'Blow out the candles and make a wish.' },
]

function useLifeCounter() {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    if (!BIRTH) return
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])
  if (!BIRTH) return null
  const diff = Math.max(0, now - BIRTH.getTime())
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor(diff / 3600000) % 24,
    minutes: Math.floor(diff / 60000) % 60,
    seconds: Math.floor(diff / 1000) % 60,
  }
}

export default function Welcome({ badges, onGo, onNext }) {
  const life = useLifeCounter()
  const hero = CONFIG.photos.find((p) => p.id === 'hat') ?? CONFIG.photos[0]

  const start = () => {
    audio.sparkle()
    burst('default')
    onNext()
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <section className="grid items-center gap-6 md:grid-cols-[1.1fr_1fr] md:gap-10">
        <div className="order-2 text-center md:order-1 md:text-left">
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold text-ink"
          >
            <Heart className="h-3.5 w-3.5 fill-rosepink text-rosepink" aria-hidden />
            A surprise from {CONFIG.from.name}
          </motion.span>

          <h1 className="font-serif text-4xl font-semibold leading-[1.1] text-ink sm:text-5xl lg:text-6xl">
            {TURNING_AGE ? `Happy ${ordinal(TURNING_AGE)} Birthday,` : 'Happy Birthday,'}
            <span className="gradient-text mt-1 block font-hand text-6xl font-bold sm:text-7xl lg:text-8xl">
              {CONFIG.recipient.nick}
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-ink/75 md:mx-0">
            Today is entirely yours, {CONFIG.recipient.full}. Play three tiny games, make a wish, and unlock a
            letter that was written just for you.
          </p>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={start}
            className="btn-primary group mt-6 inline-flex items-center gap-3 rounded-2xl px-7 py-4 text-base font-bold"
          >
            Begin the celebration
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden />
          </motion.button>
        </div>

        <motion.div
          initial={{ opacity: 0, rotate: 4, y: 20 }}
          animate={{ opacity: 1, rotate: -2, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="order-1 mx-auto w-full max-w-sm md:order-2"
        >
          <div className="polaroid">
            <img
              src={hero.src}
              alt={hero.alt}
              className="aspect-[4/5] w-full rounded-[3px] object-cover"
              style={{ objectPosition: hero.focus }}
              fetchPriority="high"
            />
            <p className="mt-2 text-center font-hand text-2xl font-bold text-ink">{CONFIG.recipient.full}, today&rsquo;s star</p>
          </div>
        </motion.div>
      </section>

      {life && (
        <section aria-label="Time since birth" className="glass rounded-3xl p-5 text-center sm:p-6">
          <p className="mb-3 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-pink-600">
            <Clock className="h-4 w-4" aria-hidden /> Time spent making the world brighter
          </p>
          <div className="grid grid-cols-4 gap-2 sm:gap-4">
            {[
              ['Days', life.days.toLocaleString()],
              ['Hours', life.hours],
              ['Minutes', life.minutes],
              ['Seconds', life.seconds],
            ].map(([label, value]) => (
              <div key={label}>
                <div className="font-serif text-2xl font-bold tabular-nums text-ink sm:text-4xl">{value}</div>
                <div className="text-[11px] font-medium uppercase tracking-wide text-ink/60">{label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section aria-label="Your three trials" className="grid gap-3 sm:grid-cols-3">
        {TRIALS.map(({ id, icon: Icon, title, desc }, i) => {
          const done = badges.includes(id)
          return (
            <motion.button
              key={id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.08 }}
              whileHover={{ y: -4 }}
              onClick={() => {
                audio.pop()
                onGo(id)
              }}
              className={`card relative rounded-2xl p-5 text-left transition ${done ? 'ring-2 ring-emerald-400/70' : ''}`}
            >
              <span
                className={`mb-3 flex h-11 w-11 items-center justify-center rounded-xl ${
                  done ? 'bg-emerald-100 text-emerald-600' : 'bg-gradient-to-br from-pink-100 to-violet-100 text-violet-600'
                }`}
              >
                {done ? <Check className="h-5 w-5" aria-hidden /> : <Icon className="h-5 w-5" aria-hidden />}
              </span>
              <h2 className="text-sm font-bold text-ink">{title}</h2>
              <p className="mt-1 text-sm text-ink/65">{desc}</p>
              <span className="mt-3 inline-block text-xs font-semibold text-violet-600">{done ? 'Completed' : 'Tap to play'}</span>
            </motion.button>
          )
        })}
      </section>
    </div>
  )
}

function ordinal(n) {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}
