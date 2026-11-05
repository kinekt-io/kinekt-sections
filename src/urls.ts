const hasUnsafeCharacters = /[\u0000-\u001F\u007F\\\s]/u
const absoluteHttpUrl = /^https?:\/\//iu

const fragmentIdentifier = /^#[A-Za-z][\w:.-]*$/u

/** Whether a value is a safe fragment identifier for a same-page or content-targeted CTA. */
export function isSafeFragmentIdentifier(value: unknown): value is string {
  return typeof value === 'string' && fragmentIdentifier.test(value)
}

/** Whether a value is a safe CTA target: an HTTP(S) URL, root-relative route, or fragment identifier. */
export function isSafeCtaHref(value: unknown): value is string {
  return isSafeWebUrl(value) || isSafeFragmentIdentifier(value)
}

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
