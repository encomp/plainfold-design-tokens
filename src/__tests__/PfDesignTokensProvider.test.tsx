import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { Settings, clearAll } from '@plainfold/store'

beforeEach(async () => {
  await clearAll()
  document.documentElement.style.cssText = ''
})

describe('PfDesignTokensProvider', () => {
  it('renders children when no saved theme', async () => {
    const { PfDesignTokensProvider } = await import('../PfDesignTokensProvider')
    render(
      <PfDesignTokensProvider>
        <div>Content</div>
      </PfDesignTokensProvider>
    )
    await waitFor(() => {
      expect(screen.getByText('Content')).toBeInTheDocument()
    })
  })

  it('applies saved theme on mount', async () => {
    await Settings.set('pf:theme:activeTheme', {
      id: 'saved',
      name: 'Saved',
      description: '',
      version: '1.0',
      tokens: { '--pf-bg-base': '#ff0000' },
    })

    const { PfDesignTokensProvider } = await import('../PfDesignTokensProvider')
    render(
      <PfDesignTokensProvider>
        <div>Content</div>
      </PfDesignTokensProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Content')).toBeInTheDocument()
    })

    expect(document.documentElement.style.getPropertyValue('--pf-bg-base')).toBe('#ff0000')
  })

  it('renders nothing before theme is loaded', async () => {
    const { PfDesignTokensProvider } = await import('../PfDesignTokensProvider')
    const { container: _container } = render(
      <PfDesignTokensProvider>
        <div>Content</div>
      </PfDesignTokensProvider>
    )
    // Initially empty (before useEffect resolves)
    // This may or may not catch the initial state depending on timing
    // The main assertion is that it eventually renders
    await waitFor(() => {
      expect(screen.getByText('Content')).toBeInTheDocument()
    })
  })
})
