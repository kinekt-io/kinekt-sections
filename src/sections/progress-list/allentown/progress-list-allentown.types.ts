import type { CtaGroup, SectionIntro, SectionTheme } from '../../../shared/content.js'
import { progressCustomTones, progressStatuses, type ProgressCustomTone, type ProgressStatus } from '../../../shared/progress-status.js'
import type { SectionContentWidth } from '../../../shared/section-width.js'

export { progressStatuses as progressListStatuses, progressCustomTones as progressListCustomTones }
export type ProgressListStatus = ProgressStatus
export type ProgressListCustomTone = ProgressCustomTone

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
