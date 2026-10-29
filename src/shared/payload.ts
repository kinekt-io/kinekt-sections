import { isSafeWebUrl } from '../urls.js'
import type { Cta, CtaGroup, Media } from './content.js'
import { ctaIconOptions, isCtaIcon } from './cta-icons.js'
export type BetaTheme = 'light' | 'semi-light' | 'dark' | 'semi-dark'
export type PayloadAdapterOptions = {
  mediaBaseUrl?: string
  contentHref?: (collection: string, documentID: string) => string | undefined
}
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
const relationshipTarget = (value: unknown, field: string): { collection: string; id: string } => {
  const relationshipID = (candidate: unknown, identifierField: string): string => {
    if (typeof candidate === 'string' && candidate.trim().length > 0) return candidate
    if (typeof candidate === 'number' && Number.isSafeInteger(candidate)) return String(candidate)
    throw new Error(`${identifierField} must reference content.`)
  }

  if (typeof value === 'string' || typeof value === 'number') {
    return { collection: 'pages', id: relationshipID(value, field) }
  }

  const relation = requireObject(value, field)
  if ('relationTo' in relation) {
    if (typeof relation.relationTo !== 'string' || relation.relationTo.trim().length === 0) {
      throw new Error(`${field}.relationTo must name a content collection.`)
    }
    const document = relation.value
    if (typeof document === 'object' && document !== null && !Array.isArray(document)) {
      return { collection: relation.relationTo, id: relationshipID(requireObject(document, `${field}.value`).id, `${field}.value.id`) }
    }
    return { collection: relation.relationTo, id: relationshipID(document, `${field}.value`) }
  }
  return { collection: 'pages', id: relationshipID(relation.id, `${field}.id`) }
}

export const ctaToProps = (value: unknown, field: string, options: PayloadAdapterOptions = {}): Cta => {
  const cta = requireObject(value, field)
  const destinationType = cta.destinationType ?? 'url'
  let href: string
  if (destinationType === 'content' || destinationType === 'page') {
    const target = relationshipTarget(cta.page, `${field}.page`)
    href = options.contentHref?.(target.collection, target.id) ?? ''
    if (!href) throw new Error(`${field}.page is not available in this static build.`)
  } else if (destinationType === 'url') {
    href = requireText(cta.href, `${field}.href`)
    if (!isSafeWebUrl(href)) throw new Error(`${field}.href must be an HTTP(S) or root-relative URL.`)
  } else {
    throw new Error(`${field}.destinationType must be content or url.`)
  }
  const icon = cta.icon
  if (icon !== undefined && icon !== null && icon !== '' && !isCtaIcon(icon)) {
    throw new Error(`${field}.icon must be one of ${ctaIconOptions.map((option) => option.value).join(', ')}.`)
  }
  return { label: requireText(cta.label, `${field}.label`), href, ...(isCtaIcon(icon) ? { icon } : {}) }
}

export const optionalCtaToProps = (value: unknown, field: string, options: PayloadAdapterOptions = {}): Cta | undefined => {
  if (value === undefined || value === null) return undefined
  const cta = requireObject(value, field)
  if (typeof cta.label !== 'string' || cta.label.trim().length === 0) return undefined

  const destinationType = cta.destinationType ?? 'url'
  if (destinationType === 'content' || destinationType === 'page') {
    if (cta.page === undefined || cta.page === null || cta.page === '') return undefined
  } else if (destinationType === 'url') {
    if (typeof cta.href !== 'string' || cta.href.trim().length === 0) return undefined
  }

  return ctaToProps(cta, field, options)
}

export const ctaGroupToProps = (value: unknown, field: string, options: PayloadAdapterOptions = {}): CtaGroup | undefined => {
  if (value === undefined || value === null) return undefined
  const group = Array.isArray(value) ? {} : requireObject(value, field)
  const entries = Array.isArray(value) ? value : group.buttons
  if (Array.isArray(entries)) {
    const buttons: Cta[] = []
    entries.slice(0, 2).forEach((button, index) => {
      const cta = optionalCtaToProps(button, `${field}.buttons.${index}`, options)
      if (!cta) return
      const style = requireObject(button, `${field}.buttons.${index}`).style
      buttons.push({ ...cta, style: style === 'primary' || style === 'secondary' || style === 'clear' ? style : 'primary' })
    })
    return buttons.length > 0 ? { buttons, primary: buttons[0], secondary: buttons[1] } : undefined
  }
  const primary = optionalCtaToProps(group.primary, `${field}.primary`, options)
  const secondary = optionalCtaToProps(group.secondary, `${field}.secondary`, options)
  if (!primary && !secondary) return undefined
  return { primary, secondary }
}
