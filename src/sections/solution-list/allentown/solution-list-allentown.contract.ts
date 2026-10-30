import type { Block, CollectionSlug, Field } from 'payload'

import type { Cta, CtaGroup, Media, SectionIntro } from '../../../shared/content.js'
import { richTextToHtml } from '../../../shared/rich-text.js'
import { mediaToProps, optionalSharpSolidIcon, optionalText, requireArray, requireObject, requireText, requireTheme, type PayloadAdapterOptions } from '../../../shared/payload.js'
import { isSafeWebUrl } from '../../../urls.js'
import { isSharpSolidIconNameOrEmpty } from '../../../shared/payload-fields.js'

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
  targetCollections?: CollectionSlug[]
}

export interface SolutionListAllentownAdapterOptions extends PayloadAdapterOptions {
  contentHref: (collection: string, documentID: string) => string | undefined
}

export function createSolutionListAllentownBlock({ mediaCollection = 'media', targetCollections = ['pages'] }: CreateSolutionListAllentownBlockOptions = {}): Block {
  const targetRelation = targetCollections.length === 1 ? targetCollections[0] : targetCollections

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
          { name: 'destinationType', label: 'Link type', type: 'select', localized: true, required: true, defaultValue: 'page', options: [{ label: 'Content', value: 'page' }, { label: 'URL', value: 'url' }] },
          { name: 'linkLabel', label: 'Link label', type: 'text', localized: true, required: true, validate: (value: unknown) => hasText(value) || 'Enter non-empty text.' },
          { name: 'href', label: 'URL', type: 'text', localized: true, admin: { condition: (_, siblingData) => siblingData?.destinationType === 'url' }, validate: (value: unknown) => value === undefined || value === null || value === '' || isSafeWebUrl(value) || 'Enter an absolute HTTP(S) URL or a site-root-relative path.' },
          targetField(targetRelation, true),
        ],
      },
      { name: 'callout', label: 'Callout', type: 'group', localized: true, fields: [{ name: 'intro', label: 'Intro block', type: 'group', required: true, fields: introFields() }, { name: 'ctaGroup', label: 'CTA group', type: 'group', required: true, fields: ctaGroupFields(targetRelation) }] },
    ],
  }
}

export function solutionListAllentownToProps(data: PayloadSolutionListAllentownDocument, { contentHref, ...payloadOptions }: SolutionListAllentownAdapterOptions): SolutionListAllentownContent {
  const intro = introToProps(data.intro, 'intro')

  return {
    theme: requireTheme(data.theme),
    intro,
    items: requireArray(data.items, 'items').map((item, index) => itemToProps(item, index, contentHref, payloadOptions)),
    ...(data.callout ? { callout: calloutToProps(data.callout, contentHref) } : {}),
  }
}

function introFields(): Field[] {
  return [
    { name: 'accentHeading', label: 'Accent heading', type: 'text' },
    { name: 'heading', label: 'Heading', type: 'text', required: true, validate: (value: unknown) => hasText(value) || 'Enter non-empty text.' },
    { name: 'description', label: 'Description', type: 'richText' },
  ]
}

function ctaGroupFields(targetRelation: CollectionSlug | CollectionSlug[]): Field[] {
  return [['primaryButton', 'Primary CTA'], ['secondaryButton', 'Secondary CTA']].map(([name, label]) => ({
    name,
    label,
    type: 'group',
    fields: [
      { name: 'label', label: 'Link label', type: 'text' },
      { name: 'destinationType', label: 'Link type', type: 'select', defaultValue: 'url', options: [{ label: 'Content', value: 'page' }, { label: 'URL', value: 'url' }], hooks: { afterRead: [({ value, siblingData }) => value === 'page' && !siblingData?.page && isSafeWebUrl(siblingData?.href) ? 'url' : value] } },
      { name: 'href', label: 'URL', type: 'text', admin: { condition: (_, siblingData) => siblingData?.destinationType === 'url' }, validate: (value: unknown) => value === undefined || value === null || value === '' || isSafeWebUrl(value) || 'Enter an absolute HTTP(S) URL or a site-root-relative path.' },
      targetField(targetRelation),
      { name: 'icon', label: 'Icon', type: 'text', validate: isSharpSolidIconNameOrEmpty, admin: { description: 'Optional Font Awesome 7 Sharp Solid icon name, for example bolt or shield-halved.' } },
    ],
  })) as Field[]
}

