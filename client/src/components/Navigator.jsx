import { useEffect, useState } from 'react'
import { Heart, Music, VolumeX, Volume2, Trophy } from 'lucide-react'
import { CONFIG } from '../config'
import { STAGES, BADGE_IDS } from '../stages'
import { audio } from '../utils/audio'

export default function Navigator({ stage, badges, onGo }) {
  const [audioState, setAudioState] = useState({ muted: audio.muted, musicOn: audio.musicOn })
  useEffect(() => audio.subscribe(setAudioState), [])

  return (
    <header className="sticky top-3 z-40 mx-auto w-full max-w-4xl px-3 sm:px-4">
      <nav
        aria-label="Birthday sections"
        className="glass flex items-center justify-between gap-2 rounded-2xl p-2 sm:p-2.5"
      >
        <button
          onClick={() => {
            audio.pop()
            onGo('welcome')
          }}
          className="flex shrink-0 items-center gap-2 rounded-xl px-2 py-1.5 text-left transition hover:bg-white/70"
          aria-label="Back to start"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-pink-500 to-violet-500 text-white shadow-sm">
            <Heart className="h-4 w-4 fill-white" aria-hidden />
          </span>
          <span className="hidden text-sm font-bold text-ink sm:block">{CONFIG.recipient.nick}&rsquo;s Day</span>
        </button>

        <div className="no-scrollbar flex items-center gap-1 overflow-x-auto sm:gap-1.5">
          {STAGES.map((s) => {
            const Icon = s.icon
            const current = s.id === stage
            const done = badges.includes(s.id)
            return (
              <button
                key={s.id}
                onClick={() => {
                  audio.pop()
                  onGo(s.id)
                }}
                aria-current={current ? 'page' : undefined}
                aria-label={s.label + (done ? ' (completed)' : '')}
                className={`relative flex shrink-0 items-center gap-1.5 rounded-xl px-2.5 py-2 text-xs font-semibold transition sm:px-3 ${
                  current
                    ? 'bg-gradient-to-r from-pink-500 to-violet-500 text-white shadow-md'
                    : done
                      ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      : 'text-ink/70 hover:bg-white/70'
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden />
                <span className="hidden md:inline">{s.label}</span>
                {done && !current && (
                  <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-emerald-500" aria-hidden />
                )}
              </button>
            )
          })}
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <span className="hidden items-center gap-1 rounded-xl bg-white/70 px-2.5 py-1.5 text-xs font-semibold text-ink lg:flex">
            <Trophy className="h-3.5 w-3.5 text-amber-500" aria-hidden />
            {badges.length}/{BADGE_IDS.length}
          </span>
          <button
            onClick={() => audio.toggleMusic()}
            aria-pressed={audioState.musicOn}
            aria-label={audioState.musicOn ? 'Pause music' : 'Play music'}
            className={`flex h-9 w-9 items-center justify-center rounded-full transition ${
              audioState.musicOn ? 'bg-pink-500 text-white shadow-md' : 'bg-white/80 text-ink hover:bg-white'
            }`}
          >
            <Music className={`h-4 w-4 ${audioState.musicOn ? 'animate-pulse' : ''}`} aria-hidden />
          </button>
          <button
            onClick={() => audio.toggleMute()}
            aria-pressed={audioState.muted}
            aria-label={audioState.muted ? 'Unmute sounds' : 'Mute sounds'}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-ink transition hover:bg-white"
          >
            {audioState.muted ? (
              <VolumeX className="h-4 w-4 text-ink/40" aria-hidden />
            ) : (
              <Volume2 className="h-4 w-4 text-pink-500" aria-hidden />
            )}
          </button>
        </div>
      </nav>
    </header>
  )
}
