import type { Block, CollectionSlug } from 'payload'

import type { Cta, CtaGroup, CtaIcon, Media, RichText, SectionIntro } from '../../../shared/content.js'
import { richTextToHtml } from '../../../shared/rich-text.js'
import { ctaGroupToProps, mediaToProps, optionalSharpSolidIcon, optionalText, requireObject, requireText, requireTheme, type PayloadAdapterOptions } from '../../../shared/payload.js'
import { availablePublishedContentInCurrentRegion, ctaFields, ctaIconField, ctaStyleField, sectionContentWidthField } from '../../../shared/payload-fields.js'
import { normalizeSectionContentWidth, type SectionContentWidth } from '../../../shared/section-width.js'
import { isSafeCtaHref } from '../../../urls.js'

export type CaseStudyResult = {
  label: string
  value: { text?: string; icon?: string }
}

/** A renderer-owned card hydrated from an article by the CMS request path. */
export type CaseStudySlide = {
  logo?: Media
  title: string
  description?: string | RichText
  image: Media
  resultsHeading?: string
  results?: CaseStudyResult[]
  quote?: {
    quote: string
    authorName?: string
    authorRole?: string
    avatar?: Media
  }
  cta: Cta
}

export type CaseStudiesAllentownContent = {
  contentWidth?: SectionContentWidth
  theme: 'light' | 'semi-light' | 'semi-dark' | 'dark'
  intro: SectionIntro
  sectionLabel?: string
  cardReadMoreIcon?: CtaIcon
  /** Always renderer-shaped, populated from the selected published articles. */
  carousel: { items: CaseStudySlide[] }
  ctas?: CtaGroup
}

export type PayloadCaseStudiesAllentownDocument = Record<string, unknown> & { id?: string }
export type CaseStudyCtaIcon = CtaIcon
export type CaseStudiesSelectionMode = 'manual' | 'automatic'

export interface CaseStudiesArticleTypeOption {
  label: string
  value: string
}

export interface CreateCaseStudiesAllentownBlockOptions {
  /** Article collections available to Manual selection and Automatic content type filtering. */
  articleCollections?: CollectionSlug[]
  /** Content type options permitted for Automatic selection. */
  contentTypeOptions?: ReadonlyArray<{ label: string; value: CollectionSlug }>
  /** Article type options permitted for Automatic selection. */
  articleTypeOptions?: ReadonlyArray<CaseStudiesArticleTypeOption>
  pageCollection?: CollectionSlug
  targetCollections?: CollectionSlug[]
}

const textRequired = (value: unknown) => hasText(value) || 'Enter non-empty text.'

/**
 * Article-driven Case Studies block.
 *
 * Manual mode stores a localized, editor-ordered list of published article
 * relationships. Automatic mode stores its content type and optional article
 * type filter. The CMS request path scopes both modes to the active Region and
 * locale, selects published articles, resolves canonical article links, and
 * supplies the renderer-owned `carousel.items` projection.
 */
