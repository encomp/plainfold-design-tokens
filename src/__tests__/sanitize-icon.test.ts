import { describe, it, expect } from 'vitest'
import { sanitizeSvgIcon } from '../sanitize-icon'

describe('sanitizeSvgIcon', () => {
  it('preserves valid SVG', () => {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="5"/></svg>'
    expect(sanitizeSvgIcon(svg)).toContain('<svg')
    expect(sanitizeSvgIcon(svg)).toContain('<circle')
  })

  it('strips script tags', () => {
    const malicious = '<svg><script>alert("xss")</script><circle cx="10" cy="10" r="5"/></svg>'
    const result = sanitizeSvgIcon(malicious)
    expect(result).not.toContain('<script')
    expect(result).not.toContain('alert')
  })

  it('strips event handlers', () => {
    const malicious = '<svg onload="alert(1)"><circle cx="10" cy="10" r="5"/></svg>'
    const result = sanitizeSvgIcon(malicious)
    expect(result).not.toContain('onload')
    expect(result).not.toContain('alert')
  })

  it('returns empty string for non-SVG input', () => {
    expect(sanitizeSvgIcon('<div>not svg</div>')).toBe('')
  })
})
