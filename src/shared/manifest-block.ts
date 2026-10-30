import type { Block, CollectionSlug, Field } from 'payload'
import { ctaFields, isSharpSolidIconNameOrEmpty } from './payload-fields.js'

type FieldKind = 'text' | 'textarea' | 'richText' | 'select' | 'dateTime' | 'cta' | 'ctaGroup' | 'media' | 'mediaList' | 'video' | 'infoItems' | 'featureItems' | 'processSteps' | 'faqItems' | 'comparisonColumns' | 'comparisonRows' | 'formReference' | 'formEmbed' | 'insightSourceList' | 'contentReferenceList' | 'sectionIntro' | 'theme' | 'component' | 'componentList'

interface ManifestFieldAdmin {
  description?: string
  initCollapsed?: boolean
  width?: string
}
interface ManifestField {
  kind: FieldKind
  required: boolean
  localized: boolean
  options?: readonly string[]
  minItems?: number
  maxItems?: number
  componentId?: string
  fields?: Readonly<Record<string, ManifestField>>
  description?: string
  admin?: ManifestFieldAdmin
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
    ...(field.admin ? { admin: field.admin } : {}),
  }
}

function fieldFor(name: string, field: ManifestField, options: ResolvedOptions, parentLocalized = false): Field {
  const common = commonField(name, field, parentLocalized)
  const descendantsLocalized = parentLocalized || field.localized

  switch (field.kind) {
    case 'text': return {
      ...common,
      type: 'text',
      ...(field.description ? { admin: { description: field.description, ...field.admin } } : {}),
      ...(name === 'icon' || name.endsWith('Icon') ? { validate: isSharpSolidIconNameOrEmpty } : {}),
    }
    case 'textarea': return { ...common, type: 'textarea' }
    case 'richText': return { ...common, type: 'richText' }
    case 'dateTime': return { ...common, type: 'date', admin: { ...field.admin, date: { pickerAppearance: 'dayAndTime' } } }
    case 'select':
    case 'theme': return { ...common, type: 'select', options: (field.options ?? ['light', 'dark']).map((value) => ({ label: value, value })) }
    case 'media':
    case 'video': return { ...common, type: 'upload', relationTo: options.mediaCollection }
    case 'mediaList': return { ...common, type: 'array', minRows: field.minItems, fields: [{ name: 'media', type: 'upload', relationTo: options.mediaCollection, required: true }] }
    case 'cta': return { ...common, type: 'group', fields: ctaFields(options.targetCollections, field.required) }
    case 'ctaGroup': return {
      ...common,
      type: 'array',
      minRows: field.minItems ?? 0,
      maxRows: field.maxItems ?? 2,
      admin: { initCollapsed: true, ...(field.description ? { description: field.description } : {}), ...field.admin },
      fields: [
        {
          name: 'style',
          type: 'select',
          required: true,
          defaultValue: 'primary',
          options: [
            { label: 'Primary', value: 'primary' },
            { label: 'Secondary', value: 'secondary' },
            { label: 'Clear', value: 'clear' },
          ],
        },
        ...ctaFields(options.targetCollections),
      ],
    }
    case 'sectionIntro': return { ...common, type: 'group', fields: introFields() }
    case 'component': {
      if (field.componentId === 'components/cta-group/allentown') {
        const buttons = field.fields?.buttons
        if (!buttons || buttons.kind !== 'ctaGroup') throw new Error('CTA Group Allentown must expose its buttons field.')
        return fieldFor(name, {
          ...buttons,
          required: false,
          localized: field.localized,
          admin: {
            ...(buttons.description || field.description ? { description: buttons.description ?? field.description } : {}),
            ...buttons.admin,
            ...field.admin,
          },
        }, options, parentLocalized)
      }
      const admin = field.componentId === 'components/intro/allentown'
        ? { initCollapsed: true, ...field.admin }
        : field.admin
      return { ...common, ...(admin ? { admin } : {}), type: 'group', fields: childFields(field, options, descendantsLocalized) }
    }
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
    case 'contentReferenceList': return {
      ...common,
      type: 'array',
      minRows: field.minItems,
      fields: [
        {
          name: 'content',
          type: 'relationship',
          relationTo: options.targetCollections,
          required: true,
          filterOptions: { _status: { equals: 'published' } },
        },
        { name: 'featured', type: 'checkbox', defaultValue: false },
      ],
    }
    // HubSpot embed code (production forms are embeds). Rendered by components/form-embed/allentown.
    case 'formEmbed': return { ...common, type: 'textarea', admin: { ...field.admin, rows: 8, description: field.description ?? 'Paste the HubSpot form embed code. The component preview keeps using a non-submitting placeholder form.' } }
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
