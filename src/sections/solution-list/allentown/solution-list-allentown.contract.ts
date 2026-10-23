import type { Block, CollectionSlug, Field } from 'payload'

import type { Cta, CtaGroup, Media, SectionIntro } from '../../../shared/content.js'
import { richTextToHtml } from '../../../shared/rich-text.js'
import { ctaGroupToProps, mediaToProps, optionalText, requireArray, requireObject, requireText, requireTheme, type PayloadAdapterOptions } from '../../../shared/payload.js'
import { isSafeWebUrl } from '../../../urls.js'

export interface SolutionListAllentownItem {
  image: Media
  accentHeading?: string
  heading: string
  label?: { text: string; icon?: string }
  description: string
  cta: Cta
}

export interface SolutionListAllentownContent {
  theme: 'light' | 'semi-light' | 'semi-dark' | 'dark'
  intro: SectionIntro
  items: SolutionListAllentownItem[]
  callout?: { intro: SectionIntro; ctaGroup: CtaGroup }
}

export type PayloadSolutionListAllentownDocument = Record<string, unknown> & { id?: string }

export interface CreateSolutionListAllentownBlockOptions {
  mediaCollection?: CollectionSlug
  pageCollection?: CollectionSlug
}

export interface SolutionListAllentownAdapterOptions extends PayloadAdapterOptions {
  pageHref: (pageID: string) => string | undefined
}


export function createSolutionListAllentownBlock({ mediaCollection = 'media', pageCollection = 'pages' }: CreateSolutionListAllentownBlockOptions = {}): Block {

  return {
    slug: 'beta-solution-list-allentown',
    interfaceName: 'BetaSolutionListAllentown',
    labels: { singular: 'PRERELEASE — Solution List Allentown', plural: 'PRERELEASE — Solution List Allentown blocks' },
    fields: [
      { name: 'theme', type: 'select', localized: true, required: true, defaultValue: 'semi-light', options: ['light', 'semi-light', 'semi-dark', 'dark'].map((value) => ({ label: value, value })) },
      { name: 'intro', label: 'Intro block', type: 'group', localized: true, required: true, fields: introFields() },
      {
        name: 'items', label: 'Items', type: 'array', localized: true, required: true, minRows: 2,
        fields: [
          { name: 'image', label: 'Image', type: 'upload', relationTo: mediaCollection, localized: true, required: true },
          { name: 'accentHeading', label: 'Accent heading', type: 'text', localized: true },
          { name: 'heading', label: 'Heading', type: 'text', localized: true, required: true, validate: (value: unknown) => hasText(value) || 'Enter non-empty text.' },
          { name: 'label', label: 'Label', type: 'group', localized: true, fields: [{ name: 'text', label: 'Text', type: 'text' }, { name: 'icon', label: 'Icon', type: 'text' }] },
          { name: 'description', label: 'Description', type: 'textarea', localized: true, required: true },
          { name: 'destinationType', label: 'Link type', type: 'select', localized: true, required: true, defaultValue: 'page', options: [{ label: 'Page', value: 'page' }, { label: 'URL', value: 'url' }] },
          { name: 'linkLabel', label: 'Link label', type: 'text', localized: true, required: true, validate: (value: unknown) => hasText(value) || 'Enter non-empty text.' },
          { name: 'href', label: 'URL', type: 'text', localized: true, admin: { condition: (_, siblingData) => siblingData?.destinationType === 'url' }, validate: (value: unknown) => value === undefined || value === null || value === '' || isSafeWebUrl(value) || 'Enter an absolute HTTP(S) URL or a site-root-relative path.' },
          { name: 'page', label: 'Page', type: 'relationship', relationTo: pageCollection, localized: true, admin: { condition: (_, siblingData) => siblingData?.destinationType === 'page' } },
        ],
      },
      { name: 'callout', label: 'Callout', type: 'group', localized: true, fields: [{ name: 'intro', label: 'Intro block', type: 'group', required: true, fields: introFields() }, { name: 'ctaGroup', label: 'CTA group', type: 'group', required: true, fields: ctaGroupFields() }] },
    ],
  }
}

