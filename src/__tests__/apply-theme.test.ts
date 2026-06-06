import { describe, it, expect, beforeEach } from 'vitest'

beforeEach(() => {
  document.documentElement.style.cssText = ''
})

describe('applyTheme', () => {
  it('sets CSS custom properties on document root', async () => {
    const { applyTheme } = await import('../apply-theme')
    const theme = {
      id: 'test',
      name: 'Test',
      description: 'test',
      version: '1.0',
      tokens: {
        '--pf-bg-base': '#ff0000',
        '--pf-accent': '#00ff00',
      },
    }
    applyTheme(theme)
    expect(document.documentElement.style.getPropertyValue('--pf-bg-base')).toBe('#ff0000')
    expect(document.documentElement.style.getPropertyValue('--pf-accent')).toBe('#00ff00')
  })

  it('overwrites existing properties', async () => {
    const { applyTheme } = await import('../apply-theme')
    document.documentElement.style.setProperty('--pf-bg-base', '#000000')
    applyTheme({
      id: 'test',
      name: 'Test',
      description: '',
      version: '1.0',
      tokens: { '--pf-bg-base': '#ff0000' },
    })
    expect(document.documentElement.style.getPropertyValue('--pf-bg-base')).toBe('#ff0000')
  })
})

describe('resetTheme', () => {
  it('removes all theme custom properties from root', async () => {
    const { applyTheme, resetTheme } = await import('../apply-theme')
    const theme = {
      id: 'test',
      name: 'Test',
      description: '',
      version: '1.0',
      tokens: { '--pf-bg-base': '#ff0000', '--pf-accent': '#00ff00' },
    }
    applyTheme(theme)
    resetTheme(theme)
    expect(document.documentElement.style.getPropertyValue('--pf-bg-base')).toBe('')
    expect(document.documentElement.style.getPropertyValue('--pf-accent')).toBe('')
  })
})
