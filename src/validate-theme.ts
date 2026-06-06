import { z } from 'zod'
import type { PfTheme, ThemeValidationResult } from './types'
import { REQUIRED_TOKENS } from './tokens'
import { validateThemeContrast } from './contrast'

const RESERVED_IDS = new Set<string>()

export function registerReservedIds(ids: Iterable<string>): void {
  for (const id of ids) RESERVED_IDS.add(id)
}

export const pfThemeSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string(),
  version: z.string(),
  tokens: z
    .record(z.string(), z.string())
    .refine((tokens) => REQUIRED_TOKENS.every((t) => t in tokens), {
      message: `Theme must include: ${REQUIRED_TOKENS.join(', ')}`,
    }),
  icons: z.record(z.string(), z.string()).optional(),
})

export function validateTheme(json: unknown): PfTheme | null {
  const result = pfThemeSchema.safeParse(json)
  if (!result.success) return null
  const theme = result.data as PfTheme
  if (RESERVED_IDS.has(theme.id)) return null
  return theme
}

export function validateThemeFull(json: unknown): ThemeValidationResult {
  const theme = validateTheme(json)
  if (!theme) return { theme: null, contrastWarnings: [] }
  const contrastResults = validateThemeContrast(theme.tokens)
  const contrastWarnings = contrastResults.filter(r => !r.passes)
  return { theme, contrastWarnings }
}
