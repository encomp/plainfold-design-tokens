import { describe, it, expect, beforeEach } from 'vitest'
import { clearAll } from '@plainfold/store'

const makeTheme = (id: string) => ({
  id,
  name: `Theme ${id}`,
  description: 'test',
  version: '1.0',
  tokens: { '--pf-bg-base': '#000' },
})

describe('ThemeLibrary', () => {
  beforeEach(async () => {
    await clearAll()
  })

  it('returns empty array when no themes installed', async () => {
    const { ThemeLibrary } = await import('../theme-library')
    const themes = await ThemeLibrary.getAll()
    expect(themes).toEqual([])
  })

  it('adds a theme', async () => {
    const { ThemeLibrary } = await import('../theme-library')
    const theme = makeTheme('custom-1')
    await ThemeLibrary.add(theme)
    const all = await ThemeLibrary.getAll()
    expect(all).toHaveLength(1)
    expect(all[0].id).toBe('custom-1')
  })

  it('updates existing theme by id (upsert)', async () => {
    const { ThemeLibrary } = await import('../theme-library')
    await ThemeLibrary.add(makeTheme('custom-1'))
    const updated = { ...makeTheme('custom-1'), name: 'Updated' }
    await ThemeLibrary.add(updated)
    const all = await ThemeLibrary.getAll()
    expect(all).toHaveLength(1)
    expect(all[0].name).toBe('Updated')
  })

  it('removes a theme by id', async () => {
    const { ThemeLibrary } = await import('../theme-library')
    await ThemeLibrary.add(makeTheme('a'))
    await ThemeLibrary.add(makeTheme('b'))
    await ThemeLibrary.remove('a')
    const all = await ThemeLibrary.getAll()
    expect(all).toHaveLength(1)
    expect(all[0].id).toBe('b')
  })

  it('remove is a no-op for missing id', async () => {
    const { ThemeLibrary } = await import('../theme-library')
    await ThemeLibrary.add(makeTheme('a'))
    await ThemeLibrary.remove('nonexistent')
    const all = await ThemeLibrary.getAll()
    expect(all).toHaveLength(1)
  })
})