function targetField(targetRelation: CollectionSlug | CollectionSlug[], localized = false): Field {
  const common = { name: 'page', label: 'Content target', type: 'relationship' as const, localized, admin: { condition: (_: unknown, siblingData: Record<string, unknown>) => siblingData?.destinationType === 'page' } }
  return Array.isArray(targetRelation)
    ? { ...common, relationTo: targetRelation }
    : { ...common, relationTo: targetRelation }
}

function introToProps(value: unknown, field: string): SectionIntro {
  const intro = requireObject(value, field)
  return {
    accentHeading: optionalText(intro.accentHeading, `${field}.accentHeading`),
    heading: requireText(intro.heading, `${field}.heading`),
    ...(intro.description ? { description: { html: richTextToHtml(intro.description, `${field}.description`) } } : {}),
  }
}

function itemToProps(value: unknown, index: number, contentHref: SolutionListAllentownAdapterOptions['contentHref'], options: PayloadAdapterOptions): SolutionListAllentownItem {
  const item = requireObject(value, `items[${index}]`)
  const label = item.label ? requireObject(item.label, `items[${index}].label`) : undefined
  const destination = destinationToProps(item, `items[${index}]`, 'linkLabel', contentHref)

  return {
    image: mediaToProps(item.image, `items[${index}].image`, options),
    accentHeading: optionalText(item.accentHeading, `items[${index}].accentHeading`),
    heading: requireText(item.heading, `items[${index}].heading`),
    ...(label && optionalText(label.text, `items[${index}].label.text`) ? { label: { text: requireText(label.text, `items[${index}].label.text`), ...(optionalSharpSolidIcon(label.icon, `items[${index}].label.icon`) ? { icon: optionalSharpSolidIcon(label.icon, `items[${index}].label.icon`) } : {}) } } : {}),
    description: requireText(item.description, `items[${index}].description`),
    cta: destination,
  }
}

function destinationToProps(value: Record<string, unknown>, field: string, labelField: string, contentHref: SolutionListAllentownAdapterOptions['contentHref']): Cta {
  const label = requireText(value[labelField], `${field}.${labelField}`)
  const icon = optionalSharpSolidIcon(value.icon, `${field}.icon`)

  if (value.destinationType === 'page') {
    const target = relationshipTarget(value.page, `${field}.page`)
    const href = contentHref(target.collection, target.id)
    if (!href) throw new Error(`${field}.page is not available in this static build.`)
    return { label, href, ...(icon ? { icon } : {}) }
  }
  if (value.destinationType === 'url') {
    const href = requireText(value.href, `${field}.href`)
    if (!isSafeWebUrl(href)) throw new Error(`${field}.href must be an HTTP(S) or root-relative URL.`)
    return { label, href, ...(icon ? { icon } : {}) }
  }
  throw new Error(`${field}.destinationType must be page or url.`)
}

function relationshipTarget(value: unknown, field: string): { collection: string; id: string } {
  if (typeof value === 'string') return { collection: 'pages', id: value }
  const relation = requireObject(value, field)
  if (typeof relation.relationTo === 'string') {
    const document = relation.value
    const id = typeof document === 'string' ? document : requireText(requireObject(document, `${field}.value`).id, `${field}.value.id`)
    return { collection: relation.relationTo, id }
  }
  return { collection: 'pages', id: requireText(relation.id, `${field}.id`) }
}

function optionalButtonToProps(value: unknown, field: string, contentHref: SolutionListAllentownAdapterOptions['contentHref']): Cta | undefined {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return undefined
  const button = value as Record<string, unknown>
  if (!optionalText(button.label, `${field}.label`)) return undefined
  return destinationToProps(button, field, 'label', contentHref)
}

function calloutToProps(value: unknown, contentHref: SolutionListAllentownAdapterOptions['contentHref']): NonNullable<SolutionListAllentownContent['callout']> {
  const callout = requireObject(value, 'callout')
  const ctaGroup = requireObject(callout.ctaGroup, 'callout.ctaGroup')
  const primary = optionalButtonToProps(ctaGroup.primaryButton, 'callout.ctaGroup.primaryButton', contentHref)
  const secondary = optionalButtonToProps(ctaGroup.secondaryButton, 'callout.ctaGroup.secondaryButton', contentHref)
  return {
    intro: introToProps(callout.intro, 'callout.intro'),
    ctaGroup: { primary, secondary },
  }
}

function hasText(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}
