import { useState, useEffect, type ReactNode } from 'react'
import { Settings } from '@plainfold/store'
import type { PfTheme } from './types'
import { applyTheme } from './apply-theme'

interface PfDesignTokensProviderProps {
  children: ReactNode
}

export function PfDesignTokensProvider({ children }: PfDesignTokensProviderProps) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    Settings.get<PfTheme>('pf:theme:activeTheme')
      .then(theme => {
        if (theme) applyTheme(theme)
        setReady(true)
      })
      .catch(() => setReady(true))
  }, [])

  if (!ready) return null

  return <>{children}</>
}
