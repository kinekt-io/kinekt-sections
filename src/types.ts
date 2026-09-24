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
