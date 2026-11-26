const ctaAnchor = /^(?:\?([^\u0000-\u001F\u007F\\\s#?]+))?#([A-Za-z][\w:.-]*)$/u

export interface CtaAnchorTarget {
  fragment: string
  query?: string
}

/**
 * Parses a browser-valid CTA anchor: `#section-id` or
 * `?mediaType=case#section-id`.
 */
export function parseCtaAnchor(value: unknown): CtaAnchorTarget | undefined {
  if (typeof value !== 'string') return undefined
  const match = ctaAnchor.exec(value)
  if (!match) return undefined
  return { fragment: `#${match[2]}`, ...(match[1] ? { query: match[1] } : {}) }
}

export function isSafeCtaAnchor(value: unknown): value is string {
  return parseCtaAnchor(value) !== undefined
}

/** Adds a validated CTA anchor to a route, preserving an existing route query. */
export function appendCtaAnchor(href: string, anchor: unknown): string | undefined {
  const target = parseCtaAnchor(anchor)
  if (!target) return undefined
  return `${href}${target.query ? `${href.includes('?') ? '&' : '?'}${target.query}` : ''}${target.fragment}`
}
