import { describe, it, expect } from 'vitest'
import {
  hexToRgb,
  getRelativeLuminance,
  getContrastRatio,
  passesAA,
  validateThemeContrast,
  themePassesContrast,
} from '../contrast'

describe('hexToRgb', () => {
  it('parses 6-digit hex', () => {
    expect(hexToRgb('#ffffff')).toEqual([255, 255, 255])
    expect(hexToRgb('#000000')).toEqual([0, 0, 0])
    expect(hexToRgb('#14b8a6')).toEqual([20, 184, 166])
  })
  it('parses 3-digit hex', () => {
    expect(hexToRgb('#fff')).toEqual([255, 255, 255])
    expect(hexToRgb('#000')).toEqual([0, 0, 0])
  })
  it('handles hex without hash', () => {
    expect(hexToRgb('ffffff')).toEqual([255, 255, 255])
  })
  it('returns null for invalid input', () => {
    expect(hexToRgb('not-a-color')).toBeNull()
    expect(hexToRgb('rgba(0,0,0,0)')).toBeNull()
  })
})

describe('getRelativeLuminance', () => {
  it('white has luminance 1', () => {
    expect(getRelativeLuminance(255, 255, 255)).toBeCloseTo(1.0, 2)
  })
  it('black has luminance 0', () => {
    expect(getRelativeLuminance(0, 0, 0)).toBeCloseTo(0.0, 2)
  })
})

describe('getContrastRatio', () => {
  it('black on white is 21:1', () => {
    expect(getContrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 0)
  })
  it('white on white is 1:1', () => {
    expect(getContrastRatio('#ffffff', '#ffffff')).toBeCloseTo(1, 1)
  })
  it('returns null for invalid hex', () => {
    expect(getContrastRatio('rgba(0,0,0)', '#fff')).toBeNull()
  })
})

describe('passesAA', () => {
  it('black on white passes AA normal', () => {
    expect(passesAA('#000000', '#ffffff', 'normal')).toBe(true)
  })
  it('light grey on white fails AA normal', () => {
    expect(passesAA('#cccccc', '#ffffff', 'normal')).toBe(false)
  })
  it('uses 3:1 threshold for ui size', () => {
    expect(passesAA('#767676', '#ffffff', 'ui')).toBe(true)
  })
})

describe('validateThemeContrast', () => {
  it('midnight tokens all pass', () => {
    const tokens = {
      '--pf-text-primary': '#f1f5f9',
      '--pf-text-secondary': '#94a3b8',
      '--pf-bg-base': '#040810',
      '--pf-bg-surface': '#070d1a',
      '--pf-accent': '#14b8a6',
    }
    validateThemeContrast(tokens).forEach(r => {
      if (r.ratio !== null) expect(r.passes).toBe(true)
    })
  })
  it('returns failing for low-contrast tokens', () => {
    const tokens = {
      '--pf-text-primary': '#888888',
      '--pf-text-secondary': '#aaaaaa',
      '--pf-bg-base': '#999999',
      '--pf-bg-surface': '#aaaaaa',
      '--pf-accent': '#bbbbbb',
    }
    expect(validateThemeContrast(tokens).filter(r => !r.passes).length).toBeGreaterThan(0)
  })
  it('returns non-passing for missing token', () => {
    const tokens = {
      '--pf-text-primary': '#ffffff',
      '--pf-bg-surface': '#000000',
      '--pf-text-secondary': '#cccccc',
      '--pf-accent': '#14b8a6',
    }
    expect(validateThemeContrast(tokens).find(r => r.ratio === null)).toBeTruthy()
  })
})

describe('themePassesContrast', () => {
  it('returns true for high-contrast tokens', () => {
    expect(themePassesContrast({
      '--pf-text-primary': '#f1f5f9',
      '--pf-text-secondary': '#94a3b8',
      '--pf-bg-base': '#040810',
      '--pf-bg-surface': '#070d1a',
      '--pf-accent': '#14b8a6',
    })).toBe(true)
  })
  it('returns false when any pair fails', () => {
    expect(themePassesContrast({
      '--pf-text-primary': '#888888',
      '--pf-text-secondary': '#999999',
      '--pf-bg-base': '#777777',
      '--pf-bg-surface': '#888888',
      '--pf-accent': '#999999',
    })).toBe(false)
  })
})
