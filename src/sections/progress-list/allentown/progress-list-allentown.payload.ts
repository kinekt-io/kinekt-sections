import type { Block, CollectionSlug, Field } from 'payload'
import { ctaFields, ctaStyleField, hasText, sectionContentWidthField, sectionIntroFields } from '../../../shared/payload-fields.js'
import { ctaGroupToProps, optionalText, requireArray, requireObject, requireText, requireTheme, type PayloadAdapterOptions } from '../../../shared/payload.js'
import { progressStatusFields, progressStatusToProps } from '../../../shared/progress-status-fields.js'
import { richTextToHtml } from '../../../shared/rich-text.js'
import { normalizeSectionContentWidth } from '../../../shared/section-width.js'
import type { PayloadProgressListAllentownDocument, ProgressListAllentownContent, ProgressListAllentownItem } from './progress-list-allentown.types.js'


export interface CreateProgressListAllentownBlockOptions { targetCollections?: CollectionSlug[] }

export function createProgressListAllentownBlock(options: CreateProgressListAllentownBlockOptions = {}): Block {
  const targetCollections = options.targetCollections ?? ['pages']
  const itemFields: Field[] = [
    { name: 'title', type: 'text', required: true, validate: (value: unknown) => hasText(value) || 'Enter non-empty text.' },
    { name: 'reference', type: 'text' },
    ...progressStatusFields({ localized: false }),
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
      { name: 'ctaGroup', type: 'array', localized: true, minRows: 0, maxRows: 2, admin: { initCollapsed: true }, fields: [ctaStyleField(), ...ctaFields(targetCollections, false, true)] },
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
  return {
    title,
    ...(reference ? { reference } : {}),
    ...progressStatusToProps(item, `items[${index}]`),
  }
}
