# @plainfold/design-tokens

Theme token contract, validation, application, and library management for the Plainfold ecosystem.

## Architecture

Depends on: `@plainfold/store` (for persisting active theme and installed themes)
Depended on by: `@plainfold/ui`, `@plainfold/charts`, `@plainfold/preferences`

## Public API

### Provider
- `PfDesignTokensProvider` — reads active theme from store on mount, applies CSS variables. Nests inside `PfStoreReady`.

### Theme Application
- `applyTheme(theme: PfTheme)` — sets CSS custom properties on document root
- `resetTheme(theme: PfTheme)` — removes theme's CSS custom properties

### Validation
- `pfThemeSchema` — Zod schema for theme validation
- `validateTheme(json)` — returns `PfTheme | null`
- `validateThemeFull(json)` — returns `{ theme, contrastWarnings }`
- `validateThemeContrast(tokens)` — checks WCAG AA critical color pairs

### Theme Library
- `ThemeLibrary.getAll()` — get user-installed themes
- `ThemeLibrary.add(theme)` — add/upsert a theme
- `ThemeLibrary.remove(id)` — remove a theme by ID

### Bundled Themes
- `BUNDLED_THEMES` — array of 3 themes: midnight (dark), linen (warm light), focus (high contrast)
- `BUNDLED_THEME_IDS` — Set of reserved IDs
- `THEME_MIDNIGHT`, `THEME_LINEN`, `THEME_FOCUS` — individual theme objects

### Utilities
- `sanitizeSvgIcon(raw)` — DOMPurify SVG sanitization
- `hexToRgb`, `getContrastRatio`, `passesAA` — WCAG contrast utilities

### CSS
- `@plainfold/design-tokens/tokens.css` — importable stylesheet with all `--pf-*` variable defaults

## Key Decisions

- **Two-tier token system:** Required tokens (6) must be in every theme. Optional tokens (33) have CSS fallback defaults. Promoting optional -> required is a major version bump.
- **Bundled theme IDs are reserved** — user-uploaded themes cannot use `midnight`, `linen`, or `focus` as IDs
- **applyTheme is pure CSS** — persistence is handled by PfDesignTokensProvider, not applyTheme itself
- **Store keys:** `pf:theme:activeTheme`, `pf:theme:installedThemes`
- **Zod >= 3.24 as peer dependency**

## Development

```bash
npm install
npm test           # Vitest (54 tests)
npm run build      # ESM + CJS via Vite library mode
npm run lint       # ESLint
npm run typecheck  # TypeScript
```

## Testing

Uses fake-indexeddb for IndexedDB in jsdom. Tests cover contrast calculations, theme validation, icon sanitization, ThemeLibrary CRUD, and provider behavior.

## CI/CD

PR: lint -> typecheck -> test -> build. Publishing via Changesets.
