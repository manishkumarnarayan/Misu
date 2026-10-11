import { Heart, Star, Sparkles, Flower2, Gem } from 'lucide-react'

const BITS = [
  { Icon: Sparkles, top: '12%', left: '6%', size: 26, delay: 0, color: 'text-amber-400' },
  { Icon: Heart, top: '26%', left: '91%', size: 20, delay: 1.5, color: 'text-rosepink' },
  { Icon: Flower2, top: '68%', left: '5%', size: 24, delay: 2, color: 'text-orchid' },
  { Icon: Star, top: '80%', left: '93%', size: 22, delay: 0.8, color: 'text-amber-300' },
  { Icon: Gem, top: '46%', left: '95%', size: 18, delay: 3, color: 'text-violet-400' },
  { Icon: Heart, top: '86%', left: '16%', size: 18, delay: 1, color: 'text-pink-300' },
]

// Soft ambient orbs plus a few drifting icons. Purely decorative.
export default function Backdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-pink-200/55 blur-[100px]" />
      <div className="absolute -right-32 top-1/3 h-96 w-96 rounded-full bg-violet-200/55 blur-[110px]" />
      <div className="absolute -bottom-32 left-1/4 h-96 w-96 rounded-full bg-amber-100/70 blur-[120px]" />
      {BITS.map(({ Icon, top, left, size, delay, color }, i) => (
        <Icon
          key={i}
          className={`float-y absolute opacity-40 ${color}`}
          style={{ top, left, width: size, height: size, animationDelay: `${delay}s` }}
        />
      ))}
    </div>
  )
}
