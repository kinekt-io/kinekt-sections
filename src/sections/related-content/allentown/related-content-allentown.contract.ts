import type { Block, CollectionSlug } from 'payload'

import type { Cta, SectionIntro } from '../../../shared/content.js'
import { ctaFields, sectionContentWidthField } from '../../../shared/payload-fields.js'
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

export interface CreateBetaRelatedContentAllentownBlockOptions {
  /** Collections that a Content CTA may target. */
  targetCollections?: CollectionSlug[]
  /** Published collections available to the Manual picker. Defaults to `targetCollections`. */
  contentCollections?: CollectionSlug[]
  formCollection?: CollectionSlug
}


/**
 * Article-driven Related Content block.
 *
 * Automatic mode intentionally stores no editor-selected Articles. The CMS
 * request path preserves Region and locale boundaries, excludes the current
 * Article, and provides its newest matching Article cards. Manual mode stores
 * the localized, editor-ordered content relationships instead.
 */
export function createBetaRelatedContentAllentownBlock({
  targetCollections = ['pages'],
  contentCollections = targetCollections,
  formCollection = 'embeds',
}: CreateBetaRelatedContentAllentownBlockOptions = {}): Block {
  if (contentCollections.length === 0) {
    throw new Error('Related Content requires one or more configured content collections.')
  }
  if (targetCollections.length === 0) {
    throw new Error('Related Content requires one or more configured CTA target collections.')
  }

  const ctaTargetRelation = targetCollections.length === 1 ? targetCollections[0] : targetCollections

  return {
    slug: 'beta-related-content-allentown',
    interfaceName: 'BetaRelatedContentAllentown',
    labels: { singular: 'Related Content Allentown', plural: 'Related Content Allentown blocks' },
    fields: [
      sectionContentWidthField(),
      {
        name: 'theme', type: 'select', localized: true, required: true,
        options: ['light', 'semi-light', 'semi-dark', 'dark'].map((value) => ({ label: value, value })),
      },
      {
        name: 'intro', type: 'group', label: 'Intro Block', localized: true, required: true,
        fields: [
          { name: 'accentHeading', type: 'text', label: 'Accent heading' },
          { name: 'heading', type: 'text', label: 'Heading', required: true },
          { name: 'description', type: 'richText', label: 'Description' },
        ],
      },
      {
        name: 'selectionMode', type: 'select', label: 'Related content selection', localized: true, required: true, defaultValue: 'automatic',
        options: [{ label: 'Automatic', value: 'automatic' }, { label: 'Manual', value: 'manual' }],
        admin: { description: 'Automatically show related published Articles, or manually choose the display order for published content.' },
      },
      {
        name: 'contentSources', type: 'array', label: 'Related content', localized: true, minRows: 0,
        validate: (value: unknown, { siblingData }: { siblingData?: Record<string, unknown> }) =>
          siblingData?.selectionMode !== 'manual' || Array.isArray(value) && value.length > 0 || 'Select at least one published content item.',
        admin: {
          condition: (_: unknown, siblingData: Record<string, unknown>) => siblingData?.selectionMode === 'manual',
          description: 'Select one or more published content items. Drag rows to set display order. Each card is populated from the selected content metadata and layout.',
        },
        fields: [{
          name: 'content', type: 'relationship', relationTo: contentCollections, required: true,
          filterOptions: { _status: { equals: 'published' } },
        }],
      },
      {
        name: 'cta', type: 'group', label: 'Overview action', localized: true,
        admin: { description: 'Optional Content-or-URL overview action.' },
        fields: [{ name: 'cta', type: 'group', fields: ctaFields(ctaTargetRelation, false, true, formCollection) }],
      },
    ],
  }
}

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

