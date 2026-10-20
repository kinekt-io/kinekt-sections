import type { CtaGroup, Media, SectionIntro } from '../../../shared/content.js'
import type { BetaTheme } from '../../../shared/payload.js'

export interface ProductOption {
  image: Media
  title: string
  description: string
  benefits?: string[] | null
}

export interface FormReference {
  id?: string | number
  name?: string
}

export interface ProductOptionsAllentownContent {
  theme: BetaTheme
  intro: SectionIntro
  ctas?: CtaGroup
  options: ProductOption[]
  form?: FormReference | string | number | null
}

type DraftFields<T> = { [Field in keyof T]?: T[Field] | null }
type PayloadID = string | number

export interface PayloadProductOptionsAllentownDocument extends DraftFields<Omit<ProductOptionsAllentownContent, 'intro' | 'ctas' | 'options'>> {
  blockType?: string
  intro?: { accentHeading?: string | null; heading?: string | null; description?: unknown } | null
  ctas?: unknown
  options?: Array<{ image?: unknown; title?: string | null; description?: string | null; benefits?: string[] | null }> | null
  form?: (DraftFields<FormReference> & { id?: PayloadID }) | PayloadID | null
}
