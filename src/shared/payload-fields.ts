import type { CollectionSlug, Field } from 'payload'
import { isSafeWebUrl } from '../urls.js'

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
    { name: 'label', type: 'text', label: 'Label', required },
    {
      name: 'destinationType',
      type: 'select',
      label: 'Link type',
      required,
      defaultValue: 'url',
      options: [{ label: 'Content', value: 'content' }, { label: 'URL', value: 'url' }],
      hooks: {
        afterRead: [({ value, siblingData }) => value === 'content' && !siblingData?.page && isSafeWebUrl(siblingData?.href) ? 'url' : value],
      },
    },
    {
      name: 'href',
      type: 'text',
      label: 'URL',
      admin: { condition: (_, siblingData) => siblingData?.destinationType === 'url' },
      validate: (value: unknown) => value === undefined || value === null || value === '' || isSafeWebUrl(value) || 'Enter an absolute HTTP(S) URL or a site-root-relative path.',
    },
    contentTargetField(targetCollections),
    { name: 'icon', type: 'select', label: 'Icon', options: [{ label: 'Arrow right', value: 'arrow-right' }, { label: 'Arrow down', value: 'arrow-down' }] },
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
