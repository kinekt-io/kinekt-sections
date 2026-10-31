import type { Block, CollectionSlug } from 'payload'

import type { HeroContent, PayloadHeroDocument } from './hero-trinity.types.js'
import { richTextToHtml } from '../../../shared/rich-text.js'
import { ctaGroupToProps, mediaToProps, optionalText, requireObject, requireText, requireTheme, type PayloadAdapterOptions } from '../../../shared/payload.js'
import { ctaGroupFields, sectionContentWidthField } from '../../../shared/payload-fields.js'
import { normalizeSectionContentWidth } from '../../../shared/section-width.js'

export interface CreateHeroBlockOptions { mediaCollection?: CollectionSlug; targetCollections?: CollectionSlug[] }

const requiredTextValidationMessage = 'Enter non-empty text.'

/** Creates a localized Trinity Hero block with a reusable Intro Block and optional CTA Group. */
export function createHeroBlock({ mediaCollection = 'media', targetCollections = ['pages'] }: CreateHeroBlockOptions = {}): Block {
  return {
    slug: 'hero-trinity', interfaceName: 'HeroTrinity',
    labels: { singular: 'BETA — Hero Trinity', plural: 'BETA — Hero Trinity blocks' },
    fields: [
      sectionContentWidthField(),
      { name: 'theme', type: 'select', required: true, defaultValue: 'dark', options: ['light', 'semi-light', 'semi-dark', 'dark'].map((value) => ({ label: value, value })) },
      { name: 'intro', type: 'group', label: 'Intro Block', localized: true, required: true, fields: [
        { name: 'accentHeading', type: 'text', label: 'Accent heading' },
        { name: 'heading', type: 'text', label: 'Heading', required: true, validate: (value: unknown) => hasText(value) || requiredTextValidationMessage },
        { name: 'description', type: 'richText', label: 'Description' },
      ] },
      { name: 'ctas', type: 'group', label: 'CTA Group', localized: true, fields: ctaGroupFields(targetCollections) },
      { name: 'image', type: 'upload', label: 'Image', relationTo: mediaCollection as CollectionSlug, localized: true, required: true },
      { name: 'mobileImage', type: 'upload', label: 'Mobile image', relationTo: mediaCollection as CollectionSlug, localized: true },
    ],
  }
}

export function heroToProps(data: PayloadHeroDocument, options: PayloadAdapterOptions = {}): HeroContent {
  const intro = requireObject(data.intro, 'intro')
  const ctas = ctaGroupToProps(data.ctas, 'ctas', options)
  return {
    contentWidth: normalizeSectionContentWidth(data.contentWidth),
    theme: requireTheme(data.theme),
    intro: { accentHeading: optionalText(intro.accentHeading, 'intro.accentHeading'), heading: requireText(intro.heading, 'intro.heading'), ...(intro.description ? { description: { html: richTextToHtml(intro.description, 'intro.description') } } : {}) },
    ...(ctas ? { ctas } : {}),
    image: mediaToProps(data.image, 'image', options),
    mobileImage: data.mobileImage === undefined || data.mobileImage === null ? data.mobileImage : mediaToProps(data.mobileImage, 'mobileImage', options),
  }
}

function hasText(value: unknown): value is string { return typeof value === 'string' && value.trim().length > 0 }
