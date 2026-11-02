import type { Block, CollectionSlug, Field } from 'payload'
import { ctaFields, ctaStyleField, hasText, isSharpSolidIconNameOrEmpty, sectionContentWidthField, sectionIntroFields } from '../../../shared/payload-fields.js'
import { ctaGroupToProps, optionalSharpSolidIcon, optionalText, requireArray, requireObject, requireText, requireTheme, type PayloadAdapterOptions } from '../../../shared/payload.js'
import { richTextToHtml } from '../../../shared/rich-text.js'
import { normalizeSectionContentWidth } from '../../../shared/section-width.js'
import type { PayloadProgressListAllentownDocument, ProgressListAllentownContent, ProgressListAllentownItem, ProgressListCustomTone, ProgressListStatus } from './progress-list-allentown.types.js'

const statusOptions = [
  { label: 'Delayed', value: 'delayed' },
  { label: 'Done', value: 'done' },
  { label: 'In progress', value: 'in-progress' },
  { label: 'To do', value: 'todo' },
  { label: 'Custom', value: 'custom' },
  { label: 'Canceled', value: 'canceled' },
] as const

const customToneOptions = [
  { label: 'Neutral', value: 'neutral' },
  { label: 'Info', value: 'info' },
  { label: 'Success', value: 'success' },
  { label: 'Warning', value: 'warning' },
  { label: 'Error', value: 'error' },
] as const

const isStatus = (value: unknown): value is ProgressListStatus => statusOptions.some((option) => option.value === value)
const isCustomTone = (value: unknown): value is ProgressListCustomTone => customToneOptions.some((option) => option.value === value)

export interface CreateProgressListAllentownBlockOptions { targetCollections?: CollectionSlug[] }

export function createProgressListAllentownBlock(options: CreateProgressListAllentownBlockOptions = {}): Block {
  const targetCollections = options.targetCollections ?? ['pages']
  const itemFields: Field[] = [
    { name: 'title', type: 'text', localized: true, required: true, validate: (value: unknown) => hasText(value) || 'Enter non-empty text.' },
    { name: 'reference', type: 'text', localized: true },
    { name: 'status', type: 'select', localized: true, required: true, defaultValue: 'todo', options: [...statusOptions] },
    { name: 'statusLabel', type: 'text', localized: true, validate: (value: unknown, { siblingData }: { siblingData?: { status?: unknown } }) => siblingData?.status !== 'custom' || hasText(value) || 'Enter a visible status label for a custom status.', admin: { description: 'Optional visible status text override; required for custom status.' } },
    { name: 'customIcon', type: 'text', localized: true, validate: isSharpSolidIconNameOrEmpty, admin: { condition: (_, siblingData) => siblingData?.status === 'custom', description: 'Optional Font Awesome 7 Sharp Solid or Brands icon name.' } },
    { name: 'customTone', type: 'select', localized: true, defaultValue: 'neutral', options: [...customToneOptions], admin: { condition: (_, siblingData) => siblingData?.status === 'custom', description: 'Semantic badge color for custom status.' } },
  ]

  return {
    slug: 'progress-list-allentown',
    labels: { singular: 'PRERELEASE — Progress List Allentown', plural: 'PRERELEASE — Progress List Allentown blocks' },
    fields: [
      sectionContentWidthField(),
      { name: 'theme', type: 'select', localized: true, required: true, defaultValue: 'light', options: [{ label: 'Light', value: 'light' }, { label: 'Semi-light', value: 'semi-light' }, { label: 'Semi-dark', value: 'semi-dark' }, { label: 'Dark', value: 'dark' }] },
      { type: 'collapsible', label: 'Intro', admin: { initCollapsed: true }, fields: [{ name: 'intro', type: 'group', localized: true, required: true, fields: sectionIntroFields() }] },
      { name: 'itemHeading', type: 'text', localized: true, required: true, defaultValue: 'Item', validate: (value: unknown) => hasText(value) || 'Enter non-empty text.' },
      { name: 'statusHeading', type: 'text', localized: true, required: true, defaultValue: 'Status', validate: (value: unknown) => hasText(value) || 'Enter non-empty text.' },
      { name: 'items', type: 'array', localized: true, required: true, minRows: 1, admin: { initCollapsed: true }, fields: itemFields },
      { name: 'ctaGroup', type: 'array', localized: true, minRows: 0, maxRows: 2, admin: { initCollapsed: true }, fields: [ctaStyleField(), ...ctaFields(targetCollections)] },
    ],
  }
}

export function progressListAllentownToProps(data: PayloadProgressListAllentownDocument, options: PayloadAdapterOptions = {}): ProgressListAllentownContent {
  const intro = requireObject(data.intro, 'intro')
  const accentHeading = optionalText(intro.accentHeading, 'intro.accentHeading')
  const items = requireArray(data.items, 'items').map((value, index) => itemToProps(value, index))
  const ctaGroup = ctaGroupToProps(data.ctaGroup, 'ctaGroup', options)

  return {
    contentWidth: normalizeSectionContentWidth(data.contentWidth),
    theme: requireTheme(data.theme),
    intro: {
      ...(accentHeading ? { accentHeading } : {}),
      heading: requireText(intro.heading, 'intro.heading'),
      ...(intro.description ? { description: { html: richTextToHtml(intro.description, 'intro.description') } } : {}),
    },
    itemHeading: requireText(data.itemHeading, 'itemHeading'),
    statusHeading: requireText(data.statusHeading, 'statusHeading'),
    items,
    ...(ctaGroup ? { ctaGroup } : {}),
  }
}

function itemToProps(value: unknown, index: number): ProgressListAllentownItem {
  const item = requireObject(value, `items[${index}]`)
  const title = requireText(item.title, `items[${index}].title`)
  const reference = optionalText(item.reference, `items[${index}].reference`)
  const status = isStatus(item.status) ? item.status : 'todo'
  const statusLabel = optionalText(item.statusLabel, `items[${index}].statusLabel`)

  if (status === 'custom') {
    if (!statusLabel) throw new Error(`items[${index}].statusLabel must be non-empty text for a custom status.`)
    const customIcon = optionalSharpSolidIcon(item.customIcon, `items[${index}].customIcon`)
    const customTone = isCustomTone(item.customTone) ? item.customTone : 'neutral'
    return { title, ...(reference ? { reference } : {}), status, statusLabel, ...(customIcon ? { customIcon } : {}), customTone }
  }

  return { title, ...(reference ? { reference } : {}), status, ...(statusLabel ? { statusLabel } : {}) }
}