export function createCaseStudiesAllentownBlock({
  articleCollections = ['articles'],
  contentTypeOptions = articleCollections.map((value) => ({ label: value, value })),
  articleTypeOptions = [
    { label: 'Case', value: 'case' },
    { label: 'Article', value: 'article' },
    { label: 'Whitepaper', value: 'whitepaper' },
    { label: 'Video', value: 'video' },
    { label: 'Blog', value: 'blog' },
    { label: 'Interview', value: 'interview' },
    { label: 'News', value: 'news' },
  ],
  pageCollection = 'pages',
  targetCollections = [pageCollection],
}: CreateCaseStudiesAllentownBlockOptions = {}): Block {
  const targetRelation = targetCollections.length === 1 ? targetCollections[0] : targetCollections
  const availableContentTypes = contentTypeOptions.filter(({ value }) => articleCollections.includes(value))
  if (articleCollections.length === 0 || availableContentTypes.length === 0) {
    throw new Error('Case Studies requires one or more configured article collections as Automatic content type options.')
  }

  return {
    slug: 'case-studies-allentown',
    interfaceName: 'CaseStudiesAllentown',
    labels: { singular: 'Case Studies Allentown', plural: 'Case Studies Allentown blocks' },
    fields: [
      sectionContentWidthField(),
      {
        name: 'theme', type: 'select', localized: true, required: true, defaultValue: 'light',
        options: ['light', 'semi-light', 'semi-dark', 'dark'].map((value) => ({ label: value, value })),
      },
      {
        name: 'intro', type: 'group', label: 'Intro Block', localized: true, required: true,
        fields: [
          { name: 'accentHeading', type: 'text', label: 'Accent heading' },
          { name: 'heading', type: 'text', label: 'Heading', required: true, validate: textRequired },
          { name: 'description', type: 'richText', label: 'Description' },
        ],
      },
      { name: 'sectionLabel', type: 'text', label: 'Carousel label', localized: true, admin: { description: 'Optional label displayed before the carousel with a decorative line.' } },
      {
        ...ctaIconField(),
        name: 'cardReadMoreIcon',
        label: 'Card Read More icon',
        localized: true,
        admin: { description: 'Optional icon for every case card Read More link. Empty uses chevron-right.' },
      },
      {
        name: 'selectionMode', type: 'select', label: 'Case study selection', localized: true, required: true, defaultValue: 'manual',
        options: [{ label: 'Manual', value: 'manual' }, { label: 'Automatic', value: 'automatic' }],
        admin: { description: 'Select published articles in display order, or list published articles using the Automatic filters.' },
      },
      {
        name: 'caseSources', type: 'array', label: 'Case study articles', localized: true, minRows: 0,
        validate: (value: unknown, { siblingData }: { siblingData?: Record<string, unknown> }) =>
          siblingData?.selectionMode !== 'manual' || Array.isArray(value) && value.length > 0 || 'Select at least one published article.',
        admin: {
          condition: (_: unknown, siblingData: Record<string, unknown>) => siblingData?.selectionMode === 'manual',
          description: 'Select one or more published articles. Drag rows to set display order. Each card is populated from article metadata and layout.',
        },
        fields: [{
          name: 'content', type: 'relationship', relationTo: articleCollections, required: true,
          filterOptions: availablePublishedContentInCurrentRegion,
        }],
      },
      {
        name: 'contentType', type: 'select', label: 'Content type', localized: true, required: false, defaultValue: articleCollections[0],
        options: [...availableContentTypes],
        validate: (value: unknown, { siblingData }: { siblingData?: Record<string, unknown> }) =>
          siblingData?.selectionMode !== 'automatic' || typeof value === 'string' && value.length > 0 || 'Choose an article content type.',
        admin: {
          condition: (_: unknown, siblingData: Record<string, unknown>) => siblingData?.selectionMode === 'automatic',
          description: 'Choose the article content type to list automatically.',
        },
      },
      {
        name: 'articleType', type: 'select', label: 'Article type', localized: true,
        options: [...articleTypeOptions],
        admin: {
          condition: (_: unknown, siblingData: Record<string, unknown>) => siblingData?.selectionMode === 'automatic',
          description: 'Optionally limit automatic results to one article type.',
        },
      },
      {
        name: 'ctas', type: 'array', label: 'Header CTA Group', localized: true, minRows: 0, maxRows: 2,
        admin: { initCollapsed: true, description: 'Add zero, one or two actions. Set each style to Primary, Secondary, Clear or Clear base.' },
        fields: [ctaStyleField(), ...ctaFields(targetRelation, false, true)],
      },
    ],
  }
}

/**
 * Adapts a CMS-hydrated carousel projection. `carousel.items` may be empty
 * when Automatic selection finds no matching published articles; that state
 * deliberately renders no phantom card.
 */
export function caseStudiesAllentownToProps(
  data: PayloadCaseStudiesAllentownDocument,
  { contentHref, ...payloadOptions }: CaseStudiesAllentownAdapterOptions,
): CaseStudiesAllentownContent {
  const intro = requireObject(data.intro, 'intro')
  const carousel = requireObject(data.carousel, 'carousel')
  const cardReadMoreIcon = optionalSharpSolidIcon(data.cardReadMoreIcon, 'cardReadMoreIcon')
  const options = { ...payloadOptions, contentHref }
  const items = optionalArray(carousel.items, 'carousel.items').map((item, index) => slideToProps(item, index, options))

  return {
    contentWidth: normalizeSectionContentWidth(data.contentWidth),
    theme: requireTheme(data.theme),
    intro: {
      accentHeading: optionalText(intro.accentHeading, 'intro.accentHeading'),
      heading: requireText(intro.heading, 'intro.heading'),
      ...(intro.description ? { description: { html: richTextToHtml(intro.description, 'intro.description') } } : {}),
    },
    ...(optionalText(data.sectionLabel, 'sectionLabel') ? { sectionLabel: optionalText(data.sectionLabel, 'sectionLabel') } : {}),
    ...(cardReadMoreIcon ? { cardReadMoreIcon } : {}),
    carousel: { items },
    ...(ctaGroupToProps(data.ctas, 'ctas', options) ? { ctas: ctaGroupToProps(data.ctas, 'ctas', options) } : {}),
  }
}

