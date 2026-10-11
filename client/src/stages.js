import { Sparkles, Layers, Wand2, Cake, Gift } from 'lucide-react'

export const STAGES = [
  { id: 'welcome', label: 'Start', icon: Sparkles },
  { id: 'memory', label: 'Match', icon: Layers, badge: 'Memory Keeper' },
  { id: 'fortune', label: 'Fortune', icon: Wand2, badge: 'Fortune Found' },
  { id: 'cake', label: 'Cake', icon: Cake, badge: 'Wish Made' },
  { id: 'finale', label: 'Surprise', icon: Gift },
]

export const BADGE_IDS = ['memory', 'fortune', 'cake']
