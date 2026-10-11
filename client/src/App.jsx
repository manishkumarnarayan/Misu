import { useEffect, useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { STAGES } from './stages'
import { loadProgress, saveProgress } from './utils/storage'
import Intro from './components/Intro'
import Backdrop from './components/Backdrop'
import Navigator from './components/Navigator'
import Welcome from './components/stages/Welcome'
import MemoryGame from './components/stages/MemoryGame'
import FortuneQuiz from './components/stages/FortuneQuiz'
import CakeWish from './components/stages/CakeWish'
import Finale from './components/stages/Finale'

export default function App() {
  const [showIntro, setShowIntro] = useState(true)
  const [stage, setStage] = useState('welcome')
  const [badges, setBadges] = useState(loadProgress)

  useEffect(() => {
    saveProgress(badges)
  }, [badges])

  const unlock = useCallback((id) => {
    setBadges((prev) => (prev.includes(id) ? prev : [...prev, id]))
  }, [])

  const go = useCallback((id) => {
    setStage(id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const next = useCallback(() => {
    const i = STAGES.findIndex((s) => s.id === stage)
    if (i < STAGES.length - 1) go(STAGES[i + 1].id)
  }, [stage, go])

  const replay = () => {
    setBadges([])
    setStage('welcome')
    setShowIntro(true)
    window.scrollTo({ top: 0 })
  }

  const pages = {
    welcome: <Welcome badges={badges} onGo={go} onNext={next} />,
    memory: <MemoryGame onNext={next} onUnlock={unlock} done={badges.includes('memory')} />,
    fortune: <FortuneQuiz onNext={next} onUnlock={unlock} done={badges.includes('fortune')} />,
    cake: <CakeWish onNext={next} onUnlock={unlock} done={badges.includes('cake')} />,
    finale: <Finale onReplay={replay} />,
  }

  return (
    <div className="relative min-h-screen bg-cream">
      <AnimatePresence>{showIntro && <Intro onEnter={() => setShowIntro(false)} />}</AnimatePresence>

      {!showIntro && (
        <>
          <Backdrop />
          <div className="relative z-10 flex min-h-screen flex-col">
            <Navigator stage={stage} badges={badges} onGo={go} />
            <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-20 pt-6 sm:px-6 sm:pt-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={stage}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {pages[stage]}
                </motion.div>
              </AnimatePresence>
            </main>
            <footer className="pb-6 text-center text-xs text-ink/50">
              Made with love for Misu, by Kritika
            </footer>
          </div>
        </>
      )}
    </div>
  )
}
