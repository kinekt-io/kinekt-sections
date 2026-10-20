import type { Block } from 'payload'
import type { OutputCardGridContent, PayloadOutputCardGridDocument } from './output-card-grid-allentown.types.js'
import { richTextToHtml } from '../../../shared/rich-text.js'
import { ctaGroupToProps, mediaToProps, optionalText, requireArray, requireObject, requireText, requireTheme, type PayloadAdapterOptions } from '../../../shared/payload.js'

export function createOutputCardGridBlock(options: PayloadAdapterOptions = {}): Block {
  return {
    slug: 'output-card-grid-allentown',
    interfaceName: 'OutputCardGridAllentown',
    labels: { singular: 'BETA — Output Card Grid Allentown', plural: 'BETA — Output Card Grid Allentown blocks' },
    fields: [
      { name: 'theme', type: 'select', required: true, defaultValue: 'light', options: ['light', 'semi-light', 'semi-dark', 'dark'].map((value) => ({ label: value, value })) },
      { name: 'intro', type: 'group', localized: true, fields: [{ name: 'accentHeading', type: 'text' }, { name: 'heading', type: 'text', required: true }, { name: 'description', type: 'richText' }] },
      { name: 'ctas', type: 'group', localized: true, fields: [{ name: 'primary', type: 'group', fields: [{ name: 'label', type: 'text' }, { name: 'href', type: 'text' }] }, { name: 'secondary', type: 'group', fields: [{ name: 'label', type: 'text' }, { name: 'href', type: 'text' }] }] },
      { name: 'label', type: 'text', localized: true },
      { name: 'cards', type: 'array', localized: true, required: true, minRows: 1, fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }, { name: 'title', type: 'text', required: true }, { name: 'description', type: 'richText', required: true }] },
    ],
  }
}

export function outputCardGridToProps(data: PayloadOutputCardGridDocument, options: PayloadAdapterOptions = {}): OutputCardGridContent {
  const intro = requireObject(data.intro, 'intro')
  const ctas = ctaGroupToProps(data.ctas, 'ctas', false)
  const label = optionalText(data.label, 'label')

  return {
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
