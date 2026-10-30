import type { CtaGroup, SectionIntro, SectionTheme } from '../../../shared/content.js'

export interface StreamerAllentownContent {
  id?: string
  theme?: SectionTheme
  intro: SectionIntro
  ctas?: CtaGroup
}

export type PayloadStreamerAllentownDocument = Record<string, unknown> & { id?: string }
