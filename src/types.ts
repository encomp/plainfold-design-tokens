export interface PfTheme {
  id: string
  name: string
  description: string
  version: string
  tokens: Record<string, string>
  icons?: Record<string, string>
}

export interface ContrastResult {
  pair: string
  ratio: number | null
  passes: boolean
  threshold: number
}

export interface ThemeValidationResult {
  theme: PfTheme | null
  contrastWarnings: ContrastResult[]
}

export type ContrastSize = 'normal' | 'large' | 'ui'
