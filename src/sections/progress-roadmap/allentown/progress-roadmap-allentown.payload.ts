import type { Block, CollectionSlug, Field } from 'payload'
import { mediaToProps, optionalSharpSolidIcon, optionalText, requireArray, requireObject, requireText, requireTheme, type PayloadAdapterOptions } from '../../../shared/payload.js'
import { hasText, isSharpSolidIconNameOrEmpty, sectionContentWidthField, sectionIntroFields } from '../../../shared/payload-fields.js'
import { progressStatusFields, progressStatusToProps } from '../../../shared/progress-status-fields.js'
import { richTextToHtml } from '../../../shared/rich-text.js'
import { normalizeSectionContentWidth } from '../../../shared/section-width.js'
import type {
  PayloadProgressRoadmapAllentownDocument,
  ProgressRoadmapAllentownContent,
  ProgressRoadmapAllentownFact,
  ProgressRoadmapAllentownFilterLabels,
  ProgressRoadmapAllentownItem,
} from './progress-roadmap-allentown.types.js'

const filterLabelDefaults: ProgressRoadmapAllentownFilterLabels = {
  all: 'All',
  delayed: 'Delayed',
  done: 'Done',
  inProgress: 'In progress',
  todo: 'To do',
  custom: 'Custom',
  canceled: 'Canceled',
}

export interface CreateProgressRoadmapAllentownBlockOptions {
  mediaCollection?: CollectionSlug
  targetCollections?: CollectionSlug[]
}

export function createProgressRoadmapAllentownBlock(options: CreateProgressRoadmapAllentownBlockOptions = {}): Block {
  const mediaCollection = options.mediaCollection ?? 'media'
  const itemFields: Field[] = [
    { name: 'title', type: 'text', required: true, validate: (value: unknown) => hasText(value) || 'Enter non-empty text.' },
    { name: 'media', type: 'upload', relationTo: mediaCollection, admin: { description: 'Optional image or logo; takes priority over the icon.' } },
    { name: 'icon', type: 'text', validate: isSharpSolidIconNameOrEmpty, admin: { description: 'Optional Font Awesome 7 Sharp Solid or Brands icon name, used when no image is selected.' } },
    { name: 'referenceLabel', type: 'text' },
    { name: 'reference', type: 'text' },
    ...progressStatusFields({ localized: false }),
    { name: 'description', type: 'richText' },
    {
      name: 'facts',
      type: 'array',
      minRows: 0,
      admin: { initCollapsed: true },
      fields: [
        { name: 'label', type: 'text', required: true, admin: { width: '50%' }, validate: (value: unknown) => hasText(value) || 'Enter non-empty text.' },
        { name: 'value', type: 'text', required: true, admin: { width: '50%' }, validate: (value: unknown) => hasText(value) || 'Enter non-empty text.' },
      ],
    },
  ]

  return {
    slug: 'progress-roadmap-allentown',
    interfaceName: 'ProgressRoadmapAllentown',
    labels: { singular: 'Progress Roadmap Allentown', plural: 'Progress Roadmap Allentown blocks' },
    fields: [
      sectionContentWidthField(),
      {
        name: 'theme',
        type: 'select',
        localized: true,
        required: true,
        defaultValue: 'semi-light',
        options: [
          { label: 'Light', value: 'light' },
          { label: 'Semi-light', value: 'semi-light' },
          { label: 'Semi-dark', value: 'semi-dark' },
          { label: 'Dark', value: 'dark' },
        ],
      },
      {
        type: 'collapsible',
        label: 'Intro',
        admin: { initCollapsed: true },
        fields: [{ name: 'intro', type: 'group', localized: true, required: true, fields: sectionIntroFields() }],
      },
      {
        name: 'filterLabels',
        type: 'group',
        localized: true,
        admin: { description: 'Optional labels for the All filter and each visible status.' },
        fields: [
          { name: 'all', type: 'text', defaultValue: filterLabelDefaults.all },
          { name: 'delayed', type: 'text', defaultValue: filterLabelDefaults.delayed },
          { name: 'done', type: 'text', defaultValue: filterLabelDefaults.done },
          { name: 'inProgress', type: 'text', defaultValue: filterLabelDefaults.inProgress },
          { name: 'todo', type: 'text', defaultValue: filterLabelDefaults.todo },
          { name: 'custom', type: 'text', defaultValue: filterLabelDefaults.custom },
          { name: 'canceled', type: 'text', defaultValue: filterLabelDefaults.canceled },
        ],
      },
      {
        name: 'items',
        type: 'array',
        localized: true,
        required: true,
        minRows: 1,
        admin: { initCollapsed: true },
        fields: itemFields,
      },
    ],
  }
}

