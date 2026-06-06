import type { PfTheme } from './types'

export function applyTheme(theme: PfTheme): void {
  const root = document.documentElement
  Object.entries(theme.tokens).forEach(([key, value]) => {
    root.style.setProperty(key, value)
  })
}

export function resetTheme(theme: PfTheme): void {
  const root = document.documentElement
  Object.entries(theme.tokens).forEach(([key]) => {
    root.style.removeProperty(key)
  })
}
