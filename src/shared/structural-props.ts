import { richTextToHtml } from './rich-text.js'
import { isObjectRecord } from './type-guards.js'
import { ctaToProps, mediaToProps, optionalText, requireObject, requireText, requireTheme, type PayloadAdapterOptions } from './payload.js'

const isMedia = (value: Record<string, unknown>): boolean => 'url' in value && 'alt' in value && 'width' in value && 'height' in value
const isRichText = (value: Record<string, unknown>): boolean => 'root' in value

function adaptValue(value: unknown, field: string, options: PayloadAdapterOptions): unknown {
  if (Array.isArray(value)) return value.map((item, index) => adaptValue(item, `${field}[${index}]`, options))
  if (!isObjectRecord(value)) return value
  const entries = Object.entries(value)
  if (entries.length === 1 && entries[0][0] === 'value') return adaptValue(entries[0][1], `${field}.value`, options)
  if ('label' in value && ('destinationType' in value || 'href' in value || 'page' in value)) return ctaToProps(value, field, options)
  if (isMedia(value)) return mediaToProps(value, field, options)
  if (isRichText(value)) return { html: richTextToHtml(value, field) }
  return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, adaptValue(item, `${field}.${key}`, options)]))
}

export function structuralSectionToProps(data: Record<string, unknown>, options: PayloadAdapterOptions = {}): Record<string, unknown> {
  const section = requireObject(data, 'section')
  const intro = requireObject(section.intro, 'intro')

  return {
    ...adaptValue(section, 'section', options) as Record<string, unknown>,
    theme: requireTheme(section.theme),
    intro: {
      accentHeading: optionalText(intro.accentHeading, 'intro.accentHeading'),
      heading: requireText(intro.heading, 'intro.heading'),
      ...(intro.description === undefined || intro.description === null || intro.description === '' ? {} : { description: adaptValue(intro.description, 'intro.description', options) }),
    },
  }
}
