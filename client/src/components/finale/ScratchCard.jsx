import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { Gift, Sparkles, Wand2 } from 'lucide-react'
import { CONFIG } from '../../config'
import { audio } from '../../utils/audio'

const COLS = 28
const ROWS = 12
const REVEAL_AT = 0.42
const BRUSH = 30

/**
 * Foil scratch card. Coverage is tracked on a coarse grid instead of reading
 * pixels back from the canvas, which keeps it smooth on slow phones.
 */
export default function ScratchCard({ onReveal }) {
  const wrapRef = useRef(null)
  const canvasRef = useRef(null)
  const cells = useRef(new Set())
  const drawing = useRef(false)
  const lastPoint = useRef(null)
  const lastSound = useRef(0)
  const [revealed, setRevealed] = useState(false)
  const [progress, setProgress] = useState(0)

  const reveal = () => {
    if (revealed) return
    setRevealed(true)
    onReveal()
  }

  // Paint the foil (and repaint on resize while still unrevealed)
  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap || revealed) return

    const paint = () => {
      const w = wrap.clientWidth
      const h = wrap.clientHeight
      const dpr = window.devicePixelRatio || 1
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      const ctx = canvas.getContext('2d')
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      cells.current.clear()
      setProgress(0)

      const g = ctx.createLinearGradient(0, 0, w, h)
      g.addColorStop(0, '#f9a8d4')
      g.addColorStop(0.35, '#fde68a')
      g.addColorStop(0.65, '#d8b4fe')
      g.addColorStop(1, '#f472b6')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, w, h)

      ctx.strokeStyle = 'rgba(255,255,255,0.28)'
      ctx.lineWidth = 6
      for (let x = -h; x < w + h; x += 34) {
        ctx.beginPath()
        ctx.moveTo(x, h)
        ctx.lineTo(x + h, 0)
        ctx.stroke()
      }
      ctx.fillStyle = 'rgba(255,255,255,0.55)'
      for (let i = 0; i < 30; i++) {
        ctx.beginPath()
        ctx.arc(((i * 67) % w) + 4, ((i * 41) % h) + 4, (i % 3) + 1.5, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.textAlign = 'center'
      ctx.fillStyle = '#4a1d5c'
      ctx.font = '700 22px "Playfair Display", serif'
      ctx.fillText('Scratch to reveal', w / 2, h / 2 - 6)
      ctx.font = '500 13px "Plus Jakarta Sans", sans-serif'
      ctx.fillStyle = '#6b2f78'
      ctx.fillText('use your finger or the mouse', w / 2, h / 2 + 18)
    }

    paint()
    const ro = new ResizeObserver(paint)
    ro.observe(wrap)
    // Repaint once web fonts are ready so the foil text uses the right face
    document.fonts?.ready.then(paint).catch(() => {})
    return () => ro.disconnect()
  }, [revealed])

  const scratchTo = (x, y) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.globalCompositeOperation = 'destination-out'
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.lineWidth = BRUSH * 2

    const from = lastPoint.current ?? { x, y }
    ctx.beginPath()
    ctx.moveTo(from.x, from.y)
    ctx.lineTo(x, y)
    ctx.stroke()
    lastPoint.current = { x, y }

    const w = wrapRef.current.clientWidth
    const h = wrapRef.current.clientHeight
    const cw = w / COLS
    const ch = h / ROWS
    const r = BRUSH * 0.8
    for (let cx = Math.max(0, Math.floor((x - r) / cw)); cx <= Math.min(COLS - 1, Math.floor((x + r) / cw)); cx++) {
      for (let cy = Math.max(0, Math.floor((y - r) / ch)); cy <= Math.min(ROWS - 1, Math.floor((y + r) / ch)); cy++) {
        cells.current.add(cy * COLS + cx)
      }
    }
    const pct = cells.current.size / (COLS * ROWS)
    setProgress(pct)

    const now = performance.now()
    if (now - lastSound.current > 90) {
      audio.scratch()
      lastSound.current = now
    }
    if (pct >= REVEAL_AT) reveal()
  }

  const pos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const down = (e) => {
    drawing.current = true
    lastPoint.current = null
    canvasRef.current.setPointerCapture?.(e.pointerId)
    const p = pos(e)
    scratchTo(p.x, p.y)
  }
  const move = (e) => {
    if (!drawing.current) return
    const p = pos(e)
    scratchTo(p.x, p.y)
  }
  const up = () => {
    drawing.current = false
    lastPoint.current = null
  }

  return (
    <div className="mx-auto w-full max-w-xl">
      <div
        ref={wrapRef}
        className="card relative h-60 overflow-hidden rounded-3xl border-2 border-pink-200 sm:h-64"
      >
        {/* What sits under the foil */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-white via-pink-50 to-violet-100 px-4 text-center">
          <Sparkles className="mb-1 h-6 w-6 text-amber-400" aria-hidden />
          <p className="text-xs font-bold uppercase tracking-widest text-pink-600">Unlocked</p>
          <p className="gradient-text font-hand text-6xl font-bold leading-none sm:text-7xl">Happy Birthday</p>
          <p className="mt-1 font-serif text-2xl font-semibold text-ink sm:text-3xl">{CONFIG.recipient.nick}</p>
        </div>

        {!revealed && (
          <canvas
            ref={canvasRef}
            onPointerDown={down}
            onPointerMove={move}
            onPointerUp={up}
            onPointerCancel={up}
            className="absolute inset-0 h-full w-full cursor-crosshair touch-none"
            aria-label="Scratch card. Use the Reveal button below if you prefer."
          />
        )}
      </div>

      {!revealed && (
        <div className="mt-4 flex flex-col items-center gap-2">
          <div className="h-1.5 w-40 overflow-hidden rounded-full bg-violet-100" aria-hidden>
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-pink-500 to-violet-500"
              animate={{ width: `${Math.min(100, (progress / REVEAL_AT) * 100)}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
          <button
            onClick={() => {
              audio.sparkle()
              reveal()
            }}
            className="btn-soft inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold"
          >
            <Wand2 className="h-4 w-4" aria-hidden /> Reveal instantly
          </button>
        </div>
      )}
      {revealed && (
        <p className="mt-4 flex items-center justify-center gap-2 text-sm font-semibold text-pink-600">
          <Gift className="h-4 w-4" aria-hidden /> Your letter is unfolding below
        </p>
      )}
    </div>
  )
}
