import type { Block } from 'payload'

import type { Cta, SectionIntro } from '../../../shared/content.js'
import { optionalCtaToProps, optionalText, requireObject, requireText, requireTheme, type PayloadAdapterOptions } from '../../../shared/payload.js'
import { richTextToHtml } from '../../../shared/rich-text.js'
import { normalizeSectionContentWidth, type SectionContentWidth } from '../../../shared/section-width.js'

export type RelatedContentSelectionMode = 'automatic' | 'manual'

/** A renderer-owned card hydrated from selected content by the CMS request path. */
export type RelatedContentCard = Record<string, unknown> & {
  title: string
  href: string
  excerpt?: string
  kind?: string
}

export interface BetaRelatedContentAllentownContent {
  contentWidth?: SectionContentWidth
  theme: 'light' | 'semi-light' | 'semi-dark' | 'dark'
  intro: SectionIntro
  /** Always renderer-shaped, supplied by the CMS request path for either selection mode. */
  contentSources: RelatedContentCard[]
  cta?: Cta
}

export type PayloadBetaRelatedContentAllentownDocument = Record<string, unknown> & { id?: string }

/** Extend the existing manifest schema without changing its nested reusable fields. */
export const withRelatedContentSelection = (block: Block): Block => ({
  ...block,
  fields: block.fields.map((field) => {
    if (!('name' in field) || field.name !== 'contentSources' || field.type !== 'array') return field
    return {
      ...field,
      minRows: 0,
      validate: (value: unknown, { siblingData }: { siblingData?: Record<string, unknown> }) =>
        siblingData?.selectionMode !== 'manual' || Array.isArray(value) && value.length > 0 || 'Select at least one published content item.',
      admin: {
        ...field.admin,
        condition: (_: unknown, siblingData: Record<string, unknown>) => siblingData?.selectionMode === 'manual',
        description: 'Select published content in display order. Automatic mode uses matching regional Articles instead.',
      },
    }
  }),
})

/**
 * Adapts the CMS-hydrated card projection. Automatic selection may produce no
 * matching Articles; that valid result deliberately contains no phantom card.
 */
export function betaRelatedContentAllentownToProps(
  data: PayloadBetaRelatedContentAllentownDocument,
  options: PayloadAdapterOptions = {},
): BetaRelatedContentAllentownContent {
  const intro = requireObject(data.intro, 'intro')
  const cta = data.cta === undefined || data.cta === null
    ? undefined
    : optionalCtaToProps(requireObject(data.cta, 'cta').cta, 'cta.cta', options)
  const sources = data.contentSources ?? []
  if (!Array.isArray(sources)) throw new Error('contentSources must be an array.')

  return {
    contentWidth: normalizeSectionContentWidth(data.contentWidth),
    theme: requireTheme(data.theme),
    intro: {
      accentHeading: optionalText(intro.accentHeading, 'intro.accentHeading'),
      heading: requireText(intro.heading, 'intro.heading'),
      ...(intro.description ? { description: { html: richTextToHtml(intro.description, 'intro.description') } } : {}),
    },
    contentSources: sources.map((source, index) => relatedContentCardToProps(source, index)),
    ...(cta ? { cta } : {}),
  }
}

function relatedContentCardToProps(value: unknown, index: number): RelatedContentCard {
  const source = requireObject(value, `contentSources[${index}]`)

  return {
    ...source,
    title: requireText(source.title, `contentSources[${index}].title`),
    href: requireText(source.href, `contentSources[${index}].href`),
  }
}

