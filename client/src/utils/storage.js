// localStorage can throw (private mode, blocked site data), so every access is guarded.
const KEY = 'misu-birthday-v1'

export function loadProgress() {
  try {
    const raw = localStorage.getItem(KEY)
    const parsed = raw ? JSON.parse(raw) : null
    return Array.isArray(parsed?.badges) ? parsed.badges : []
  } catch {
    return []
  }
}

export function saveProgress(badges) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ badges }))
  } catch {
    /* progress just won't persist; the site still works */
  }
}
