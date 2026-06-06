import DOMPurify from 'dompurify'

export function sanitizeSvgIcon(raw: string): string {
  if (!/<svg[\s>]/i.test(raw)) return ''
  const clean = DOMPurify.sanitize(raw, {
    USE_PROFILES: { svg: true, svgFilters: true },
  })
  return clean
}
