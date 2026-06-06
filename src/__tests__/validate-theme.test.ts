import { describe, it, expect, beforeEach, vi } from 'vitest'

const validTheme = {
  id: 'test-theme',
  name: 'Test Theme',
  description: 'A test theme',
  version: '1.0',
  tokens: {
    '--pf-bg-base': '#040810',
    '--pf-accent': '#14b8a6',
    '--pf-text-primary': '#f1f5f9',
    '--pf-border': '#1e293b',
    '--pf-positive': '#14b8a6',
    '--pf-danger': '#ef4444',
    '--pf-bg-surface': '#070d1a',
    '--pf-text-secondary': '#94a3b8',
  },
}

describe('validateTheme', () => {
  beforeEach(async () => {
    vi.resetModules()
  })

  it('returns valid theme for correct input', async () => {
    const { validateTheme } = await import('../validate-theme')
    expect(validateTheme(validTheme)).toEqual(validTheme)
  })

  it('returns null for missing required tokens', async () => {
    const { validateTheme } = await import('../validate-theme')
    const incomplete = { ...validTheme, tokens: { '--pf-bg-base': '#000' } }
    expect(validateTheme(incomplete)).toBeNull()
  })

  it('returns null for missing id', async () => {
    const { validateTheme } = await import('../validate-theme')
    expect(validateTheme({ ...validTheme, id: '' })).toBeNull()
  })

  it('returns null for missing name', async () => {
    const { validateTheme } = await import('../validate-theme')
    expect(validateTheme({ ...validTheme, name: '' })).toBeNull()
  })

  it('returns null for non-object input', async () => {
    const { validateTheme } = await import('../validate-theme')
    expect(validateTheme('not an object')).toBeNull()
    expect(validateTheme(null)).toBeNull()
    expect(validateTheme(42)).toBeNull()
  })

  it('rejects reserved IDs', async () => {
    const { validateTheme, registerReservedIds } = await import('../validate-theme')
    registerReservedIds(['reserved-id'])
    expect(validateTheme({ ...validTheme, id: 'reserved-id' })).toBeNull()
  })

  it('accepts theme with icons', async () => {
    const { validateTheme } = await import('../validate-theme')
    const withIcons = { ...validTheme, icons: { logo: '<svg></svg>' } }
    const result = validateTheme(withIcons)
    expect(result).not.toBeNull()
    expect(result!.icons).toEqual({ logo: '<svg></svg>' })
  })
})

describe('validateThemeFull', () => {
  it('returns theme and empty warnings for valid high-contrast theme', async () => {
    const { validateThemeFull } = await import('../validate-theme')
    const result = validateThemeFull(validTheme)
    expect(result.theme).not.toBeNull()
    expect(result.contrastWarnings).toEqual([])
  })

  it('returns theme with contrast warnings for low-contrast theme', async () => {
    const { validateThemeFull } = await import('../validate-theme')
    const lowContrast = {
      ...validTheme,
      tokens: {
        ...validTheme.tokens,
        '--pf-text-primary': '#888888',
        '--pf-bg-base': '#999999',
        '--pf-bg-surface': '#aaaaaa',
      },
    }
    const result = validateThemeFull(lowContrast)
    expect(result.theme).not.toBeNull()
    expect(result.contrastWarnings.length).toBeGreaterThan(0)
  })

  it('returns null theme for invalid input', async () => {
    const { validateThemeFull } = await import('../validate-theme')
    const result = validateThemeFull({ bad: 'data' })
    expect(result.theme).toBeNull()
    expect(result.contrastWarnings).toEqual([])
  })
})

describe('pfThemeSchema', () => {
  it('is a zod schema that can validate', async () => {
    const { pfThemeSchema } = await import('../validate-theme')
    const result = pfThemeSchema.safeParse(validTheme)
    expect(result.success).toBe(true)
  })
})
