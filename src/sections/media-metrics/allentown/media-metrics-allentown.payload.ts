// @generated structural section — source manifest remains the contract.
import type { Block, CollectionSlug } from 'payload'
import { createManifestBlock, manifestToProps } from '../../../shared/manifest-block.js'
import type { BetaMediaMetricsAllentownContent, PayloadBetaMediaMetricsAllentownDocument } from './media-metrics-allentown.types.js'

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
      "minItems": 1
    },
    "media": {
      "kind": "media",
      "required": false,
      "localized": true,
      "description": "Optional editor-selected aside media, localized per locale."
    }
  }
} as const

export interface CreateBetaMediaMetricsAllentownBlockOptions { mediaCollection?: CollectionSlug; formCollection?: CollectionSlug }

export function createBetaMediaMetricsAllentownBlock(options: CreateBetaMediaMetricsAllentownBlockOptions = {}): Block {
  return createManifestBlock(manifest, options)
}

export function betaMediaMetricsAllentownToProps(data: PayloadBetaMediaMetricsAllentownDocument): BetaMediaMetricsAllentownContent {
  return manifestToProps(data)
}
