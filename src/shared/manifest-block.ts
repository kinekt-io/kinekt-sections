import type { Block, CollectionSlug, Field } from 'payload'
import { ctaFields, ctaGroupFields } from './payload-fields.js'

type FieldKind = 'text' | 'textarea' | 'richText' | 'select' | 'dateTime' | 'cta' | 'ctaGroup' | 'media' | 'mediaList' | 'video' | 'infoItems' | 'featureItems' | 'processSteps' | 'faqItems' | 'comparisonColumns' | 'comparisonRows' | 'formReference' | 'insightSourceList' | 'sectionIntro' | 'theme' | 'component' | 'componentList'

interface ManifestField {
  kind: FieldKind
  required: boolean
  localized: boolean
  options?: readonly string[]
  minItems?: number
  componentId?: string
  fields?: Readonly<Record<string, ManifestField>>
}

type SectionStatus = 'planned' | 'alpha' | 'beta' | 'prerelease' | 'release' | 'released' | 'deprecated'

interface SectionManifest {
  slug: string
  title: string
  status: SectionStatus
  fields: Readonly<Record<string, ManifestField>>
}

export type ManifestSectionDocument = Record<string, unknown> & { id?: string }

export interface CreateManifestBlockOptions {
  mediaCollection?: CollectionSlug
  formCollection?: CollectionSlug
  targetCollections?: CollectionSlug[]
}

type ResolvedOptions = CreateManifestBlockOptions & {
  mediaCollection: CollectionSlug
  targetCollections: CollectionSlug[]
}

const introFields = (): Field[] => [
  { name: 'accentHeading', type: 'text' },
  { name: 'heading', type: 'text', required: true },
  { name: 'description', type: 'richText' },
]

function childFields(field: ManifestField, options: ResolvedOptions, parentLocalized: boolean): Field[] {
  if (!field.fields) throw new Error(`Reusable component ${field.componentId ?? '(unknown)'} has no expanded field contract.`)
  return Object.entries(field.fields).map(([name, child]) => fieldFor(name, child, options, parentLocalized))
}

function commonField(name: string, field: ManifestField, parentLocalized: boolean) {
  return {
    name,
    required: field.required,
    ...(field.localized && !parentLocalized ? { localized: true as const } : {}),
  }
}

function fieldFor(name: string, field: ManifestField, options: ResolvedOptions, parentLocalized = false): Field {
  const common = commonField(name, field, parentLocalized)
  const descendantsLocalized = parentLocalized || field.localized

  switch (field.kind) {
    case 'text': return { ...common, type: 'text' }
    case 'textarea': return { ...common, type: 'textarea' }
    case 'richText': return { ...common, type: 'richText' }
    case 'dateTime': return { ...common, type: 'date', admin: { date: { pickerAppearance: 'dayAndTime' } } }
    case 'select':
    case 'theme': return { ...common, type: 'select', options: (field.options ?? ['light', 'dark']).map((value) => ({ label: value, value })) }
    case 'media':
    case 'video': return { ...common, type: 'upload', relationTo: options.mediaCollection }
    case 'mediaList': return { ...common, type: 'array', minRows: field.minItems, fields: [{ name: 'media', type: 'upload', relationTo: options.mediaCollection, required: true }] }
    case 'cta': return { ...common, type: 'group', fields: ctaFields(options.targetCollections, true) }
    case 'ctaGroup': return { ...common, type: 'group', fields: ctaGroupFields(options.targetCollections) }
    case 'sectionIntro': return { ...common, type: 'group', fields: introFields() }
    case 'component': return { ...common, type: 'group', fields: childFields(field, options, descendantsLocalized) }
    case 'componentList': return { ...common, type: 'array', minRows: field.minItems, fields: childFields(field, options, descendantsLocalized) }
    case 'infoItems':
    case 'featureItems':
    case 'comparisonColumns': return { ...common, type: 'array', minRows: field.minItems, fields: [{ name: 'value', type: 'text', required: true }] }
    case 'processSteps': return { ...common, type: 'array', minRows: field.minItems, fields: [{ name: 'title', type: 'text', required: true }, { name: 'description', type: 'richText', required: true }] }
    case 'faqItems': return { ...common, type: 'array', minRows: field.minItems, fields: [{ name: 'question', type: 'text', required: true }, { name: 'answer', type: 'richText', required: true }] }
    case 'comparisonRows': return {
      ...common,
      type: 'array',
      minRows: field.minItems,
      fields: [
        { name: 'feature', type: 'text', required: true },
        { name: 'cells', type: 'array', required: true, minRows: 1, fields: [
          { name: 'type', type: 'select', required: true, options: [{ label: 'Text', value: 'text' }, { label: 'Status', value: 'status' }] },
          { name: 'text', type: 'text' },
          { name: 'status', type: 'select', options: [{ label: 'Positive', value: 'positive' }, { label: 'Negative', value: 'negative' }] },
        ] },
      ],
    }
    case 'insightSourceList': return {
      ...common,
      type: 'array',
      minRows: field.minItems,
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'excerpt', type: 'textarea', required: true },
        { name: 'href', type: 'text', required: true },
        { name: 'publishedAt', type: 'date', required: true },
        { name: 'kind', type: 'select', options: [{ label: 'Article', value: 'Article' }, { label: 'Case', value: 'Case' }] },
        { name: 'featured', type: 'checkbox', defaultValue: false },
        { name: 'image', type: 'upload', relationTo: options.mediaCollection },
      ],
    }
    case 'formReference': {
      if (!options.formCollection) throw new Error(`Field ${name} requires a formCollection; JSON fallback is forbidden.`)
      return { ...common, type: 'relationship', relationTo: options.formCollection }
    }
    default: throw new Error(`Unsupported manifest field kind on ${name}; JSON fallback is forbidden.`)
  }
}

export function createManifestBlock(manifest: SectionManifest, input: CreateManifestBlockOptions = {}): Block {
  const options: ResolvedOptions = {
    mediaCollection: input.mediaCollection ?? 'media',
    formCollection: input.formCollection,
    targetCollections: input.targetCollections?.length ? input.targetCollections : ['pages'],
  }

  const released = manifest.status === 'released'
  const statusLabel = manifest.status === 'prerelease' ? 'PRERELEASE' : 'BETA'
  const name = manifest.slug.split('-').map((part) => part[0]?.toUpperCase() + part.slice(1)).join('')
  return {
    slug: `${released ? '' : 'beta-'}${manifest.slug}`,
    interfaceName: `${released ? '' : 'Beta'}${name}`,
    labels: released
      ? { singular: manifest.title, plural: `${manifest.title} blocks` }
      : { singular: `${statusLabel} — ${manifest.title}`, plural: `${statusLabel} — ${manifest.title} blocks` },
    fields: Object.entries(manifest.fields).map(([fieldName, field]) => fieldFor(fieldName, field, options)),
  }
}

export function manifestToProps<T extends ManifestSectionDocument>(data: T): T {
  return data
}