export function progressRoadmapAllentownToProps(
  data: PayloadProgressRoadmapAllentownDocument,
  options: PayloadAdapterOptions = {},
): ProgressRoadmapAllentownContent {
  const intro = requireObject(data.intro, 'intro')
  const accentHeading = optionalText(intro.accentHeading, 'intro.accentHeading')
  const filterLabels = filterLabelsToProps(data.filterLabels)

  return {
    contentWidth: normalizeSectionContentWidth(data.contentWidth),
    theme: requireTheme(data.theme),
    intro: {
      ...(accentHeading ? { accentHeading } : {}),
      heading: requireText(intro.heading, 'intro.heading'),
      ...(intro.description ? { description: { html: richTextToHtml(intro.description, 'intro.description') } } : {}),
    },
    filterLabels,
    items: requireArray(data.items, 'items').map((value, index) => itemToProps(value, index, options)),
  }
}

function filterLabelsToProps(value: unknown): ProgressRoadmapAllentownFilterLabels {
  const labels = value === undefined || value === null ? {} : requireObject(value, 'filterLabels')

  return {
    all: optionalText(labels.all, 'filterLabels.all') ?? filterLabelDefaults.all,
    delayed: optionalText(labels.delayed, 'filterLabels.delayed') ?? filterLabelDefaults.delayed,
    done: optionalText(labels.done, 'filterLabels.done') ?? filterLabelDefaults.done,
    inProgress: optionalText(labels.inProgress, 'filterLabels.inProgress') ?? filterLabelDefaults.inProgress,
    todo: optionalText(labels.todo, 'filterLabels.todo') ?? filterLabelDefaults.todo,
    custom: optionalText(labels.custom, 'filterLabels.custom') ?? filterLabelDefaults.custom,
    canceled: optionalText(labels.canceled, 'filterLabels.canceled') ?? filterLabelDefaults.canceled,
  }
}

function itemToProps(value: unknown, index: number, options: PayloadAdapterOptions): ProgressRoadmapAllentownItem {
  const path = `items[${index}]`
  const item = requireObject(value, path)
  const media = item.media === undefined || item.media === null ? undefined : mediaToProps(item.media, `${path}.media`, options)
  const icon = optionalSharpSolidIcon(item.icon, `${path}.icon`)
  const referenceLabel = optionalText(item.referenceLabel, `${path}.referenceLabel`)
  const reference = optionalText(item.reference, `${path}.reference`)
  const description = item.description ? { html: richTextToHtml(item.description, `${path}.description`) } : undefined
  const facts = factsToProps(item.facts, `${path}.facts`)

  return {
    title: requireText(item.title, `${path}.title`),
    ...(media ? { media } : {}),
    ...(icon ? { icon } : {}),
    ...(referenceLabel ? { referenceLabel } : {}),
    ...(reference ? { reference } : {}),
    ...progressStatusToProps(item, path),
    ...(description ? { description } : {}),
    ...(facts ? { facts } : {}),
  }
}

function factsToProps(value: unknown, path: string): ProgressRoadmapAllentownFact[] | undefined {
  if (value === undefined || value === null) return undefined
  if (!Array.isArray(value)) throw new Error(`${path} must be an array.`)
  if (value.length === 0) return undefined

  return value.map((fact, index) => {
    const row = requireObject(fact, `${path}[${index}]`)
    return {
      label: requireText(row.label, `${path}[${index}].label`),
      value: requireText(row.value, `${path}[${index}].value`),
    }
  })
}
