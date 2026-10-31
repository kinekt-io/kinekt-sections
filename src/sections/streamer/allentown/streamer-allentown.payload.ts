import type { Block, CollectionSlug, Field } from 'payload'
import { ctaFields, ctaStyleField, sectionContentWidthField, sectionIntroFields } from '../../../shared/payload-fields.js'
import { ctaGroupToProps, optionalText, requireObject, requireText, requireTheme, type PayloadAdapterOptions } from '../../../shared/payload.js'
import { richTextToHtml } from '../../../shared/rich-text.js'
import type { PayloadStreamerAllentownDocument, StreamerAllentownContent } from './streamer-allentown.types.js'
import { normalizeSectionContentWidth } from '../../../shared/section-width.js'

export interface CreateStreamerAllentownBlockOptions {
  targetCollections?: CollectionSlug[]
}

function actionFields(targetCollections: CollectionSlug[]): Field[] {
  return [
    {
      name: 'ctas',
      type: 'array',
      localized: true,
      minRows: 0,
      maxRows: 2,
      admin: {
        initCollapsed: true,
        description: 'Add zero, one or two actions. Set each action to Primary, Secondary, Clear or Clear base.',
      },
      fields: [
        ctaStyleField(),
        ...ctaFields(targetCollections),
      ],
    },
  ]
}

export function createStreamerAllentownBlock({ targetCollections = ['pages'] }: CreateStreamerAllentownBlockOptions = {}): Block {
  return {
    slug: 'beta-streamer-allentown',
    interfaceName: 'StreamerAllentown',
    labels: {
      singular: 'PRERELEASE — Streamer Allentown',
      plural: 'PRERELEASE — Streamer Allentown blocks',
    },
    fields: [
      sectionContentWidthField(),
      {
        name: 'theme',
        type: 'select',
        localized: true,
        required: true,
        defaultValue: 'semi-light',
        options: ['light', 'semi-light', 'semi-dark', 'dark'].map((value) => ({ label: value, value })),
      },
      { name: 'intro', type: 'group', localized: true, fields: sectionIntroFields() },
      ...actionFields(targetCollections),
    ],
  }
}

export function streamerAllentownToProps(data: PayloadStreamerAllentownDocument, options: PayloadAdapterOptions = {}): StreamerAllentownContent {
  const block = requireObject(data, 'streamerAllentown')
  const intro = requireObject(block.intro, 'intro')
  const ctas = ctaGroupToProps(block.ctas, 'ctas', options)

  return {
    contentWidth: normalizeSectionContentWidth(data.contentWidth),
    theme: requireTheme(block.theme),
    intro: {
      heading: requireText(intro.heading, 'intro.heading'),
      ...(optionalText(intro.accentHeading, 'intro.accentHeading') ? { accentHeading: optionalText(intro.accentHeading, 'intro.accentHeading') } : {}),
      ...(intro.description ? { description: { html: richTextToHtml(intro.description, 'intro.description') } } : {}),
    },
    ...(ctas ? { ctas } : {}),
  }
}
