import type { Block, CollectionSlug } from 'payload'

import type { HeroContent, HeroImage } from './types.js'
import { isSafeWebUrl } from './urls.js'

export interface CreateHeroBlockOptions {
  /** The Payload upload collection used for the hero images. Defaults to `media`. */
  mediaCollection?: string
}

export interface HeroToPropsOptions {
  /**
   * Absolute CMS origin used to resolve Payload's same-origin root-relative media URLs.
   * Leave unset when the consumer serves media from that same origin.
   */
  mediaBaseUrl?: string
}

type PayloadID = string | number

type PayloadHeroMedia = {
  id?: PayloadID
  url?: string | null
  alt?: string | null
  width?: number | null
  height?: number | null
}

/** Structural shape accepted from a generated Payload hero block type. */
export interface PayloadHeroDocument {
  id?: PayloadID
  blockName?: string | null
  blockType?: string
  eyebrow?: string | null
  title?: string | null
  highlight?: string | null
  titleSuffix?: string | null
  description?: string | null
  cta?: {
    label?: string | null
    href?: string | null
  } | null
  image?: PayloadHeroMedia | PayloadID | null
  mobileImage?: PayloadHeroMedia | PayloadID | null
}

const ctaHrefValidationMessage = 'Enter an absolute HTTP(S) URL or a site-root-relative path.'
const requiredTextValidationMessage = 'Enter non-empty text.'

/** Creates a localized Hero block backed by a Payload upload collection. */
export function createHeroBlock({ mediaCollection = 'media' }: CreateHeroBlockOptions = {}): Block {
  return {
    slug: 'hero',
    interfaceName: 'Hero',
    labels: {
      singular: 'Hero',
      plural: 'Heroes',
    },
    fields: [
      {
        name: 'eyebrow',
        type: 'text',
        label: 'Eyebrow',
        localized: true,
        required: true,
        validate: (value: unknown) => hasText(value) || requiredTextValidationMessage,
      },
      {
        name: 'title',
        type: 'textarea',
        label: 'Title',
        localized: true,
        required: true,
        validate: (value) => hasText(value) || requiredTextValidationMessage,
      },
      {
        name: 'highlight',
        type: 'text',
        label: 'Highlight',
        localized: true,
      },
      {
        name: 'titleSuffix',
        type: 'text',
        label: 'Title suffix',
        localized: true,
      },
      {
        name: 'description',
        type: 'textarea',
        label: 'Description',
        localized: true,
        required: true,
        validate: (value) => hasText(value) || requiredTextValidationMessage,
      },
      {
        name: 'cta',
        type: 'group',
        label: 'Call to action',
        fields: [
          {
            name: 'label',
            type: 'text',
            label: 'Label',
            localized: true,
            required: true,
            validate: (value: unknown) => hasText(value) || requiredTextValidationMessage,
          },
          {
            name: 'href',
            type: 'text',
            label: 'URL',
            required: true,
            validate: (value: unknown) => isSafeWebUrl(value) || ctaHrefValidationMessage,
          },
        ],
      },
      {
        name: 'image',
        type: 'upload',
        label: 'Image',
        relationTo: mediaCollection as CollectionSlug,
        required: true,
      },
      {
        name: 'mobileImage',
        type: 'upload',
        label: 'Mobile image',
        relationTo: mediaCollection as CollectionSlug,
      },
    ],
  }
}

/**
 * Converts a populated Payload Hero block to the shared render contract.
 * Upload fields must be queried at a depth that resolves the media document.
 */
export function heroToProps(data: PayloadHeroDocument, options: HeroToPropsOptions = {}): HeroContent {
  const cta = requireObject(data.cta, 'cta')

  return {
    eyebrow: requireText(data.eyebrow, 'eyebrow'),
    title: requireText(data.title, 'title'),
    highlight: optionalText(data.highlight, 'highlight'),
    titleSuffix: optionalText(data.titleSuffix, 'titleSuffix'),
    description: requireText(data.description, 'description'),
    cta: {
      label: requireText(cta.label, 'cta.label'),
      href: requireSafeUrl(cta.href, 'cta.href'),
    },
    image: mediaToImage(data.image, 'image', options),
    mobileImage:
      data.mobileImage === undefined || data.mobileImage === null
        ? data.mobileImage
        : mediaToImage(data.mobileImage, 'mobileImage', options),
  }
}

function requireObject(value: unknown, field: string): Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error(`Hero block requires a populated ${field} group.`)
  }

  return value as Record<string, unknown>
}

function hasText(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function requireText(value: unknown, field: string): string {
  if (!hasText(value)) {
    throw new Error(`Hero block requires a non-empty ${field} value.`)
  }

  return value
}
function optionalText(value: unknown, field: string): string | null | undefined {
  if (value === undefined || value === null) {
    return value
  }

  if (typeof value === 'string' && value.trim().length === 0) {
    return null
  }

  return requireText(value, field)
}

function requireSafeUrl(value: unknown, field: string): string {
  if (!isSafeWebUrl(value)) {
    throw new Error(`Hero block requires ${field} to be an absolute HTTP(S) or site-root-relative URL.`)
  }

  return value
}

function mediaToImage(value: unknown, field: string, options: HeroToPropsOptions): HeroImage {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error(
      `Hero block ${field} must be a populated media document; query Payload with relationship depth to resolve uploads.`,
    )
  }

  const media = value as PayloadHeroMedia
  const url = requireSafeUrl(media.url, `${field}.url`)
  const width = requirePositiveDimension(media.width, `${field}.width`)
  const height = requirePositiveDimension(media.height, `${field}.height`)

  if (typeof media.alt !== 'string') {
    throw new Error(`Hero block ${field}.alt must be a string; use an empty string only for decorative media.`)
  }

  return {
    url: resolveMediaUrl(url, options.mediaBaseUrl),
    alt: media.alt,
    width,
    height,
  }
}

function requirePositiveDimension(value: unknown, field: string): number {
  if (typeof value !== 'number' || !Number.isSafeInteger(value) || value <= 0) {
    throw new Error(`Hero block ${field} must be a positive safe integer.`)
  }

  return value
}

function resolveMediaUrl(url: string, mediaBaseUrl: string | undefined): string {
  if (!url.startsWith('/') || mediaBaseUrl === undefined) {
    return url
  }

  if (!isSafeWebUrl(mediaBaseUrl) || mediaBaseUrl.startsWith('/')) {
    throw new Error('Hero mediaBaseUrl must be an absolute HTTP(S) URL.')
  }

  return new URL(url, mediaBaseUrl).toString()
}
