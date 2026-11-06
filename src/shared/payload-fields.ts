import type { CollectionSlug, Field, SelectField, TextField } from 'payload'
import { isSafeCtaHref, isSafeFragmentIdentifier } from '../urls.js'
import { isCtaIcon } from './cta-icons.js'

export const requiredTextMessage = 'Enter non-empty text.'
export const actionableHrefMessage = 'Enter an HTTP(S), root-relative, mailto:, or tel: link.'
export const sharpSolidIconMessage = 'Enter an installed Font Awesome 7 Sharp Solid or Brands icon name in kebab-case.'

export const isSharpSolidIconNameOrEmpty = (value: unknown): true | string =>
  value === undefined || value === null || value === '' || isCtaIcon(value) || sharpSolidIconMessage

export function sectionContentWidthField(): SelectField {
  return {
    name: 'contentWidth',
    type: 'select',
    label: 'Content width',
    localized: true,
    defaultValue: 'standard',
    options: [
      { label: 'Standard (100%)', value: 'standard' },
      { label: '80%', value: '80' },
      { label: '70%', value: '70' },
    ],
    admin: { description: 'Maximum content width. Backgrounds and full-bleed media are unchanged.' },
  }
}


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
      type: 'text',
      label: 'Icon',
      required: true,
      validate: isSharpSolidIconNameOrEmpty,
      admin: { description: 'Font Awesome 7 Sharp Solid icon name, for example phone or envelope.' },
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

export function ctaStyleField(): SelectField {
  return {
    name: 'style',
    type: 'select',
    label: 'Style',
    required: true,
    defaultValue: 'primary',
    options: [
      { label: 'Primary', value: 'primary' },
      { label: 'Secondary', value: 'secondary' },
      { label: 'Clear', value: 'clear' },
      { label: 'Clear base', value: 'clear-base' },
    ],
  }
}

export function ctaIconField(): TextField {
  return {
    name: 'icon',
    type: 'text',
    label: 'Icon',
    validate: isSharpSolidIconNameOrEmpty,
    admin: { description: 'Optional Font Awesome 7 Sharp Solid icon name, for example bolt or shield-halved.' },
  }
}

export function formModalPresentationFields(): Field[] {

  return [
    {
      name: 'enabled',
      type: 'checkbox',
      label: 'Show form in a modal',
      defaultValue: false,
      admin: { description: 'When enabled, visitors use the opener below to show the supplied form in a modal.' },
    },
    {
      name: 'label',
      type: 'text',
      label: 'Opener label',
      validate: (value: unknown, { siblingData }: { siblingData?: unknown }) =>
        !siblingData || typeof siblingData !== 'object' || !('enabled' in siblingData) || siblingData.enabled !== true || hasText(value) || requiredTextMessage,
      admin: { condition: (_, siblingData) => siblingData?.enabled === true },
    },
    {
      ...ctaStyleField(),
      required: false,
      admin: { condition: (_, siblingData) => siblingData?.enabled === true },
    },
    {
      ...ctaIconField(),
      admin: { condition: (_, siblingData) => siblingData?.enabled === true },
    },
  ]
}


export function ctaFields(targetCollections: CollectionSlug | CollectionSlug[], required = false, allowForm = false): Field[] {
  return [
    {
      name: 'label',
      type: 'text',
      label: 'Label',
      required,
      validate: (value: unknown, options: { siblingData?: unknown }) => validateOptionalCtaSibling(value, options, required, allowForm),
    },
    {
      name: 'destinationType',
      type: 'select',
      label: 'Link type',
      required,
      defaultValue: 'url',
      options: [
        { label: 'Content', value: 'content' },
        { label: 'URL', value: 'url' },
        ...(allowForm ? [{ label: 'Form', value: 'form' }] : []),
      ],
      validate: (value: unknown) =>
        value === undefined || value === null || value === 'content' || value === 'url' || (allowForm && value === 'form')
          ? true
          : `Choose Content, URL${allowForm ? ', or Form' : ''}.`,
      hooks: {
        afterRead: [({ value, siblingData }) => value === 'content' && !siblingData?.page && isSafeCtaHref(siblingData?.href) ? 'url' : value],
      },
    },
    {
      name: 'href',
      type: 'text',
      label: 'URL or anchor',
      admin: { condition: (_, siblingData) => siblingData?.destinationType === 'url' },
      validate: (value: unknown, { siblingData }: { siblingData?: unknown }) => validateOptionalCtaHref(value, siblingData),
    },
    ctaContentTargetField(targetCollections),
    {
      name: 'anchor',
      type: 'text',
      label: 'Anchor ID',
      admin: {
        condition: (_: unknown, siblingData: Record<string, unknown>) =>
          siblingData?.destinationType === 'content',
        description: 'Optional fragment on the selected content, starting with #. For example: #main-content.',
      },
      validate: (value: unknown, { siblingData }: { siblingData?: unknown }) =>
        validateOptionalCtaAnchor(value, siblingData),
    },
    ...(allowForm ? [{
      name: 'form',
      type: 'textarea' as const,
      label: 'HubSpot embed code',
      admin: {
        condition: (_: unknown, siblingData: Record<string, unknown>) => siblingData?.destinationType === 'form',
        description: 'Paste the complete HubSpot embed code. This CTA opens it in a modal.',
      },
      validate: (value: unknown, { siblingData }: { siblingData?: unknown }) => {
        const siblings = ctaSiblingData(siblingData)
        return hasText(siblings.label) && ctaDestinationType(siblings, true) === 'form'
          ? hasText(value) || formEmbedMessage
          : true
      },
    }] : []),
    ctaIconField(),
  ]
}

