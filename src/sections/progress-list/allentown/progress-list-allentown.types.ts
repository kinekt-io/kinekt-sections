import type { CtaGroup, SectionIntro, SectionTheme } from '../../../shared/content.js'
import type { SectionContentWidth } from '../../../shared/section-width.js'

export const progressListStatuses = ['delayed', 'done', 'in-progress', 'todo', 'custom', 'canceled'] as const
export type ProgressListStatus = (typeof progressListStatuses)[number]
export const progressListCustomTones = ['neutral', 'info', 'success', 'warning', 'error'] as const
export type ProgressListCustomTone = (typeof progressListCustomTones)[number]

export interface ProgressListAllentownItem {
  title: string
  reference?: string
  status: ProgressListStatus
  statusLabel?: string
  customIcon?: string
  customTone?: ProgressListCustomTone
}

export interface ProgressListAllentownContent {
  contentWidth?: SectionContentWidth
  theme: SectionTheme
  intro: SectionIntro
  itemHeading: string
  statusHeading: string
  items: ProgressListAllentownItem[]
  ctaGroup?: CtaGroup
}

export type PayloadProgressListAllentownDocument = ProgressListAllentownContent & { id?: string }
