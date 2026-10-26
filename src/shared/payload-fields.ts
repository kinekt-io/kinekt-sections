import type { CollectionSlug, Field } from 'payload'
import { isSafeWebUrl } from '../urls.js'
import { ctaIconOptions } from './cta-icons.js'

export const requiredTextMessage = 'Enter non-empty text.'
export const actionableHrefMessage = 'Enter an HTTP(S), root-relative, mailto:, or tel: link.'

export function sectionIntroFields(): Field[] {
  return [
    { name: 'accentHeading', type: 'text', label: 'Accent heading' },
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
      required: true,
      validate: (value: unknown) => hasText(value) || requiredTextMessage,
    },
    { name: 'description', type: 'richText', label: 'Description' },
  ]
}

export function contactMethodFields(): Field[] {
  return [
    {
      name: 'icon',
      type: 'select',
      label: 'Icon',
      required: true,
      options: [
        { label: 'WhatsApp', value: 'whatsapp' },
        { label: 'Phone', value: 'phone' },
        { label: 'Email', value: 'email' },
      ],
    },
    {
      name: 'label',
      type: 'text',
      label: 'Label',
      required: true,
      validate: (value: unknown) => hasText(value) || requiredTextMessage,
    },
    {
      name: 'href',
      type: 'text',
      label: 'Link',
      required: true,
      validate: (value: unknown) => isActionableHref(value) || actionableHrefMessage,
      admin: {
        description: 'Use mailto:, tel:, an HTTP(S) URL, or a site-root-relative path.',
      },
    },
  ]
}

export function ctaFields(targetCollections: CollectionSlug | CollectionSlug[], required = false): Field[] {
  return [
    {
      name: 'label',
      type: 'text',
      label: 'Label',
      required,
      validate: (value: unknown, options: { siblingData?: unknown }) => validateOptionalCtaSibling(value, options, required),
    },
    {
      name: 'destinationType',
      type: 'select',
      label: 'Link type',
      required,
      defaultValue: 'url',
      options: [{ label: 'Content', value: 'content' }, { label: 'URL', value: 'url' }],
      validate: (value: unknown) => value === undefined || value === null || value === 'content' || value === 'url' || 'Choose Content or URL.',
      hooks: {
        afterRead: [({ value, siblingData }) => value === 'content' && !siblingData?.page && isSafeWebUrl(siblingData?.href) ? 'url' : value],
      },
    },
    {
      name: 'href',
      type: 'text',
      label: 'URL',
      admin: { condition: (_, siblingData) => siblingData?.destinationType === 'url' },
      validate: (value: unknown, { siblingData }: { siblingData?: unknown }) => validateOptionalCtaHref(value, siblingData),
    },
    ctaContentTargetField(targetCollections),
    { name: 'icon', type: 'select', label: 'Icon', options: ctaIconOptions },
  ]
}

export function ctaGroupFields(targetCollections: CollectionSlug | CollectionSlug[], names: readonly [string, string] = ['primary', 'secondary']): Field[] {
  return names.map((name) => ({
    name,
    type: 'group',
    label: name.toLowerCase().includes('primary') ? 'Primary CTA' : 'Secondary CTA',
    fields: ctaFields(targetCollections),
  }))
}

const ctaUrlMessage = 'Enter an absolute HTTP(S) URL or a site-root-relative path.'
const ctaContentMessage = 'Select a content target.'

function ctaSiblingData(value: unknown): Record<string, unknown> {
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    return value as Record<string, unknown>
  }
  return {}
}

function hasRelationshipTarget(value: unknown): boolean {
  if (typeof value === 'string') return value.trim().length > 0
  if (typeof value === 'number') return Number.isSafeInteger(value)
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return false

  const relation = value as Record<string, unknown>
  if ('relationTo' in relation) {
    return typeof relation.relationTo === 'string'
      && relation.relationTo.trim().length > 0
      && hasRelationshipTarget(relation.value)
  }
  return hasRelationshipTarget(relation.id)
}

function ctaDestinationType(siblingData: Record<string, unknown>): 'content' | 'url' | undefined {
  const destinationType = siblingData.destinationType ?? 'url'
  return destinationType === 'content' || destinationType === 'url' ? destinationType : undefined
}

function hasCtaTarget(siblingData: Record<string, unknown>): boolean {
  const hasHref = siblingData.href !== undefined && siblingData.href !== null && siblingData.href !== ''
  const hasPage = siblingData.page !== undefined && siblingData.page !== null
  return hasHref || hasPage
}

/**
 * Apply this to an optional CTA label field. Payload skips field validation
 * while saving drafts unless the collection explicitly enables draft validation.
 */
export function validateOptionalCtaSibling(
  value: unknown,
  { siblingData }: { siblingData?: unknown },
  required = false,
): true | string {
  const siblings = ctaSiblingData(siblingData)
  if (!hasText(value)) {
    if (hasCtaTarget(siblings)) return requiredTextMessage
    return required ? requiredTextMessage : true
  }

  const destinationType = ctaDestinationType(siblings)
  if (!destinationType) return 'Choose Content or URL.'
  if (destinationType === 'content') return hasRelationshipTarget(siblings.page) || ctaContentMessage
  return isSafeWebUrl(siblings.href) || ctaUrlMessage
}

function validateOptionalCtaHref(value: unknown, siblingData: unknown): true | string {
  const siblings = ctaSiblingData(siblingData)
  if (value !== undefined && value !== null && value !== '' && !isSafeWebUrl(value)) return ctaUrlMessage
  if (hasText(siblings.label) && ctaDestinationType(siblings) === 'url' && !isSafeWebUrl(value)) return ctaUrlMessage
  return true
}

function ctaContentTargetField(targetCollections: CollectionSlug | CollectionSlug[]): Field {
  const common = {
    name: 'page',
    type: 'relationship' as const,
    label: 'Content target',
    admin: { condition: (_: unknown, siblingData: Record<string, unknown>) => siblingData?.destinationType === 'content' },
    validate: (value: unknown, { siblingData }: { siblingData?: unknown }) => {
      const siblings = ctaSiblingData(siblingData)
      if (hasText(siblings.label) && ctaDestinationType(siblings) === 'content') {
        return hasRelationshipTarget(value) || ctaContentMessage
      }
      return true
    },
  }
  return Array.isArray(targetCollections)
    ? { ...common, relationTo: targetCollections }
    : { ...common, relationTo: targetCollections }
}

export function contentTargetField(targetCollections: CollectionSlug | CollectionSlug[]): Field {
  const common = {
    name: 'page',
    type: 'relationship' as const,
    label: 'Content target',
    admin: { condition: (_: unknown, siblingData: Record<string, unknown>) => siblingData?.destinationType === 'content' },
  }
  return Array.isArray(targetCollections)
    ? { ...common, relationTo: targetCollections }
    : { ...common, relationTo: targetCollections }
}

export function hasText(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

export function isActionableHref(value: unknown): value is string {
  if (!hasText(value)) return false
  return /^(?:https?:\/\/|\/|mailto:|tel:)/i.test(value)
}
