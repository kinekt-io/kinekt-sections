import type { SectionContentWidth } from '../../../shared/section-width.js'
import type { CtaGroup, SectionIntro, SectionTheme } from '../../../shared/content.js'

export interface StreamerAllentownContent {
  contentWidth?: SectionContentWidth
  id?: string
  theme?: SectionTheme
  intro: SectionIntro
  ctas?: CtaGroup
}

export type PayloadStreamerAllentownDocument = Record<string, unknown> & { id?: string }
