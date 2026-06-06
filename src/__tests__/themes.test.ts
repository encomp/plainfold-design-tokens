import { describe, it, expect } from 'vitest'
import { BUNDLED_THEMES, BUNDLED_THEME_IDS, THEME_MIDNIGHT, THEME_LINEN, THEME_FOCUS } from '../themes'
import { REQUIRED_TOKENS } from '../tokens'
import { themePassesContrast } from '../contrast'

describe('bundled themes', () => {
  it('exports 3 bundled themes', () => {
    expect(BUNDLED_THEMES).toHaveLength(3)
  })

  it('BUNDLED_THEME_IDS contains all bundled theme IDs', () => {
    expect(BUNDLED_THEME_IDS.has('midnight')).toBe(true)
    expect(BUNDLED_THEME_IDS.has('linen')).toBe(true)
    expect(BUNDLED_THEME_IDS.has('focus')).toBe(true)
  })

  for (const theme of [THEME_MIDNIGHT, THEME_LINEN, THEME_FOCUS]) {
    describe(theme.name, () => {
      it('includes all required tokens', () => {
        for (const token of REQUIRED_TOKENS) {
          expect(theme.tokens).toHaveProperty(token)
        }
      })

      it('passes WCAG AA contrast', () => {
        expect(themePassesContrast(theme.tokens)).toBe(true)
      })

      it('has valid metadata', () => {
        expect(theme.id).toBeTruthy()
        expect(theme.name).toBeTruthy()
        expect(theme.version).toBeTruthy()
      })
    })
  }
})
