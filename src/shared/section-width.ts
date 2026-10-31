export type SectionContentWidth = 'standard' | '80' | '70'

const sectionContentWidths: Record<SectionContentWidth, true> = {
  standard: true,
  '80': true,
  '70': true,
}

/**
 * Normalizes an editor-selected content-width preset while preserving the
 * standard section width for older documents that have no stored value.
 */
export function normalizeSectionContentWidth(value: unknown): SectionContentWidth {
  if (value === undefined || value === null || value === '') return 'standard'
  if (typeof value === 'string' && Object.hasOwn(sectionContentWidths, value)) {
    return value as SectionContentWidth
  }
  throw new Error('contentWidth must be one of standard, 80, or 70.')
}
