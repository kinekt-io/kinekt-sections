import type { Media, RichText, SectionIntro, SectionTheme } from '../../../shared/content.js'
import type { ProgressCustomTone, ProgressStatus } from '../../../shared/progress-status.js'
import type { SectionContentWidth } from '../../../shared/section-width.js'

export interface ProgressRoadmapAllentownFilterLabels {
  all: string
  delayed: string
  done: string
  inProgress: string
  todo: string
  custom: string
  canceled: string
}

export interface ProgressRoadmapAllentownFact {
  label: string
  value: string
}

export interface ProgressRoadmapAllentownItem {
  title: string
  media?: Media
  icon?: string
  referenceLabel?: string
  reference?: string
  status: ProgressStatus
  statusLabel?: string
  customIcon?: string
  customTone?: ProgressCustomTone
  description?: RichText
  facts?: ProgressRoadmapAllentownFact[]
}

export interface ProgressRoadmapAllentownContent {
  contentWidth?: SectionContentWidth
  theme: SectionTheme
  intro: SectionIntro
  filterLabels: ProgressRoadmapAllentownFilterLabels
  items: ProgressRoadmapAllentownItem[]
}

export interface PayloadProgressRoadmapAllentownDocument {
  id?: string
  contentWidth?: unknown
  theme?: unknown
  intro?: unknown
  filterLabels?: unknown
  items?: unknown
}
