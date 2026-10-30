import type { CtaGroup, RichText, SectionIntro } from '../../../shared/content.js'
import type { BetaTheme } from '../../../shared/payload.js'

export interface UseCasesAllentownItem {
  title: string
  icon?: string
  description: RichText
  ctaGroup?: CtaGroup
}

export interface BetaUseCasesAllentownContent {
  theme: BetaTheme
  intro: SectionIntro
  advantageHeading: string
  items: UseCasesAllentownItem[]
}

type DraftFields<T> = { [Field in keyof T]?: T[Field] | null }

export interface PayloadBetaUseCasesAllentownDocument extends DraftFields<Omit<BetaUseCasesAllentownContent, 'intro' | 'items'>> {
  blockType?: string
  intro?: { accentHeading?: string | null; heading?: string | null; description?: unknown } | null
  items?: Array<{ title?: string | null; icon?: string | null; description?: unknown; ctaGroup?: unknown } | null> | null
}
