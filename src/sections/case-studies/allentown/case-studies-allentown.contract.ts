import type { Block, CollectionSlug } from 'payload'

import type { Cta, CtaIcon, Media, SectionIntro } from '../../../shared/content.js'
import { richTextToHtml } from '../../../shared/rich-text.js'
import { ctaToProps, mediaToProps, optionalText, requireArray, requireObject, requireText, requireTheme, type PayloadAdapterOptions } from '../../../shared/payload.js'
import { contentTargetField, ctaFields } from '../../../shared/payload-fields.js'

export type CaseStudyResult = {
  label: string
  value: { text?: string; icon?: string }
}

export type CaseStudySlide = {
  page?: string
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
  targetCollections?: CollectionSlug[]
}

export interface CaseStudiesAllentownAdapterOptions extends PayloadAdapterOptions {
  contentHref: (collection: string, documentID: string) => string | undefined
}


const textRequired = (value: unknown) => hasText(value) || 'Enter non-empty text.'

/**
 * A manually ordered Case Studies carousel with content-or-URL destinations.
 *
 * Slide copy and media remain local to the carousel. Content destinations are
 * resolved to their canonical route at manifest-build time.
 */
export function createCaseStudiesAllentownBlock({
  mediaCollection = 'media',
  pageCollection = 'pages',
  targetCollections = [pageCollection],
}: CreateCaseStudiesAllentownBlockOptions = {}): Block {
  const targetRelation = targetCollections.length === 1 ? targetCollections[0] : targetCollections
  return {
    slug: 'case-studies-allentown',
    interfaceName: 'CaseStudiesAllentown',
    labels: { singular: 'PRE-RELEASE — Case Studies Allentown', plural: 'PRE-RELEASE — Case Studies Allentown blocks' },
    fields: [
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
        name: 'cta', type: 'group', label: 'Header CTA', localized: true,
        fields: ctaFields(targetRelation),
      },
      {
        name: 'carousel', type: 'group', label: 'Carousel', localized: true, required: true,
        fields: [{
          name: 'items', type: 'array', label: 'Case studies', minRows: 1, required: true,
          admin: { description: 'Drag to set display order. A Page can be used only once.' },
          fields: [
            { name: 'destinationType', type: 'select', label: 'Link type', required: true, defaultValue: 'content', options: [{ label: 'Content', value: 'content' }, { label: 'URL', value: 'url' }] },
            { name: 'href', type: 'text', label: 'URL', admin: { condition: (_, siblingData) => siblingData?.destinationType === 'url' } },
            contentTargetField(targetRelation),
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
              admin: { description: 'Uses the Content target or URL selected for this slide.' },
              fields: [
                { name: 'label', type: 'text', label: 'Button text', required: true, validate: textRequired },
                { name: 'icon', type: 'select', label: 'Icon', options: [{ label: 'Arrow right', value: 'arrow-right' }, { label: 'Arrow down', value: 'arrow-down' }] },
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
  { contentHref, ...payloadOptions }: CaseStudiesAllentownAdapterOptions,
): CaseStudiesAllentownContent {
  const intro = requireObject(data.intro, 'intro')
  const carousel = requireObject(data.carousel, 'carousel')
  const options = { ...payloadOptions, contentHref }
  const items = requireArray(carousel.items, 'carousel.items').map((item, index) => slideToProps(item, index, options))

  return {
    theme: requireTheme(data.theme),
    intro: {
      accentHeading: optionalText(intro.accentHeading, 'intro.accentHeading'),
      heading: requireText(intro.heading, 'intro.heading'),
      ...(intro.description ? { description: { html: richTextToHtml(intro.description, 'intro.description') } } : {}),
    },
    ...(optionalText(data.sectionLabel, 'sectionLabel') ? { sectionLabel: optionalText(data.sectionLabel, 'sectionLabel') } : {}),
    carousel: { items },
    ...(optionalLinkedCta(data.cta, 'cta', options) ? { cta: optionalLinkedCta(data.cta, 'cta', options) } : {}),
  }
}

function slideToProps(value: unknown, index: number, options: PayloadAdapterOptions): CaseStudySlide {
  const item = requireObject(value, `carousel.items[${index}]`)
  const cta = requireObject(item.cta, `carousel.items[${index}].cta`)
  const destinationType = item.destinationType ?? (item.page ? 'content' : 'url')
  const action = ctaToProps({ ...cta, destinationType, page: item.page, href: item.href }, `carousel.items[${index}].cta`, options)
  const page = item.page ? relationshipID(item.page, `carousel.items[${index}].page`) : undefined
  const quote = optionalQuote(item.quote, `carousel.items[${index}].quote`, options)
  const results = item.results === undefined || item.results === null ? undefined : requireArray(item.results, `carousel.items[${index}].results`).map((result, resultIndex) => resultToProps(result, index, resultIndex))

  return {
    ...(page ? { page } : {}),
    ...(item.logo ? { logo: mediaToProps(item.logo, `carousel.items[${index}].logo`, options) } : {}),
    title: requireText(item.title, `carousel.items[${index}].title`),
    ...(optionalText(item.description, `carousel.items[${index}].description`) ? { description: optionalText(item.description, `carousel.items[${index}].description`) } : {}),
    image: mediaToProps(item.image, `carousel.items[${index}].image`, options),
    ...(results?.length ? { results } : {}),
    ...(quote ? { quote } : {}),
    cta: action,
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

function optionalLinkedCta(value: unknown, field: string, options: PayloadAdapterOptions): Cta | undefined {
  if (!value) return undefined
  const cta = requireObject(value, field)
  const label = optionalText(cta.label, `${field}.label`)
  if (!label) return undefined
  return ctaToProps(cta, field, options)
}


function relationshipID(value: unknown, field: string): string {
  if (typeof value === 'string' || typeof value === 'number') return String(value)
  const relation = requireObject(value, field)
  if (typeof relation.relationTo === 'string') {
    const document = relation.value
    if (typeof document === 'string' || typeof document === 'number') return String(document)
    return String(requireObject(document, `${field}.value`).id)
  }
  if (typeof relation.id === 'string' || typeof relation.id === 'number') return String(relation.id)
  throw new Error(`${field} must reference content.`)
}

function hasText(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}
