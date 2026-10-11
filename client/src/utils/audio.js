// All sound effects are synthesised with the Web Audio API, so the site needs
// no audio files. Background music is either a synthesised "Happy Birthday"
// loop or an optional file set in config.js.

import { CONFIG } from '../config'

// "Happy Birthday to You" (traditional tune). [frequency Hz, length in beats]
const N = { G4: 392, A4: 440, B4: 493.88, C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99 }
const MELODY = [
  [N.G4, 0.75], [N.G4, 0.25], [N.A4, 1], [N.G4, 1], [N.C5, 1], [N.B4, 2],
  [N.G4, 0.75], [N.G4, 0.25], [N.A4, 1], [N.G4, 1], [N.D5, 1], [N.C5, 2],
  [N.G4, 0.75], [N.G4, 0.25], [N.G5, 1], [N.E5, 1], [N.C5, 1], [N.B4, 1], [N.A4, 1],
  [N.F5, 0.75], [N.F5, 0.25], [N.E5, 1], [N.C5, 1], [N.D5, 1], [N.C5, 2],
]
const BEAT = 0.62
const LOOP_REST = 2.4

class AudioManager {
  constructor() {
    this.ctx = null
    this.muted = false
    this.musicOn = false
    this.listeners = new Set()
    this.loopTimer = null
    this.bgmGain = null
    this.file = null
  }

  subscribe(fn) {
    this.listeners.add(fn)
    return () => this.listeners.delete(fn)
  }

  emit() {
    const state = { muted: this.muted, musicOn: this.musicOn }
    this.listeners.forEach((fn) => fn(state))
  }

  init() {
    if (!this.ctx) {
      const Ctx = window.AudioContext || window.webkitAudioContext
      if (Ctx) this.ctx = new Ctx()
    }
    if (this.ctx?.state === 'suspended') this.ctx.resume()
    return this.ctx
  }

  // --- tiny helper: one enveloped oscillator note ---
  tone({ freq, start = 0, dur = 0.2, type = 'sine', vol = 0.15, slideTo, dest }) {
    const ctx = this.init()
    if (!ctx) return
    const t = ctx.currentTime + start
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(freq, t)
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t + dur)
    gain.gain.setValueAtTime(0.0001, t)
    gain.gain.exponentialRampToValueAtTime(vol, t + 0.015)
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur)
    osc.connect(gain)
    gain.connect(dest || ctx.destination)
    osc.start(t)
    osc.stop(t + dur + 0.05)
  }

  sfx(fn) {
    if (this.muted) return
    try {
      fn()
    } catch {
      /* audio is optional */
    }
  }

  pop(pitch = 1) {
    this.sfx(() => this.tone({ freq: 520 * pitch, slideTo: 180 * pitch, dur: 0.09, vol: 0.18 }))
  }

  flip() {
    this.sfx(() => this.tone({ freq: 380, slideTo: 760, dur: 0.07, vol: 0.1, type: 'triangle' }))
  }

  match() {
    this.sfx(() => [659.25, 880].forEach((f, i) => this.tone({ freq: f, start: i * 0.09, dur: 0.25, type: 'triangle', vol: 0.12 })))
  }

  oops() {
    this.sfx(() => this.tone({ freq: 220, slideTo: 150, dur: 0.18, vol: 0.1, type: 'sawtooth' }))
  }

  sparkle() {
    this.sfx(() =>
      [523.25, 659.25, 783.99, 1046.5, 1318.51].forEach((f, i) =>
        this.tone({ freq: f, start: i * 0.06, dur: 0.35, type: 'triangle', vol: 0.08 }),
      ),
    )
  }

  fanfare() {
    this.sfx(() =>
      [
        [523.25, 0, 0.18],
        [659.25, 0.14, 0.18],
        [783.99, 0.28, 0.18],
        [1046.5, 0.42, 0.55],
        [1318.51, 0.56, 0.75],
      ].forEach(([f, s, d]) => this.tone({ freq: f, start: s, dur: d, vol: 0.14 })),
    )
  }

  blow() {
    this.sfx(() => {
      const ctx = this.init()
      if (!ctx) return
      const len = Math.floor(ctx.sampleRate * 0.45)
      const buf = ctx.createBuffer(1, len, ctx.sampleRate)
      const data = buf.getChannelData(0)
      for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (len * 0.45))
      const src = ctx.createBufferSource()
      src.buffer = buf
      const filter = ctx.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(900, ctx.currentTime)
      filter.frequency.linearRampToValueAtTime(220, ctx.currentTime + 0.45)
      const gain = ctx.createGain()
      gain.gain.value = 0.22
      src.connect(filter)
      filter.connect(gain)
      gain.connect(ctx.destination)
      src.start()
    })
  }

  scratch() {
    this.sfx(() => this.tone({ freq: 800 + Math.random() * 400, dur: 0.05, type: 'triangle', vol: 0.035 }))
  }

  // ---------------- music ----------------
  toggleMute() {
    this.muted = !this.muted
    if (this.file) this.file.muted = this.muted
    if (this.bgmGain) this.bgmGain.gain.value = this.muted ? 0 : 0.5
    this.emit()
  }

  toggleMusic() {
    this.musicOn ? this.stopMusic() : this.startMusic()
  }

  startMusic() {
    if (this.musicOn) return
    if (CONFIG.music) {
      if (!this.file) {
        this.file = new Audio(CONFIG.music)
        this.file.loop = true
        this.file.volume = 0.6
      }
      this.file.muted = this.muted
      this.file
        .play()
        .then(() => {
          this.musicOn = true
          this.emit()
        })
        .catch(() => {
          /* blocked until a user gesture; the toggle button will retry */
        })
      return
    }
    const ctx = this.init()
    if (!ctx) return
    this.bgmGain = ctx.createGain()
    this.bgmGain.gain.value = this.muted ? 0 : 0.5
    this.bgmGain.connect(ctx.destination)
    this.musicOn = true
    this.scheduleLoop()
    this.emit()
  }

  scheduleLoop() {
    const ctx = this.ctx
    if (!ctx || !this.musicOn) return
    let t = 0.1
    MELODY.forEach(([freq, beats]) => {
      const dur = beats * BEAT
      this.tone({ freq, start: t, dur: dur * 0.95, type: 'triangle', vol: 0.11, dest: this.bgmGain })
      this.tone({ freq: freq / 2, start: t, dur: dur * 0.9, type: 'sine', vol: 0.05, dest: this.bgmGain })
      t += dur
    })
    this.loopTimer = setTimeout(() => this.scheduleLoop(), (t + LOOP_REST) * 1000)
  }

  stopMusic() {
    clearTimeout(this.loopTimer)
    this.loopTimer = null
    if (this.file) this.file.pause()
    if (this.bgmGain) {
      // Detach the current gain node; notes already scheduled die out silently.
      this.bgmGain.gain.value = 0
      this.bgmGain.disconnect()
      this.bgmGain = null
    }
    this.musicOn = false
    this.emit()
  }
}

export const audio = new AudioManager()