export function solutionListAllentownToProps(data: PayloadSolutionListAllentownDocument, { pageHref, ...payloadOptions }: SolutionListAllentownAdapterOptions): SolutionListAllentownContent {
  const intro = introToProps(data.intro, 'intro')

  return {
    theme: requireTheme(data.theme),
    intro,
    items: requireArray(data.items, 'items').map((item, index) => itemToProps(item, index, pageHref, payloadOptions)),
    ...(data.callout ? { callout: calloutToProps(data.callout) } : {}),
  }
}

function introFields(): Field[] {
  return [
    { name: 'accentHeading', label: 'Accent heading', type: 'text' },
    { name: 'heading', label: 'Heading', type: 'text', required: true, validate: (value: unknown) => hasText(value) || 'Enter non-empty text.' },
    { name: 'description', label: 'Description', type: 'richText' },
  ]
}

function ctaGroupFields(): Field[] {
  return [['primaryButton', 'Primary CTA'], ['secondaryButton', 'Secondary CTA']].map(([name, label]) => ({ name, label, type: 'group', fields: [{ name: 'label', label: 'Link label', type: 'text' }, { name: 'href', label: 'URL', type: 'text', validate: (value: unknown) => value === undefined || value === null || value === '' || isSafeWebUrl(value) || 'Enter an absolute HTTP(S) URL or a site-root-relative path.' }, { name: 'icon', label: 'Icon', type: 'select', options: [{ label: 'Arrow right', value: 'arrow-right' }, { label: 'Arrow down', value: 'arrow-down' }] }] })) as Field[]
}

function introToProps(value: unknown, field: string): SectionIntro {
  const intro = requireObject(value, field)
  return {
    accentHeading: optionalText(intro.accentHeading, `${field}.accentHeading`),
    heading: requireText(intro.heading, `${field}.heading`),
    ...(intro.description ? { description: { html: richTextToHtml(intro.description, `${field}.description`) } } : {}),
  }
}

function itemToProps(value: unknown, index: number, pageHref: SolutionListAllentownAdapterOptions['pageHref'], options: PayloadAdapterOptions): SolutionListAllentownItem {
  const item = requireObject(value, `items[${index}]`)
  const label = item.label ? requireObject(item.label, `items[${index}].label`) : undefined
  const destination = destinationToProps(item, index, pageHref)

  return {
    image: mediaToProps(item.image, `items[${index}].image`, options),
    accentHeading: optionalText(item.accentHeading, `items[${index}].accentHeading`),
    heading: requireText(item.heading, `items[${index}].heading`),
    ...(label && optionalText(label.text, `items[${index}].label.text`) ? { label: { text: requireText(label.text, `items[${index}].label.text`), ...(optionalText(label.icon, `items[${index}].label.icon`) ? { icon: optionalText(label.icon, `items[${index}].label.icon`) } : {}) } } : {}),
    description: requireText(item.description, `items[${index}].description`),
    cta: destination,
  }
}

function destinationToProps(item: Record<string, unknown>, index: number, pageHref: SolutionListAllentownAdapterOptions['pageHref']): Cta {
  const label = requireText(item.linkLabel, `items[${index}].linkLabel`)
  if (item.destinationType === 'page') {
    const pageID = typeof item.page === 'string'
      ? item.page
      : requireText(requireObject(item.page, `items[${index}].page`).id, `items[${index}].page.id`)
    const href = pageHref(pageID)
    if (!href) throw new Error(`items[${index}].page is not available in this static build.`)
    return { label, href }
  }
  if (item.destinationType === 'url') {
    const href = requireText(item.href, `items[${index}].href`)
    if (!isSafeWebUrl(href)) throw new Error(`items[${index}].href must be an HTTP(S) or root-relative URL.`)
    return { label, href }
  }
  throw new Error(`items[${index}].destinationType must be page or url.`)
}

function calloutToProps(value: unknown): NonNullable<SolutionListAllentownContent['callout']> {
  const callout = requireObject(value, 'callout')
  const ctaGroup = requireObject(callout.ctaGroup, 'callout.ctaGroup')
  return {
    intro: introToProps(callout.intro, 'callout.intro'),
    ctaGroup: ctaGroupToProps({ primary: ctaGroup.primaryButton, secondary: ctaGroup.secondaryButton }, 'callout.ctaGroup', true)!,
  }
}

function hasText(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}
