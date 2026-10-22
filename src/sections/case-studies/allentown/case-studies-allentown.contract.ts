import type { Block, CollectionSlug, RelationshipField } from 'payload'

import type { Cta, CtaIcon, Media, SectionIntro } from '../../../shared/content.js'
import { isSafeWebUrl } from '../../../urls.js'
import { richTextToHtml } from '../../../shared/rich-text.js'
import { mediaToProps, optionalText, requireArray, requireObject, requireText, requireTheme, type PayloadAdapterOptions } from '../../../shared/payload.js'

export type CaseStudyResult = {
  label: string
  value: { text?: string; icon?: string }
}

export type CaseStudySlide = {
  page: string
  logo?: Media
  title: string
  description?: string
  image: Media
  results?: CaseStudyResult[]
  quote?: {
    quote: string
    authorName: string
    authorRole?: string
    avatar?: Media
  }
  cta: Cta
}

export type CaseStudiesAllentownContent = {
  theme: 'light' | 'semi-light' | 'semi-dark' | 'dark'
  intro: SectionIntro
  sectionLabel?: string
  carousel: { items: CaseStudySlide[] }
  cta?: Cta
}

export type PayloadCaseStudiesAllentownDocument = Record<string, unknown> & { id?: string }
export type CaseStudyCtaIcon = CtaIcon

export interface CreateCaseStudiesAllentownBlockOptions {
  mediaCollection?: CollectionSlug
  pageCollection?: CollectionSlug
  pageFilterOptions?: RelationshipField['filterOptions']
}

export interface CaseStudiesAllentownAdapterOptions extends PayloadAdapterOptions {
  pageHref: (pageID: string) => string | undefined
}

const ctaIconOptions = [
  { label: 'Arrow right', value: 'arrow-right' },
  { label: 'Arrow down', value: 'arrow-down' },
]

const textRequired = (value: unknown) => hasText(value) || 'Enter non-empty text.'
const urlRequired = (value: unknown) => isSafeWebUrl(value) || 'Enter an absolute HTTP(S) URL or a site-root-relative path.'

/**
 * A page-backed, manually ordered Case Studies carousel.
 *
 * Slide copy and media intentionally remain local to the carousel. The selected
 * published Page only provides its canonical destination at manifest-build time.
 */
export function createCaseStudiesAllentownBlock({
  mediaCollection = 'media',
  pageCollection = 'pages',
  pageFilterOptions,
}: CreateCaseStudiesAllentownBlockOptions = {}): Block {
  return {
    slug: 'case-studies-allentown',
    interfaceName: 'CaseStudiesAllentown',
    labels: { singular: 'PRE-RELEASE — Case Studies Allentown', plural: 'PRE-RELEASE — Case Studies Allentown blocks' },
    fields: [
      {
        name: 'theme', type: 'select', required: true, defaultValue: 'light',
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
        name: 'cta', type: 'group', label: 'Header CTA', localized: true,
        fields: [
          { name: 'label', type: 'text', label: 'Button text', validate: (value: unknown) => value === undefined || value === null || value === '' || textRequired(value) },
          { name: 'href', type: 'text', label: 'Link', validate: (value: unknown) => value === undefined || value === null || value === '' || urlRequired(value) },
          { name: 'icon', type: 'select', label: 'Icon', options: ctaIconOptions },
        ],
      },
      {
        name: 'carousel', type: 'group', label: 'Carousel', localized: true, required: true,
        fields: [{
          name: 'items', type: 'array', label: 'Case studies', minRows: 1, required: true,
          admin: { description: 'Drag to set display order. A Page can be used only once.' },
          fields: [
            { name: 'page', type: 'relationship', label: 'Destination page', relationTo: pageCollection, required: true, filterOptions: pageFilterOptions, admin: { description: 'The button always links here. Save-time validation requires a published Page available in this Region and locale.' } },
            { name: 'logo', type: 'upload', label: 'Logo', relationTo: mediaCollection, localized: true },
            { name: 'title', type: 'text', label: 'Title', localized: true, required: true, validate: textRequired },
            { name: 'description', type: 'textarea', label: 'Description', localized: true },
            { name: 'image', type: 'upload', label: 'Image', relationTo: mediaCollection, localized: true, required: true },
            {
              name: 'results', type: 'array', label: 'Results', localized: true,
              fields: [
                { name: 'label', type: 'text', label: 'Label', required: true, validate: textRequired },
                { name: 'value', type: 'group', label: 'Value', required: true, fields: [
                  { name: 'text', type: 'text', label: 'Text', required: true, validate: textRequired },
                  { name: 'icon', type: 'text', label: 'Icon' },
                ] },
              ],
            },
            {
              name: 'quote', type: 'group', label: 'Quote', localized: true,
              fields: [
                { name: 'quote', type: 'textarea', label: 'Quote' },
                { name: 'authorName', type: 'text', label: 'Author name' },
                { name: 'authorRole', type: 'text', label: 'Author role' },
                { name: 'avatar', type: 'upload', label: 'Author portrait', relationTo: mediaCollection },
              ],
            },
            {
              name: 'cta', type: 'group', label: 'Slide CTA', localized: true, required: true,
              admin: { description: 'The destination is always the selected Page.' },
              fields: [
                { name: 'label', type: 'text', label: 'Button text', required: true, validate: textRequired },
                { name: 'icon', type: 'select', label: 'Icon', options: ctaIconOptions },
              ],
            },
          ],
        }],
      },
    ],
  }
}

