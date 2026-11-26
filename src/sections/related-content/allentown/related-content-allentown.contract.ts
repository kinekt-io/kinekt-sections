import type { Block } from 'payload'

import type { Cta, CtaIcon, SectionIntro } from '../../../shared/content.js'
import { optionalCtaToProps, optionalSharpSolidIcon, optionalText, requireObject, requireText, requireTheme, type PayloadAdapterOptions } from '../../../shared/payload.js'
import { richTextToHtml } from '../../../shared/rich-text.js'
import { normalizeSectionContentWidth, type SectionContentWidth } from '../../../shared/section-width.js'
import { ctaIconField } from '../../../shared/payload-fields.js'

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
  cardReadMoreIcon?: CtaIcon
  cta?: Cta
}

export type PayloadBetaRelatedContentAllentownDocument = Record<string, unknown> & { id?: string }

/** Extend the existing manifest schema without changing its nested reusable fields. */
export const withRelatedContentSelection = (block: Block): Block => ({
  ...block,
  fields: block.fields.map((field) => {
    if ('name' in field && field.name === 'cardReadMoreIcon') {
      return {
        ...ctaIconField(),
        name: 'cardReadMoreIcon',
        label: 'Card Read More icon',
        localized: true,
        admin: { description: 'Optional icon for every related-content card Read More link. Empty uses chevron-right.' },
      }
    }
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
  const cardReadMoreIcon = optionalSharpSolidIcon(data.cardReadMoreIcon, 'cardReadMoreIcon')
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
    ...(cardReadMoreIcon ? { cardReadMoreIcon } : {}),
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

