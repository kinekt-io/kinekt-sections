import type { Block, CollectionSlug } from 'payload'

type FieldKind = 'text' | 'textarea' | 'richText' | 'select' | 'dateTime' | 'cta' | 'ctaGroup' | 'media' | 'mediaList' | 'video' | 'infoItems' | 'featureItems' | 'processSteps' | 'faqItems' | 'comparisonColumns' | 'comparisonRows' | 'formReference' | 'insightSourceList' | 'sectionIntro' | 'theme' | 'component' | 'componentList'

interface ManifestField {
  kind: FieldKind
  required: boolean
  localized: boolean
  options?: readonly string[]
  minItems?: number
}

type SectionStatus = 'planned' | 'alpha' | 'beta' | 'prerelease' | 'release' | 'released' | 'deprecated'

interface SectionManifest {
  slug: string
  title: string
  status: SectionStatus
  fields: Record<string, ManifestField>
}

export type ManifestSectionDocument = Record<string, unknown> & { id?: string }

export interface CreateManifestBlockOptions {
  mediaCollection?: CollectionSlug
  formCollection?: CollectionSlug
}

function localized(field: ManifestField) {
  return field.localized ? { localized: true } : {}
}

const ctaFields = (required: boolean) => [
  { name: 'label', type: 'text' as const, required },
  { name: 'href', type: 'text' as const, required },
  { name: 'icon', type: 'select' as const, options: [{ label: 'Arrow right', value: 'arrow-right' }, { label: 'Arrow down', value: 'arrow-down' }] },
]

function fieldFor(name: string, field: ManifestField, options: CreateManifestBlockOptions & { mediaCollection: CollectionSlug }) {
  const common = { name, required: field.required, ...localized(field) }

  switch (field.kind) {
    case 'text': return { ...common, type: 'text' as const }
    case 'textarea': return { ...common, type: 'textarea' as const }
    case 'richText': return { ...common, type: 'richText' as const }
    case 'dateTime': return { ...common, type: 'date' as const, admin: { date: { pickerAppearance: 'dayAndTime' as const } } }
    case 'select':
    case 'theme': return { ...common, type: 'select' as const, options: (field.options ?? ['light', 'dark']).map((value) => ({ label: value, value })) }
    case 'media':
    case 'video': return { ...common, type: 'upload' as const, relationTo: options.mediaCollection }
    case 'mediaList': return { ...common, type: 'array' as const, minRows: field.minItems, fields: [{ name: 'media', type: 'upload' as const, relationTo: options.mediaCollection, required: true }] }
    case 'cta': return { ...common, type: 'group' as const, fields: ctaFields(true) }
    case 'ctaGroup': return { ...common, type: 'group' as const, fields: ['primary', 'secondary'].map((name) => ({ name, type: 'group' as const, fields: ctaFields(false) })) }
    case 'formReference': return options.formCollection
      ? { ...common, type: 'relationship' as const, relationTo: options.formCollection }
      : { ...common, type: 'json' as const }
    default: return { ...common, type: 'json' as const }
  }
}

export function createManifestBlock(manifest: SectionManifest, input: CreateManifestBlockOptions = {}): Block {
  const options: CreateManifestBlockOptions & { mediaCollection: CollectionSlug } = {
    mediaCollection: input.mediaCollection ?? 'media',
    formCollection: input.formCollection,
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
    fields: Object.entries(manifest.fields).map(([name, field]) => fieldFor(name, field, options)) as Block['fields'],
  }
}

export function manifestToProps<T extends ManifestSectionDocument>(data: T): T {
  return data
}