export function ctaGroupFields(targetCollections: CollectionSlug | CollectionSlug[], names: readonly [string, string] = ['primary', 'secondary']): Field[] {
  return names.map((name) => ({
    name,
    type: 'group',
    label: name.toLowerCase().includes('primary') ? 'Primary CTA' : 'Secondary CTA',
    fields: [ctaStyleField(), ...ctaFields(targetCollections, false, true)],
  }))
}

const ctaUrlMessage = 'Enter an absolute HTTP(S) URL, a site-root-relative path, or an anchor such as #main-content.'
const ctaAnchorMessage = 'Enter an anchor that starts with #, for example #main-content.'
const ctaContentMessage = 'Select content for this action.'
const formEmbedMessage = 'Paste the complete HubSpot embed code.'

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

function ctaDestinationType(siblingData: Record<string, unknown>, allowForm = false): 'content' | 'url' | 'form' | undefined {
  const destinationType = siblingData.destinationType ?? 'url'
  return destinationType === 'content' || destinationType === 'url' || (allowForm && destinationType === 'form') ? destinationType : undefined
}

function hasCtaTarget(siblingData: Record<string, unknown>): boolean {
  const hasHref = siblingData.href !== undefined && siblingData.href !== null && siblingData.href !== ''
  const hasPage = siblingData.page !== undefined && siblingData.page !== null
  const hasForm = siblingData.form !== undefined && siblingData.form !== null && siblingData.form !== ''
  return hasHref || hasPage || hasForm
}

/**
 * Apply this to an optional CTA label field. Payload skips field validation
 * while saving drafts unless the collection explicitly enables draft validation.
 */
export function validateOptionalCtaSibling(
  value: unknown,
  { siblingData }: { siblingData?: unknown },
  required = false,
  allowForm = false,
): true | string {
  const siblings = ctaSiblingData(siblingData)
  if (!hasText(value)) {
    if (hasCtaTarget(siblings)) return requiredTextMessage
    return required ? requiredTextMessage : true
  }

  const destinationType = ctaDestinationType(siblings, allowForm)
  if (!destinationType) return `Choose Content, URL${allowForm ? ', or Form' : ''}.`
  if (destinationType === 'content') return hasRelationshipTarget(siblings.page) || ctaContentMessage
  if (destinationType === 'form') return hasText(siblings.form) || formEmbedMessage
  return isSafeCtaHref(siblings.href) || ctaUrlMessage
}

function validateOptionalCtaHref(value: unknown, siblingData: unknown): true | string {
  const siblings = ctaSiblingData(siblingData)
  if (ctaDestinationType(siblings, true) !== 'url') return true
  if (value !== undefined && value !== null && value !== '' && !isSafeCtaHref(value)) return ctaUrlMessage
  if (hasText(siblings.label) && !isSafeCtaHref(value)) return ctaUrlMessage
  return true
}

function validateOptionalCtaAnchor(value: unknown, siblingData: unknown): true | string {
  const siblings = ctaSiblingData(siblingData)
  if (ctaDestinationType(siblings, true) !== 'content') return true
  if (value === undefined || value === null || value === '') return true
  return isSafeFragmentIdentifier(value) ? true : ctaAnchorMessage
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
