import type { Media, SectionIntro } from '../../../shared/content.js'
import type { BetaTheme } from '../../../shared/payload.js'
import type { SectionContentWidth } from '../../../shared/section-width.js'

export type FormSectionImagePosition = 'left' | 'right'
export type ContactMethodIcon = string

export interface ContactMethod {
  icon: ContactMethodIcon
  label: string
  href: string
}

export interface BetaFormSectionAllentownContent {
  contentWidth?: SectionContentWidth
  theme: BetaTheme
  intro: SectionIntro
  image?: Media
  imagePosition: FormSectionImagePosition
  form: string
  contactHeading?: string
  contactMethods?: ContactMethod[]
}

type DraftFields<T> = { [Field in keyof T]?: T[Field] | null }
type PayloadID = string | number

export interface PayloadBetaFormSectionAllentownDocument extends DraftFields<Omit<BetaFormSectionAllentownContent, 'intro' | 'image' | 'contactMethods'>> {
  blockType?: string
  intro?: {
    accentHeading?: string | null
    heading?: string | null
    description?: unknown
  } | null
  image?: (DraftFields<Media> & { id?: PayloadID }) | PayloadID | null
  contactMethods?: Array<{
    icon?: string | null
    label?: string | null
    href?: string | null
  }> | null
}
