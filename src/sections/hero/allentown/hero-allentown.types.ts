export interface HeroImage {
  url: string
  alt: string
  width: number
  height: number
}

export interface HeroContent {
  eyebrow: string
  title: string
  highlight?: string | null
  titleSuffix?: string | null
  description: string
  cta: { label: string; href: string }
  image: HeroImage
  mobileImage?: HeroImage | null
}

// Payload drafts may omit fields or contain null; the field value types stay shared.
type DraftFields<T> = { [Field in keyof T]?: T[Field] | null }
type PayloadID = string | number

export type PayloadHeroMedia = DraftFields<HeroImage> & { id?: PayloadID }

export interface PayloadHeroDocument extends DraftFields<Omit<HeroContent, 'cta' | 'image' | 'mobileImage'>> {
  id?: PayloadID
  blockName?: string | null
  blockType?: string
  cta?: DraftFields<HeroContent['cta']> | null
  image?: PayloadHeroMedia | PayloadID | null
  mobileImage?: PayloadHeroMedia | PayloadID | null
}
