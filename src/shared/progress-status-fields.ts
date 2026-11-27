import type { Field } from 'payload'
import { optionalSharpSolidIcon, optionalText } from './payload.js'
import { hasText, isSharpSolidIconNameOrEmpty } from './payload-fields.js'
import { progressCustomTones, progressStatusDefinitions, progressStatuses, type ProgressCustomTone, type ProgressStatus } from './progress-status.js'

export interface ProgressStatusProps {
  status: ProgressStatus
  statusLabel?: string
  customIcon?: string
  customTone?: ProgressCustomTone
}

export interface ProgressStatusFieldOptions {
  localized?: boolean
  includeCustomTone?: boolean
}

const isProgressStatus = (value: unknown): value is ProgressStatus =>
  typeof value === 'string' && Object.hasOwn(progressStatusDefinitions, value)

const isProgressCustomTone = (value: unknown): value is ProgressCustomTone =>
  typeof value === 'string' && (progressCustomTones as readonly string[]).includes(value)

export function progressStatusFields({ localized = true, includeCustomTone = true }: ProgressStatusFieldOptions = {}): Field[] {
  const localization = localized ? { localized: true } : {}

  const fields: Field[] = [
    {
      name: 'status',
      type: 'select',
      ...localization,
      required: true,
      defaultValue: 'todo',
      options: progressStatuses.map((value) => ({ label: progressStatusDefinitions[value].label, value })),
    },
    {
      name: 'statusLabel',
      type: 'text',
      ...localization,
      validate: (value: unknown, { siblingData }: { siblingData?: { status?: unknown } }) =>
        siblingData?.status !== 'custom' || hasText(value) || 'Enter a visible status label for a custom status.',
      admin: {
        description: 'Optional visible status text override; required for custom status.',
      },
    },
    {
      name: 'customIcon',
      type: 'text',
      ...localization,
      validate: isSharpSolidIconNameOrEmpty,
      admin: {
        condition: (_, siblingData) => siblingData?.status === 'custom',
        description: 'Optional Font Awesome 7 Sharp Solid or Brands icon name.',
      },
    },
  ]
  if (includeCustomTone) fields.push({
    name: 'customTone',
    type: 'select',
    ...localization,
    defaultValue: 'neutral',
    options: progressCustomTones.map((value) => ({ label: `${value[0].toUpperCase()}${value.slice(1)}`, value })),
    admin: {
      condition: (_, siblingData) => siblingData?.status === 'custom',
      description: 'Semantic badge color for custom status.',
    },
  })
  return fields
}

export function progressStatusToProps(record: Record<string, unknown>, path: string, { includeCustomTone = true }: Pick<ProgressStatusFieldOptions, 'includeCustomTone'> = {}): ProgressStatusProps {
  const status = isProgressStatus(record.status) ? record.status : 'todo'
  const statusLabel = optionalText(record.statusLabel, `${path}.statusLabel`)

  if (status === 'custom') {
    if (!statusLabel) throw new Error(`${path}.statusLabel must be non-empty text for a custom status.`)

    const customIcon = optionalSharpSolidIcon(record.customIcon, `${path}.customIcon`)
    const result: ProgressStatusProps = { status, statusLabel }
    if (customIcon) result.customIcon = customIcon
    if (includeCustomTone) result.customTone = isProgressCustomTone(record.customTone) ? record.customTone : 'neutral'
    return result
  }

  return { status, ...(statusLabel ? { statusLabel } : {}) }
}
