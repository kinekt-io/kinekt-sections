import type { Block, CollectionSlug } from 'payload'

import type { HeroContent, PayloadHeroDocument } from './hero-trinity.types.js'
import { richTextToHtml } from '../../../shared/rich-text.js'
import { ctaGroupToProps, mediaToProps, optionalText, requireObject, requireText, requireTheme, type PayloadAdapterOptions } from '../../../shared/payload.js'
import { isSafeWebUrl } from '../../../urls.js'

export interface CreateHeroBlockOptions { mediaCollection?: string }

const requiredTextValidationMessage = 'Enter non-empty text.'
const ctaHrefValidationMessage = 'Enter an absolute HTTP(S) URL or a site-root-relative path.'

/** Creates a localized Trinity Hero block with a reusable Intro Block and optional CTA Group. */
export function createHeroBlock({ mediaCollection = 'media' }: CreateHeroBlockOptions = {}): Block {
  return {
    slug: 'hero-trinity', interfaceName: 'HeroTrinity',
    labels: { singular: 'BETA — Hero Trinity', plural: 'BETA — Hero Trinity blocks' },
    fields: [
      { name: 'theme', type: 'select', required: true, defaultValue: 'dark', options: ['light', 'semi-light', 'dark', 'semi-dark'].map((value) => ({ label: value, value })) },
      { name: 'intro', type: 'group', label: 'Intro Block', localized: true, required: true, fields: [
        { name: 'accentHeading', type: 'text', label: 'Accent heading' },
        { name: 'heading', type: 'text', label: 'Heading', required: true, validate: (value: unknown) => hasText(value) || requiredTextValidationMessage },
        { name: 'description', type: 'richText', label: 'Description' },
      ] },
      { name: 'ctas', type: 'group', label: 'CTA Group', localized: true, fields: [
        { name: 'primary', type: 'group', label: 'Primary CTA', fields: ctaFields() },
        { name: 'secondary', type: 'group', label: 'Secondary CTA', fields: ctaFields() },
      ] },
      { name: 'image', type: 'upload', label: 'Image', relationTo: mediaCollection as CollectionSlug, localized: true, required: true },
      { name: 'mobileImage', type: 'upload', label: 'Mobile image', relationTo: mediaCollection as CollectionSlug, localized: true },
    ],
  }
}

export function heroToProps(data: PayloadHeroDocument, options: PayloadAdapterOptions = {}): HeroContent {
  const intro = requireObject(data.intro, 'intro')
  const ctas = ctaGroupToProps(data.ctas, 'ctas', false)
  return {
    theme: requireTheme(data.theme),
    intro: { accentHeading: optionalText(intro.accentHeading, 'intro.accentHeading'), heading: requireText(intro.heading, 'intro.heading'), ...(intro.description ? { description: { html: richTextToHtml(intro.description, 'intro.description') } } : {}) },
    ...(ctas ? { ctas } : {}),
    image: mediaToProps(data.image, 'image', options),
    mobileImage: data.mobileImage === undefined || data.mobileImage === null ? data.mobileImage : mediaToProps(data.mobileImage, 'mobileImage', options),
  }
}

function ctaFields() {
  return [
    { name: 'label', type: 'text' as const, label: 'Label', required: true, validate: (value: unknown) => hasText(value) || requiredTextValidationMessage },
    { name: 'href', type: 'text' as const, label: 'URL', required: true, validate: (value: unknown) => isSafeWebUrl(value) || ctaHrefValidationMessage },
  ]
}
function hasText(value: unknown): value is string { return typeof value === 'string' && value.trim().length > 0 }
