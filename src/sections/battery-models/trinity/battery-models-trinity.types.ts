import type { Cta, CtaGroup, Media, RichText, SectionIntro, SectionTheme } from '../../../shared/content.js'

export interface BatteryRatingTrinity {
  label: string
  score: 1 | 2 | 3 | 4 | 5
}

export interface BatteryModelTrinity {
  image: Media
  title: string
  bestForIcon?: string
  bestForText?: string
  description: string | RichText
  ratings: BatteryRatingTrinity[]
  webshopCta: Cta
  specificationCta?: Cta
}

export interface BatteryModelsTrinityContent {
  id?: string
  theme?: SectionTheme
  intro: SectionIntro
  catalogueCta?: Cta
  models: BatteryModelTrinity[]
  callout?: { intro: SectionIntro; ctaGroup?: CtaGroup }
}

export type PayloadBatteryModelsTrinityDocument = Record<string, unknown> & { id?: string }
