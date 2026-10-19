import type { CtaGroup, Media, SectionIntro } from '../../../shared/content.js'

export interface HeroContent {
  intro: SectionIntro
  ctas?: CtaGroup
  image: Media
  mobileImage?: Media | null
}

type DraftFields<T> = { [Field in keyof T]?: T[Field] | null }
type PayloadID = string | number

export type PayloadHeroMedia = DraftFields<Media> & { id?: PayloadID }

export interface PayloadHeroDocument extends DraftFields<Omit<HeroContent, 'intro' | 'ctas' | 'image' | 'mobileImage'>> {
  id?: PayloadID
  blockName?: string | null
  blockType?: string
  intro?: { accentHeading?: string | null; heading?: string | null; description?: unknown } | null
  ctas?: unknown
  image?: PayloadHeroMedia | PayloadID | null
  mobileImage?: PayloadHeroMedia | PayloadID | null
}
