import type { HeroContent } from '../../../../src/types.js'

// Snapshot of kinekt.io's hero. Production sites supply their own CMS content.
export const hero = {
  eyebrow: 'B2B marketing for complex technology',
  title: 'Ready to give\nyour product the',
  highlight: 'market it deserves',
  titleSuffix: '?',
  description: 'You take your product seriously. We give your marketing the same attention: understanding what works, deciding what to build and making everything work together to help you sell.',
  cta: { label: 'See how we do it', href: 'https://kinekt.io/our-methods/' },
  image: { url: 'https://kinekt.io/wp-content/uploads/260918_kinekt_keyvisual_home-960x800.png', alt: 'Man viewing marketing growth metrics on smartphone', width: 960, height: 800 },
  mobileImage: { url: 'https://kinekt.io/wp-content/uploads/260918_kinekt_keyvisual_home_mobile-960x850.png', alt: 'Man viewing marketing growth metrics on smartphone', width: 960, height: 850 },
} satisfies HeroContent
