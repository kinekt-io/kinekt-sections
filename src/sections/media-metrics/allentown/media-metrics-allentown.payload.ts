import type { Block, CollectionSlug } from 'payload'
import { createManifestBlock } from '../../../shared/manifest-block.js'
import { richTextToHtml } from '../../../shared/rich-text.js'
import { mediaToProps, optionalSharpSolidIcon, optionalText, requireArray, requireObject, requireText, requireTheme, type PayloadAdapterOptions } from '../../../shared/payload.js'
import { normalizeSectionContentWidth } from '../../../shared/section-width.js'
import type { MediaMetricsAllentownContent, PayloadMediaMetricsAllentownDocument } from './media-metrics-allentown.types.js'

const manifest = {
  "slug": "media-metrics-allentown",
  "title": "Media Metrics Allentown",
  "status": "prerelease",
  "fields": {
    "contentWidth": {
      "kind": "select",
      "required": false,
      "localized": true,
      "defaultValue": "standard",
      "options": [
        "standard",
        "80",
        "70"
      ],
      "description": "Maximum content width: Standard (100%), 80%, or 70%."
    },
    "theme": {
      "kind": "select",
      "required": true,
      "localized": true,
      "options": [
        "light",
        "semi-light",
        "semi-dark",
        "dark"
      ],
      "description": "CMS-selected presentation setting passed to the renderer."
    },
    "intro": {
      "kind": "component",
      "componentId": "components/intro/allentown",
      "required": true,
      "localized": true,
      "fields": {
        "accentHeading": {
          "kind": "text",
          "required": false,
          "localized": true
        },
        "heading": {
          "kind": "text",
          "required": true,
          "localized": true
        },
        "description": {
          "kind": "richText",
          "required": false,
          "localized": true
        }
      }
    },
    "metrics": {
      "kind": "componentList",
      "componentId": "components/result-item/allentown",
      "required": true,
      "localized": true,
      "minItems": 1,
      "maxItems": 4,
      "description": "One to four named metrics; each item presents a Label value before its heading.",
      "fields": {
        "label": {
          "kind": "text",
          "required": true,
          "localized": true
        },
        "value": {
          "kind": "component",
          "componentId": "atoms/label/allentown",
          "required": true,
          "localized": true,
          "fields": {
            "text": {
              "kind": "text",
              "required": true,
              "localized": true
            },
            "icon": {
              "kind": "text",
              "required": false,
              "localized": true,
              "description": "Optional Font Awesome 7 Sharp Solid icon name rendered before the label text."
            }
          }
        }
      }
    },
    "media": {
      "kind": "media",
      "required": false,
      "localized": true,
      "description": "Optional editor-selected supporting media, localized per locale."
    }
  }
} as const

export interface CreateMediaMetricsAllentownBlockOptions { mediaCollection?: CollectionSlug; formCollection?: CollectionSlug }

export function createMediaMetricsAllentownBlock(options: CreateMediaMetricsAllentownBlockOptions = {}): Block {
  return createManifestBlock(manifest, options)
}

export function mediaMetricsAllentownToProps(data: PayloadMediaMetricsAllentownDocument, options: PayloadAdapterOptions = {}): MediaMetricsAllentownContent {
  const intro = requireObject(data.intro, 'intro')
  const media = data.media

  return {
    contentWidth: normalizeSectionContentWidth(data.contentWidth),
    theme: requireTheme(data.theme),
    intro: {
      accentHeading: optionalText(intro.accentHeading, 'intro.accentHeading'),
      heading: requireText(intro.heading, 'intro.heading'),
      ...(intro.description ? { description: { html: richTextToHtml(intro.description, 'intro.description') } } : {}),
    },
    metrics: requireArray(data.metrics, 'metrics').map((item, index) => {
      const metric = requireObject(item, 'metrics[' + index + ']')
      const value = requireObject(metric.value, 'metrics[' + index + '].value')
      const icon = optionalSharpSolidIcon(value.icon, 'metrics[' + index + '].value.icon')

      return {
        label: requireText(metric.label, 'metrics[' + index + '].label'),
        value: {
          text: requireText(value.text, 'metrics[' + index + '].value.text'),
          ...(icon ? { icon } : {}),
        },
      }
    }),
    ...(media === undefined ? {} : { media: media === null ? null : mediaToProps(media, 'media', options) }),
  }
}
