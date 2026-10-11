import confetti from 'canvas-confetti'

const PALETTE = ['#f472b6', '#c084fc', '#fbbf24', '#fda4af', '#a78bfa', '#fde68a']

const reduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

export function burst(kind = 'default') {
  if (reduced()) return
  try {
    if (kind === 'cannon') {
      confetti({ particleCount: 70, angle: 60, spread: 60, origin: { x: 0, y: 0.75 }, colors: PALETTE })
      confetti({ particleCount: 70, angle: 120, spread: 60, origin: { x: 1, y: 0.75 }, colors: PALETTE })
    } else if (kind === 'hearts') {
      const heart = confetti.shapeFromText({ text: '♥', scalar: 2 })
      const end = Date.now() + 1100
      const tick = () => {
        confetti({
          particleCount: 6,
          spread: 360,
          startVelocity: 22,
          ticks: 70,
          scalar: 2,
          shapes: [heart],
          colors: ['#f472b6', '#fb7185', '#c084fc'],
          origin: { x: Math.random(), y: Math.random() * 0.4 },
        })
        if (Date.now() < end) setTimeout(tick, 200)
      }
      tick()
    } else if (kind === 'grand') {
      const fire = (ratio, opts) =>
        confetti({ origin: { y: 0.7 }, colors: PALETTE, ...opts, particleCount: Math.floor(220 * ratio) })
      fire(0.25, { spread: 26, startVelocity: 55 })
      fire(0.2, { spread: 60 })
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 })
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 })
      fire(0.1, { spread: 120, startVelocity: 45 })
    } else {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 }, colors: PALETTE })
    }
  } catch {
    /* confetti is decoration only */
  }
}
