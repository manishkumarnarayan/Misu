import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { ArrowRight, Cake, Heart, Mic, MicOff, Wind } from 'lucide-react'
import { CANDLE_COUNT, CONFIG } from '../../config'
import { audio } from '../../utils/audio'
import { burst } from '../../utils/confetti'
import StageHeader from './StageHeader'

const blank = () => Array.from({ length: CANDLE_COUNT }, () => true)

export default function CakeWish({ onNext, onUnlock, done }) {
  const [lit, setLit] = useState(blank)
  const [puffs, setPuffs] = useState([]) // candle indices that just went out (smoke)
  const [wish, setWish] = useState('')
  const [mic, setMic] = useState('idle') // idle | listening | denied | unsupported
  const [finished, setFinished] = useState(false)

  const litRef = useRef(lit)
  litRef.current = lit
  const stopMicRef = useRef(null)

  const complete = useCallback(() => {
    setFinished(true)
    audio.fanfare()
    burst('grand')
    onUnlock('cake')
  }, [onUnlock])

  const snuff = useCallback(
    (indices) => {
      const current = litRef.current
      const toOut = indices.filter((i) => current[i])
      if (!toOut.length) return
      audio.blow()
      const next = current.map((on, i) => (toOut.includes(i) ? false : on))
      litRef.current = next
      setLit(next)
      setPuffs((p) => [...p, ...toOut])
      if (next.every((on) => !on)) {
        stopMicRef.current?.()
        complete()
      }
    },
    [complete],
  )

  const blowOne = useCallback(() => {
    const first = litRef.current.findIndex(Boolean)
    if (first >= 0) snuff([first])
  }, [snuff])

  // Real blowing: listen to the microphone and put candles out as the level stays high.
  const startMic = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setMic('unsupported')
      return
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
      })
      const ctx = audio.init()
      if (!ctx) throw new Error('no audio context')
      const source = ctx.createMediaStreamSource(stream)
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 1024
      source.connect(analyser)
      const buf = new Float32Array(analyser.fftSize)

      let raf = 0
      let last = performance.now()
      const startedAt = last
      let baseline = 0
      let baselineSamples = 0
      let power = 0

      const tick = (now) => {
        const dt = Math.min(0.1, (now - last) / 1000)
        last = now
        analyser.getFloatTimeDomainData(buf)
        let sum = 0
        for (let i = 0; i < buf.length; i++) sum += buf[i] * buf[i]
        const rms = Math.sqrt(sum / buf.length)

        if (now - startedAt < 700) {
          // Calibrate against room noise for the first moments
          baseline = (baseline * baselineSamples + rms) / (baselineSamples + 1)
          baselineSamples++
        } else if (rms > baseline * 2.6 + 0.05) {
          power += dt
          while (power >= 0.2) {
            power -= 0.2
            blowOne()
          }
        } else {
          power = Math.max(0, power - dt * 2)
        }
        raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)

      stopMicRef.current = () => {
        cancelAnimationFrame(raf)
        source.disconnect()
        stream.getTracks().forEach((t) => t.stop())
        stopMicRef.current = null
        setMic('idle')
      }
      setMic('listening')
    } catch {
      setMic('denied')
    }
  }

  useEffect(() => () => stopMicRef.current?.(), [])

  const reset = () => {
    audio.pop()
    stopMicRef.current?.()
    setLit(blank())
    litRef.current = blank()
    setPuffs([])
    setFinished(false)
  }

  const remaining = lit.filter(Boolean).length

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <StageHeader icon={Cake} kicker="Trial 3 / Cake and wish" title="Make a wish">
        Type a wish, then blow out every candle. Use the microphone and really blow, or just tap the flames.
      </StageHeader>

      <div className="card rounded-3xl p-5 sm:p-8">
        <label htmlFor="wish" className="mb-1.5 block text-sm font-semibold text-ink">
          Your wish <span className="font-normal text-ink/55">(only you can see this. It is never saved or sent.)</span>
        </label>
        <textarea
          id="wish"
          value={wish}
          onChange={(e) => setWish(e.target.value)}
          rows={2}
          maxLength={160}
          placeholder="Close your eyes and think of something..."
          className="w-full resize-none rounded-2xl border-2 border-violet-100 bg-white px-4 py-3 text-sm text-ink placeholder:text-ink/35 focus:border-pink-300 focus:outline-none"
        />
      </div>

      <div className="card rounded-3xl px-4 pb-8 pt-6 sm:px-8">
        <Cakeview lit={lit} puffs={puffs} onSnuff={(i) => snuff([i])} />

        <p className="mt-6 text-center text-sm font-semibold text-ink/70" aria-live="polite">
          {finished ? 'Every candle is out. Your wish is in the air.' : `${remaining} candle${remaining === 1 ? '' : 's'} still glowing`}
        </p>

        {!finished && (
          <div className="mt-4 flex flex-col items-center justify-center gap-3 sm:flex-row">
            {mic === 'listening' ? (
              <button
                onClick={() => stopMicRef.current?.()}
                className="btn-primary inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold"
              >
                <Mic className="h-4 w-4 animate-pulse" aria-hidden /> Listening... blow now (tap to stop)
              </button>
            ) : (
              <button onClick={startMic} className="btn-primary inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold">
                <Wind className="h-4 w-4" aria-hidden /> Blow with the microphone
              </button>
            )}
            <button
              onClick={() => snuff(litRef.current.map((_, i) => i))}
              className="btn-soft inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold"
            >
              Blow them all out
            </button>
          </div>
        )}

        {mic === 'denied' && (
          <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-ink/60">
            <MicOff className="h-3.5 w-3.5" aria-hidden /> Microphone is off, so tap the flames instead. No problem.
          </p>
        )}
        {mic === 'unsupported' && (
          <p className="mt-3 text-center text-xs text-ink/60">This browser can&rsquo;t use the microphone, so tap the flames instead.</p>
        )}
      </div>

      {finished && (
        <motion.div
          initial={{ opacity: 0, scale: 0.93 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card rounded-3xl border-2 border-pink-200 bg-gradient-to-b from-white to-pink-50/70 p-6 text-center"
        >
          <span className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-pink-100 text-pink-600">
            <Heart className="h-7 w-7 fill-pink-500" aria-hidden />
          </span>
          <h2 className="font-serif text-2xl font-semibold text-ink">Wish sent to the stars</h2>
          <p className="mt-1 text-sm text-ink/70">
            {wish.trim() ? 'Whatever you wished for, we are rooting for it.' : 'A secret wish is the best kind.'} Badge unlocked:{' '}
            <strong className="text-pink-600">Wish Made</strong>.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button onClick={reset} className="btn-soft rounded-2xl px-5 py-3 text-sm font-semibold">
              Light them again
            </button>
            <button onClick={onNext} className="btn-primary inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3 font-bold">
              Open the final surprise <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </motion.div>
      )}

      {!finished && done && (
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

function Cakeview({ lit, puffs, onSnuff }) {
  return (
    <div className="mx-auto w-full max-w-sm rounded-3xl bg-gradient-to-b from-violet-200/70 via-pink-100 to-pink-100 px-6 pb-6 pt-8">
      {/* candles */}
      <div className="mx-auto flex max-w-[15rem] flex-wrap items-end justify-center gap-x-2 gap-y-1">
        {lit.map((on, i) => (
          <button
            key={i}
            onClick={() => onSnuff(i)}
            disabled={!on}
            aria-label={on ? `Blow out candle ${i + 1}` : `Candle ${i + 1} is out`}
            className="relative flex h-14 w-4 flex-col items-center justify-end rounded-sm disabled:cursor-default"
          >
            {on ? (
              <span
                className="flame mb-0.5 block h-5 w-3 bg-gradient-to-t from-orange-400 via-amber-300 to-yellow-100"
                style={{ borderRadius: '50% 50% 50% 50% / 62% 62% 38% 38%' }}
              />
            ) : (
              puffs.includes(i) && <span aria-hidden className="smoke absolute bottom-8 block h-3 w-3 rounded-full bg-slate-300/70" />
            )}
            <span className="block h-8 w-2 rounded-t-sm bg-[repeating-linear-gradient(45deg,#fda4af_0_4px,#fff_4px_8px)]" />
          </button>
        ))}
      </div>

      {/* tiers */}
      <div className="mx-auto mt-1 w-3/4">
        <div className="h-5 rounded-t-2xl bg-white shadow-inner" />
        <div
          className="h-4"
          style={{
            backgroundImage: 'radial-gradient(circle at 13px 0, #fff 12px, transparent 13px)',
            backgroundSize: '26px 16px',
            backgroundRepeat: 'repeat-x',
          }}
        />
        <div className="-mt-4 h-14 rounded-b-xl bg-gradient-to-b from-pink-300 to-pink-400" />
      </div>
      <div className="mx-auto w-full">
        <div className="h-5 rounded-t-3xl bg-white shadow-inner" />
        <div
          className="h-4"
          style={{
            backgroundImage: 'radial-gradient(circle at 15px 0, #fff 14px, transparent 15px)',
            backgroundSize: '30px 16px',
            backgroundRepeat: 'repeat-x',
          }}
        />
        <div className="-mt-4 flex h-20 items-center justify-center rounded-b-2xl bg-gradient-to-b from-violet-300 to-violet-400">
          <span className="font-hand text-3xl font-bold text-white drop-shadow">{CONFIG.recipient.nick}</span>
        </div>
      </div>
      <div className="mx-auto -mt-1 h-3 w-[110%] -translate-x-[4.5%] rounded-full bg-gradient-to-b from-slate-200 to-slate-300 shadow-md" />
    </div>
  )
}
