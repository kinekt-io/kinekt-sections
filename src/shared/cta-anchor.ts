const ctaAnchor = /^#([A-Za-z][\w:.-]*)(?:\?([^\u0000-\u001F\u007F\\\s#?]+))?$/u

export interface CtaAnchorTarget {
  fragment: string
  query?: string
}

/**
 * Parses the editor-facing CTA anchor syntax: `#section-id` or
 * `#section-id?mediaType=case`. The query is returned before the fragment when
 * composing the final URL because browsers do not send query parameters after
 * a hash to the destination page.
 */
export function parseCtaAnchor(value: unknown): CtaAnchorTarget | undefined {
  if (typeof value !== 'string') return undefined
  const match = ctaAnchor.exec(value)
  if (!match) return undefined
  return { fragment: `#${match[1]}`, ...(match[2] ? { query: match[2] } : {}) }
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
