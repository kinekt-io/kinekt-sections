import type { Block, CollectionSlug } from 'payload'
import type { OutputCardGridContent, PayloadOutputCardGridDocument } from './output-card-grid-allentown.types.js'
import { richTextToHtml } from '../../../shared/rich-text.js'
import { ctaGroupToProps, mediaToProps, optionalText, requireArray, requireObject, requireText, requireTheme, type PayloadAdapterOptions } from '../../../shared/payload.js'
import { ctaGroupFields, sectionContentWidthField } from '../../../shared/payload-fields.js'
import { normalizeSectionContentWidth } from '../../../shared/section-width.js'

export interface CreateOutputCardGridBlockOptions { mediaCollection?: CollectionSlug; targetCollections?: CollectionSlug[] }

export function createOutputCardGridBlock({ mediaCollection = 'media', targetCollections = ['pages'] }: CreateOutputCardGridBlockOptions = {}): Block {
  return {
    slug: 'output-card-grid-allentown',
    interfaceName: 'OutputCardGridAllentown',
    labels: { singular: 'BETA — Output Card Grid Allentown', plural: 'BETA — Output Card Grid Allentown blocks' },
    fields: [
      sectionContentWidthField(),
      { name: 'theme', type: 'select', localized: true, required: true, defaultValue: 'light', options: ['light', 'semi-light', 'semi-dark', 'dark'].map((value) => ({ label: value, value })) },
      { name: 'intro', type: 'group', localized: true, fields: [{ name: 'accentHeading', type: 'text' }, { name: 'heading', type: 'text', required: true }, { name: 'description', type: 'richText' }] },
      { name: 'ctas', type: 'group', localized: true, fields: ctaGroupFields(targetCollections) },
      { name: 'label', type: 'text', localized: true },
      { name: 'cards', type: 'array', localized: true, required: true, minRows: 1, fields: [{ name: 'image', type: 'upload', relationTo: mediaCollection, required: true }, { name: 'title', type: 'text', required: true }, { name: 'description', type: 'richText', required: true }] },
    ],
  }
}

export function outputCardGridToProps(data: PayloadOutputCardGridDocument, options: PayloadAdapterOptions = {}): OutputCardGridContent {
  const intro = requireObject(data.intro, 'intro')
  const ctas = ctaGroupToProps(data.ctas, 'ctas', options)
  const label = optionalText(data.label, 'label')

  return {
    contentWidth: normalizeSectionContentWidth(data.contentWidth),
    theme: requireTheme(data.theme),
    intro: {
      accentHeading: optionalText(intro.accentHeading, 'intro.accentHeading'),
      heading: requireText(intro.heading, 'intro.heading'),
      ...(intro.description ? { description: { html: richTextToHtml(intro.description, 'intro.description') } } : {}),
    },
    ...(ctas ? { ctas } : {}),
    ...(label ? { label } : {}),
    cards: requireArray(data.cards, 'cards').map((item, index) => {
      const card = requireObject(item, `cards[${index}]`)
      return {
        image: mediaToProps(card.image, `cards[${index}].image`, options),
        title: requireText(card.title, `cards[${index}].title`),
        description: { html: richTextToHtml(card.description, `cards[${index}].description`) },
      }
    }),
  }
}
