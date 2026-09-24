const hasUnsafeCharacters = /[\u0000-\u001F\u007F\\\s]/u
const absoluteHttpUrl = /^https?:\/\//iu

/**
 * Whether a value is a safe HTTP(S) absolute URL or a same-origin root-relative URL.
 * Protocol-relative URLs are deliberately not accepted.
 */
export function isSafeWebUrl(value: unknown): value is string {
  if (typeof value !== 'string' || value.length === 0 || hasUnsafeCharacters.test(value)) {
    return false
  }

  if (value.startsWith('/')) {
    return !value.startsWith('//')
  }

  if (!absoluteHttpUrl.test(value)) {
    return false
  }

  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}