export interface CaseStudiesAllentownAdapterOptions extends PayloadAdapterOptions {
  contentHref: (collection: string, documentID: string) => string | undefined
}

function slideToProps(value: unknown, index: number, options: PayloadAdapterOptions): CaseStudySlide {
  const item = requireObject(value, `carousel.items[${index}]`)
  const cta = requireObject(item.cta, `carousel.items[${index}].cta`)
  const results = item.results === undefined || item.results === null
    ? undefined
    : optionalArray(item.results, `carousel.items[${index}].results`).map((result, resultIndex) => resultToProps(result, index, resultIndex))
  const resultsHeading = optionalText(item.resultsHeading, `carousel.items[${index}].resultsHeading`)
  const quote = optionalQuote(item.quote, `carousel.items[${index}].quote`, options)

  return {
    ...(item.logo ? { logo: mediaToProps(item.logo, `carousel.items[${index}].logo`, options) } : {}),
    title: requireText(item.title, `carousel.items[${index}].title`),
    ...(item.description ? { description: { html: richTextToHtml(item.description, `carousel.items[${index}].description`) } } : {}),
    image: mediaToProps(item.image, `carousel.items[${index}].image`, options),
    ...(results?.length ? { results } : {}),
    ...(resultsHeading ? { resultsHeading } : {}),
    ...(quote ? { quote } : {}),
    cta: hydratedCtaToProps(cta, `carousel.items[${index}].cta`),
  }
}

function resultToProps(value: unknown, itemIndex: number, resultIndex: number): CaseStudyResult {
  const result = requireObject(value, `carousel.items[${itemIndex}].results[${resultIndex}]`)
  const metric = requireObject(result.value, `carousel.items[${itemIndex}].results[${resultIndex}].value`)
  return {
    label: requireText(result.label, `carousel.items[${itemIndex}].results[${resultIndex}].label`),
    value: {
      text: requireText(metric.text, `carousel.items[${itemIndex}].results[${resultIndex}].value.text`),
      ...(optionalSharpSolidIcon(metric.icon, `carousel.items[${itemIndex}].results[${resultIndex}].value.icon`) ? { icon: optionalSharpSolidIcon(metric.icon, `carousel.items[${itemIndex}].results[${resultIndex}].value.icon`) } : {}),
    },
  }
}

function optionalQuote(value: unknown, field: string, options: PayloadAdapterOptions): CaseStudySlide['quote'] | undefined {
  if (!value) return undefined
  const quote = requireObject(value, field)
  const text = optionalText(quote.quote, `${field}.quote`)
  const authorName = optionalText(quote.authorName, `${field}.authorName`)
  const authorRole = optionalText(quote.authorRole, `${field}.authorRole`)
  const avatar = quote.avatar ?? undefined
  if (!text && !authorName && !authorRole && !avatar) return undefined
  if (!text) throw new Error(`${field} author details require a quote.`)
  if ((authorRole || avatar) && !authorName) throw new Error(`${field} author role and portrait require an author name.`)
  return {
    quote: text,
    ...(authorName ? { authorName } : {}),
    ...(authorRole ? { authorRole } : {}),
    ...(avatar ? { avatar: mediaToProps(avatar, `${field}.avatar`, options) } : {}),
  }
}

function hydratedCtaToProps(value: Record<string, unknown>, field: string): Cta {
  const href = requireText(value.href, `${field}.href`)
  if (!isSafeCtaHref(href)) throw new Error(`${field}.href must be an HTTP(S) URL, root-relative URL, or anchor.`)
  const label = optionalText(value.label, `${field}.label`) ?? 'Read more'
  const icon = optionalSharpSolidIcon(value.icon, `${field}.icon`)
  return { label, href, ...(icon ? { icon } : {}) }
}

function optionalArray(value: unknown, field: string): unknown[] {
  if (!Array.isArray(value)) throw new Error(`${field} must be an array.`)
  return value
}

function hasText(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}
