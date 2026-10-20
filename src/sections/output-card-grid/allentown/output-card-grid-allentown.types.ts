import type { CtaGroup, Media, RichText, SectionIntro } from '../../../shared/content.js'
import type { BetaTheme } from '../../../shared/payload.js'

export interface OutputCard {
  image: Media
  title: string
  description: RichText
}

export interface OutputCardGridContent {
  theme: BetaTheme
  intro: SectionIntro
  ctas?: CtaGroup
  label?: string
  cards: OutputCard[]
}

type DraftFields<T> = { [Field in keyof T]?: T[Field] | null }

export interface PayloadOutputCardGridDocument extends DraftFields<Omit<OutputCardGridContent, 'intro' | 'ctas' | 'cards'>> {
  blockType?: string
  intro?: { accentHeading?: string | null; heading?: string | null; description?: unknown } | null
  ctas?: unknown
  cards?: Array<{ image?: unknown; title?: string | null; description?: unknown }> | null
}