export function caseStudiesAllentownToProps(
  data: PayloadCaseStudiesAllentownDocument,
  { pageHref, ...payloadOptions }: CaseStudiesAllentownAdapterOptions,
): CaseStudiesAllentownContent {
  const intro = requireObject(data.intro, 'intro')
  const carousel = requireObject(data.carousel, 'carousel')
  const items = requireArray(carousel.items, 'carousel.items').map((item, index) => slideToProps(item, index, pageHref, payloadOptions))

  return {
    theme: requireTheme(data.theme),
    intro: {
      accentHeading: optionalText(intro.accentHeading, 'intro.accentHeading'),
      heading: requireText(intro.heading, 'intro.heading'),
      ...(intro.description ? { description: { html: richTextToHtml(intro.description, 'intro.description') } } : {}),
    },
    ...(optionalText(data.sectionLabel, 'sectionLabel') ? { sectionLabel: optionalText(data.sectionLabel, 'sectionLabel') } : {}),
    carousel: { items },
    ...(optionalLinkedCta(data.cta, 'cta') ? { cta: optionalLinkedCta(data.cta, 'cta') } : {}),
  }
}

function slideToProps(value: unknown, index: number, pageHref: CaseStudiesAllentownAdapterOptions['pageHref'], options: PayloadAdapterOptions): CaseStudySlide {
  const item = requireObject(value, `carousel.items[${index}]`)
  const page = relationshipID(item.page, `carousel.items[${index}].page`)
  const href = pageHref(page)
  if (!href) throw new Error(`carousel.items[${index}].page is not available in this static build.`)
  const cta = requireObject(item.cta, `carousel.items[${index}].cta`)
  const quote = optionalQuote(item.quote, `carousel.items[${index}].quote`, options)
  const results = item.results === undefined || item.results === null ? undefined : requireArray(item.results, `carousel.items[${index}].results`).map((result, resultIndex) => resultToProps(result, index, resultIndex))

  return {
    page,
    ...(item.logo ? { logo: mediaToProps(item.logo, `carousel.items[${index}].logo`, options) } : {}),
    title: requireText(item.title, `carousel.items[${index}].title`),
    ...(optionalText(item.description, `carousel.items[${index}].description`) ? { description: optionalText(item.description, `carousel.items[${index}].description`) } : {}),
    image: mediaToProps(item.image, `carousel.items[${index}].image`, options),
    ...(results?.length ? { results } : {}),
    ...(quote ? { quote } : {}),
    cta: {
      label: requireText(cta.label, `carousel.items[${index}].cta.label`),
      href,
      ...(ctaIcon(cta.icon, `carousel.items[${index}].cta.icon`) ? { icon: ctaIcon(cta.icon, `carousel.items[${index}].cta.icon`) } : {}),
    },
  }
}

function resultToProps(value: unknown, itemIndex: number, resultIndex: number): CaseStudyResult {
  const result = requireObject(value, `carousel.items[${itemIndex}].results[${resultIndex}]`)
  const metric = requireObject(result.value, `carousel.items[${itemIndex}].results[${resultIndex}].value`)
  return {
    label: requireText(result.label, `carousel.items[${itemIndex}].results[${resultIndex}].label`),
    value: {
      text: requireText(metric.text, `carousel.items[${itemIndex}].results[${resultIndex}].value.text`),
      ...(optionalText(metric.icon, `carousel.items[${itemIndex}].results[${resultIndex}].value.icon`) ? { icon: optionalText(metric.icon, `carousel.items[${itemIndex}].results[${resultIndex}].value.icon`) } : {}),
    },
  }
}

function optionalQuote(value: unknown, field: string, options: PayloadAdapterOptions): CaseStudySlide['quote'] | undefined {
  if (!value) return undefined
  const quote = requireObject(value, field)
  const text = optionalText(quote.quote, `${field}.quote`)
  const authorName = optionalText(quote.authorName, `${field}.authorName`)
  if (!text && !authorName) return undefined
  if (!text || !authorName) throw new Error(`${field} requires both quote and author name.`)
  return {
    quote: text,
    authorName,
    ...(optionalText(quote.authorRole, `${field}.authorRole`) ? { authorRole: optionalText(quote.authorRole, `${field}.authorRole`) } : {}),
    ...(quote.avatar ? { avatar: mediaToProps(quote.avatar, `${field}.avatar`, options) } : {}),
  }
}

function optionalLinkedCta(value: unknown, field: string): Cta | undefined {
  if (!value) return undefined
  const cta = requireObject(value, field)
  const label = optionalText(cta.label, `${field}.label`)
  const href = optionalText(cta.href, `${field}.href`)
  if (!label && !href) return undefined
  if (!label || !href) throw new Error(`${field} requires both button text and link.`)
  if (!isSafeWebUrl(href)) throw new Error(`${field}.href must be an HTTP(S) or root-relative URL.`)
  return { label, href, ...(ctaIcon(cta.icon, `${field}.icon`) ? { icon: ctaIcon(cta.icon, `${field}.icon`) } : {}) }
}

function ctaIcon(value: unknown, field: string): CtaIcon | undefined {
  if (value === undefined || value === null || value === '') return undefined
  if (value === 'arrow-right' || value === 'arrow-down') return value
  throw new Error(`${field} must be arrow-right or arrow-down.`)
}

function relationshipID(value: unknown, field: string): string {
  if (typeof value === 'string') return value
  if (value && typeof value === 'object' && 'id' in value && typeof value.id === 'string') return value.id
  throw new Error(`${field} must reference a Page.`)
}

function hasText(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}
