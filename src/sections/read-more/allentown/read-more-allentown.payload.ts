import type { Block, CollectionSlug } from 'payload'
import type { PayloadReadMoreDocument, ReadMoreContent } from './read-more-allentown.types.js'
import { richTextToHtml } from '../../../shared/rich-text.js'
import { ctaGroupToProps, mediaToProps, optionalText, requireObject, requireText, requireTheme, type PayloadAdapterOptions } from '../../../shared/payload.js'
import { ctaGroupFields } from '../../../shared/payload-fields.js'

export interface CreateReadMoreBlockOptions {
  mediaCollection?: CollectionSlug
  targetCollections?: CollectionSlug[]
}

export function createReadMoreBlock({ mediaCollection = 'media', targetCollections = ['pages'] }: CreateReadMoreBlockOptions = {}): Block {
  return {
    slug: 'read-more-allentown',
    interfaceName: 'ReadMoreAllentown',
    labels: { singular: 'BETA — Read More Allentown', plural: 'BETA — Read More Allentown blocks' },
    fields: [
      { name: 'theme', type: 'select', localized: true, required: true, defaultValue: 'light', options: ['light', 'semi-light', 'semi-dark', 'dark'].map((value) => ({ label: value, value })) },
      { name: 'intro', type: 'group', localized: true, fields: [{ name: 'accentHeading', type: 'text' }, { name: 'heading', type: 'text', required: true }, { name: 'description', type: 'richText' }] },
      { name: 'label', type: 'group', localized: true, fields: [{ name: 'text', type: 'text' }, { name: 'icon', type: 'text' }] },
      { name: 'ctas', type: 'group', label: 'CTA Group', localized: true, fields: ctaGroupFields(targetCollections) },
      { name: 'media', type: 'upload', relationTo: mediaCollection, localized: true, required: true },
    ],
  }
}

export function readMoreToProps(data: PayloadReadMoreDocument, options: PayloadAdapterOptions = {}): ReadMoreContent {
  const intro = requireObject(data.intro, 'intro')
  const label = data.label == null ? undefined : requireObject(data.label, 'label')
  const labelText = label ? optionalText(label.text, 'label.text') : undefined
  const labelIcon = label ? optionalText(label.icon, 'label.icon') : undefined
  return {
    theme: requireTheme(data.theme),
    intro: {
      accentHeading: optionalText(intro.accentHeading, 'intro.accentHeading'),
      heading: requireText(intro.heading, 'intro.heading'),
      ...(intro.description ? { description: { html: richTextToHtml(intro.description, 'intro.description') } } : {}),
    },
    ...(labelText ? { label: { text: labelText, ...(labelIcon ? { icon: labelIcon } : {}) } } : {}),
    ctas: ctaGroupToProps(data.ctas, 'ctas', options) ?? {},
    media: mediaToProps(data.media, 'media', options),
  }
}
