import { Settings } from '@plainfold/store'
import type { PfTheme } from './types'

export const ThemeLibrary = {
  async getAll(): Promise<PfTheme[]> {
    return (await Settings.get<PfTheme[]>('pf:theme:installedThemes')) ?? []
  },

  async add(theme: PfTheme): Promise<void> {
    const all = await ThemeLibrary.getAll()
    const idx = all.findIndex(t => t.id === theme.id)
    if (idx >= 0) {
      all[idx] = theme
    } else {
      all.push(theme)
    }
    await Settings.set('pf:theme:installedThemes', all)
  },

  async remove(id: string): Promise<void> {
    const all = await ThemeLibrary.getAll()
    const filtered = all.filter(t => t.id !== id)
    await Settings.set('pf:theme:installedThemes', filtered)
  },
}
