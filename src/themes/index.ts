import type { PfTheme } from '../types'
import { THEME_MIDNIGHT } from './midnight'
import { THEME_FOCUS } from './focus'
import { THEME_LINEN } from './linen'

export { THEME_MIDNIGHT } from './midnight'
export { THEME_FOCUS } from './focus'
export { THEME_LINEN } from './linen'

export const BUNDLED_THEMES: PfTheme[] = [THEME_MIDNIGHT, THEME_FOCUS, THEME_LINEN]
export const BUNDLED_THEME_IDS = new Set(BUNDLED_THEMES.map(t => t.id))

import { registerReservedIds } from '../validate-theme'
registerReservedIds(BUNDLED_THEME_IDS)
