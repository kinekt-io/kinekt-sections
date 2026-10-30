import type { CtaGroup, Media, RichText, SectionIntro } from '../../../shared/content.js'
import type { BetaTheme } from '../../../shared/payload.js'

export interface ProductOption {
  image: Media
  title: string
  description: string | RichText
  benefits?: string[] | null
}

export interface ProductOptionsAllentownContent {
  theme: BetaTheme
  intro: SectionIntro
  ctas?: CtaGroup
  options: ProductOption[]
  /** HubSpot embed code (manifest kind formEmbed). */
  form?: string | null
}

type DraftFields<T> = { [Field in keyof T]?: T[Field] | null }

export interface PayloadProductOptionsAllentownDocument extends DraftFields<Omit<ProductOptionsAllentownContent, 'intro' | 'ctas' | 'options' | 'form'>> {
  blockType?: string
  intro?: { accentHeading?: string | null; heading?: string | null; description?: unknown } | null
  ctas?: unknown
  options?: Array<{ image?: unknown; title?: string | null; description?: unknown; benefits?: string[] | null }> | null
  form?: string | null
}
