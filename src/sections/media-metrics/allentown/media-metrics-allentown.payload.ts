import type { Block, CollectionSlug } from 'payload'
import { createManifestBlock, manifestToProps } from '../../../shared/manifest-block.js'
import type { MediaMetricsAllentownContent, PayloadMediaMetricsAllentownDocument } from './media-metrics-allentown.types.js'

const manifest = {
  "slug": "media-metrics-allentown",
  "title": "Media Metrics Allentown",
  "status": "beta",
  "fields": {
    "theme": {
      "kind": "select",
      "required": true,
      "localized": false,
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
      "localized": true
    },
    "metrics": {
      "kind": "componentList",
      "componentId": "components/result-item/allentown",
      "required": true,
      "localized": true,
      "minItems": 4,
      "maxItems": 4,
      "description": "Four named metrics; each item presents a Label value before its heading."
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

export function mediaMetricsAllentownToProps(data: PayloadMediaMetricsAllentownDocument): MediaMetricsAllentownContent {
  return manifestToProps(data) as MediaMetricsAllentownContent
}
