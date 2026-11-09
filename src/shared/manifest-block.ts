import type { Block, CollectionSlug, Field } from 'payload'
import { renderRichText } from './rich-text.js'
import { ctaFields, ctaStyleField, formModalPresentationFields, isSharpSolidIconNameOrEmpty, sectionContentWidthField } from './payload-fields.js'
import { formModalPresentationToProps } from './payload.js'
import { normalizeSectionContentWidth } from './section-width.js'

type FieldKind = 'text' | 'textarea' | 'richText' | 'checkbox' | 'select' | 'dateTime' | 'cta' | 'ctaGroup' | 'media' | 'mediaList' | 'video' | 'embedHtml' | 'infoItems' | 'featureItems' | 'processSteps' | 'faqItems' | 'faqReferenceList' | 'comparisonColumns' | 'comparisonRows' | 'formReference' | 'formEmbed' | 'formModal' | 'insightSourceList' | 'contentReferenceList' | 'contentType' | 'sectionIntro' | 'theme' | 'component' | 'componentList'

interface ManifestFieldAdmin {
  description?: string
  initCollapsed?: boolean
  width?: string
}
interface ManifestField {
  kind: FieldKind
  required: boolean
  localized: boolean
  defaultValue?: string | boolean
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
  faqCollection?: CollectionSlug
  targetCollections?: CollectionSlug[]
  contentTypeOptions?: ReadonlyArray<{ label: string; value: CollectionSlug }>
}

type ResolvedOptions = CreateManifestBlockOptions & {
  mediaCollection: CollectionSlug
  faqCollection?: CollectionSlug
  targetCollections: CollectionSlug[]
  contentTypeOptions: ReadonlyArray<{ label: string; value: CollectionSlug }>
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
    case 'checkbox': return { ...common, type: 'checkbox', defaultValue: field.defaultValue === true }
    case 'select':
      if (name === 'contentWidth') return { ...sectionContentWidthField(), ...common }
      return {
        ...common,
        type: 'select',
        defaultValue: field.defaultValue,
        options: (field.options ?? ['light', 'dark']).map((value) => ({ label: value, value })),
      }
    case 'theme': return { ...common, type: 'select', defaultValue: field.defaultValue, options: (field.options ?? ['light', 'dark']).map((value) => ({ label: value, value })) }
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
      fields: [ctaStyleField(), ...ctaFields(options.targetCollections, false, true)],
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
    case 'componentList': return { ...common, type: 'array', minRows: field.minItems, maxRows: field.maxItems, fields: childFields(field, options, descendantsLocalized) }
    case 'infoItems':
    case 'featureItems':
    case 'comparisonColumns': return { ...common, type: 'array', minRows: field.minItems, fields: [{ name: 'value', type: 'text', required: true }] }
    case 'processSteps': return { ...common, type: 'array', minRows: field.minItems, fields: [{ name: 'title', type: 'text', required: true }, { name: 'description', type: 'richText', required: true }] }
    case 'faqItems': return { ...common, type: 'array', minRows: field.minItems, fields: [{ name: 'question', type: 'text', required: true }, { name: 'answer', type: 'richText', required: true }] }
    case 'faqReferenceList': {
      if (!options.faqCollection) throw new Error(`Field ${name} requires a faqCollection; JSON fallback is forbidden.`)
      return {
        ...common,
        type: 'relationship',
        relationTo: options.faqCollection,
        hasMany: true,
        minRows: field.minItems,
        maxRows: field.maxItems,
        filterOptions: { _status: { equals: 'published' } },
        admin: { initCollapsed: true, ...(field.description ? { description: field.description } : {}), ...field.admin },
      }
    }
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
    case 'contentType': {
      const availableContentTypes = field.options
        ? options.contentTypeOptions.filter(({ value }) => field.options?.includes(value))
        : options.contentTypeOptions
      if (availableContentTypes.length === 0) throw new Error(`Field ${name} requires one or more configured content type options.`)
      return {
        ...common,
        type: 'select',
        defaultValue: field.defaultValue,
        options: [...availableContentTypes],
        ...(field.description ? { admin: { description: field.description, ...field.admin } } : {}),
      }
    }
    // Trusted editor-provided HTML for non-form integrations such as video embeds.
    case 'embedHtml': return { ...common, type: 'textarea', admin: { ...field.admin, rows: 8, description: field.description ?? 'Paste trusted HTML embed code.' } }
    // HubSpot embed code (production forms are embeds). Rendered by components/form-embed/allentown.
    case 'formEmbed': return { ...common, type: 'textarea', admin: { ...field.admin, rows: 8, description: field.description ?? 'Paste the HubSpot form embed code. The component preview keeps using a non-submitting placeholder form.' } }
    case 'formModal': return {
      ...common,
      type: 'group',
      admin: { initCollapsed: true, ...(field.description ? { description: field.description } : {}), ...field.admin },
      fields: formModalPresentationFields(),
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
    faqCollection: input.faqCollection,
    targetCollections: input.targetCollections?.length ? input.targetCollections : ['pages'],
    contentTypeOptions: input.contentTypeOptions ?? [],
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

function normalizeRichText(value: unknown, field: string): unknown {
  if (Array.isArray(value)) return value.map((item, index) => normalizeRichText(item, `${field}[${index}]`))
  if (typeof value !== 'object' || value === null) return value

  const record = value as Record<string, unknown>
  if ('enabled' in record && ('label' in record || Object.keys(record).every((key) => key === 'enabled'))) {
    return formModalPresentationToProps(record, field)
  }
  if ('root' in record) return renderRichText(record, field)
  return Object.fromEntries(Object.entries(record).map(([key, item]) => [key, normalizeRichText(item, `${field}.${key}`)]))
}

export function manifestToProps<T extends ManifestSectionDocument>(data: T): T {
  const props = normalizeRichText(data, 'section') as T
  return { ...props, contentWidth: normalizeSectionContentWidth(props.contentWidth) }
}
