// @generated structural section — source manifest remains the contract.
import type { Block, CollectionSlug } from 'payload'
import { createManifestBlock, manifestToProps } from '../../../shared/manifest-block.js'
import type { BetaProofMetricsAllentownContent, PayloadBetaProofMetricsAllentownDocument } from './proof-metrics-allentown.types.js'

const manifest = {
  "slug": "proof-metrics-allentown",
  "title": "Proof Metrics Allentown",
  "fields": {
    "theme": {
      "kind": "select",
      "required": true,
      "localized": false,
      "options": [
        "light",
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
      "minItems": 1,
      "description": "One or more named metrics; each metric has a required label and a localized Label value."
    },
    "media": {
      "kind": "media",
      "required": false,
      "localized": true,
      "description": "Optional editor-selected proof media, localized per locale."
    },
    "callout": {
      "kind": "component",
      "componentId": "components/callout/allentown",
      "required": true,
      "localized": true,
      "description": "A localized action callout with a required Button component."
    }
  }
} as const

export interface CreateBetaProofMetricsAllentownBlockOptions { mediaCollection?: CollectionSlug; formCollection?: CollectionSlug }

export function createBetaProofMetricsAllentownBlock(options: CreateBetaProofMetricsAllentownBlockOptions = {}): Block {
  return createManifestBlock(manifest, options)
}

export function betaProofMetricsAllentownToProps(data: PayloadBetaProofMetricsAllentownDocument): BetaProofMetricsAllentownContent {
  return manifestToProps(data)
}
