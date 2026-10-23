import { isSafeWebUrl } from '../urls.js'
import type { Cta, CtaGroup, CtaIcon, Media } from './content.js'
export type BetaTheme = 'light' | 'semi-light' | 'dark' | 'semi-dark'
export type PayloadAdapterOptions = { mediaBaseUrl?: string }
export const requireObject = (value: unknown, field: string): Record<string, unknown> => { if (typeof value !== 'object' || value === null || Array.isArray(value)) throw new Error(`${field} must be an object.`); return value as Record<string, unknown> }
export const requireArray = (value: unknown, field: string): unknown[] => { if (!Array.isArray(value) || value.length === 0) throw new Error(`${field} must contain at least one item.`); return value }
export const requireText = (value: unknown, field: string): string => { if (typeof value !== 'string' || value.trim().length === 0) throw new Error(`${field} must be non-empty text.`); return value }
export const optionalText = (value: unknown, field: string): string | undefined => value === undefined || value === null || value === '' ? undefined : requireText(value, field)
export const requireTheme = (value: unknown, field = 'theme'): BetaTheme => { if (value === 'light' || value === 'semi-light' || value === 'dark' || value === 'semi-dark') return value; throw new Error(`${field} must be light, semi-light, dark, or semi-dark.`) }
const withMediaBaseUrl = (url: string, mediaBaseUrl: string | undefined): string => { if (url.startsWith('/') && mediaBaseUrl) return new URL(url, mediaBaseUrl).toString(); if (!isSafeWebUrl(url)) throw new Error('Media URL must be an HTTP(S) or root-relative URL.'); return url }
export const mediaToProps = (value: unknown, field: string, { mediaBaseUrl }: PayloadAdapterOptions = {}): Media => {
  const media = requireObject(value, field)
  const url = requireText(media.url, `${field}.url`)
  const alt = requireText(media.alt, `${field}.alt`)
  const width = media.width
  const height = media.height
  if (typeof width !== 'number' || !Number.isSafeInteger(width) || width <= 0) throw new Error(`${field}.width must be a positive integer.`)
  if (typeof height !== 'number' || !Number.isSafeInteger(height) || height <= 0) throw new Error(`${field}.height must be a positive integer.`)
  const renditions = typeof media.sizes === 'object' && media.sizes !== null ? media.sizes as Record<string, unknown> : {}
  const sources = ['content480', 'content960', 'hero1440'].flatMap((name) => {
    const rendition = renditions[name]
    if (typeof rendition !== 'object' || rendition === null || Array.isArray(rendition)) return []
    const props = rendition as Record<string, unknown>
    if (typeof props.url !== 'string' || typeof props.width !== 'number' || typeof props.height !== 'number') return []
    return [{ url: withMediaBaseUrl(props.url, mediaBaseUrl), width: props.width, height: props.height }]
  })
  return { url: withMediaBaseUrl(url, mediaBaseUrl), alt, width, height, ...(sources.length ? { sources } : {}) }
}
const ctaToProps = (value: unknown, field: string): Cta => { const cta = requireObject(value, field); const href = requireText(cta.href, `${field}.href`); if (!isSafeWebUrl(href)) throw new Error(`${field}.href must be an HTTP(S) or root-relative URL.`); const icon = cta.icon; if (icon !== undefined && icon !== 'arrow-right' && icon !== 'arrow-down') throw new Error(`${field}.icon must be arrow-right or arrow-down.`); return { label: requireText(cta.label, `${field}.label`), href, ...(icon ? { icon: icon as CtaIcon } : {}) } }
const hasCompleteCta = (value: unknown): boolean => { if (typeof value !== 'object' || value === null || Array.isArray(value)) return false; const cta = value as Record<string, unknown>; return typeof cta.label === 'string' && cta.label.trim().length > 0 && typeof cta.href === 'string' && cta.href.trim().length > 0 }
export const ctaGroupToProps = (value: unknown, field: string): CtaGroup | undefined => { if (value === undefined || value === null) return undefined; const group = requireObject(value, field); const primary = hasCompleteCta(group.primary) ? ctaToProps(group.primary, `${field}.primary`) : undefined; const secondary = hasCompleteCta(group.secondary) ? ctaToProps(group.secondary, `${field}.secondary`) : undefined; if (!primary && !secondary) return undefined; return { primary, secondary } }
