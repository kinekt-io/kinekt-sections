// @generated structural section — source manifest remains the contract.
import type { Block, CollectionSlug } from 'payload'
import { createManifestBlock, manifestToProps } from '../../../shared/manifest-block.js'
import type { BetaFaqAllentownContent, PayloadBetaFaqAllentownDocument } from './faq-allentown.types.js'

const manifest = {
  "slug": "faq-allentown",
  "title": "FAQ Allentown",
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
    "items": {
      "kind": "componentList",
      "componentId": "components/faq-item/allentown",
      "required": true,
      "localized": true,
      "minItems": 1
    },
    "overviewCta": {
      "kind": "component",
      "componentId": "controls/button/allentown",
      "required": false,
      "localized": true
    },
    "callout": {
      "kind": "component",
      "componentId": "components/callout/allentown",
      "required": false,
      "localized": true
    }
  }
} as const

export interface CreateBetaFaqAllentownBlockOptions { mediaCollection?: CollectionSlug; formCollection?: CollectionSlug }

export function createBetaFaqAllentownBlock(options: CreateBetaFaqAllentownBlockOptions = {}): Block {
  return createManifestBlock(manifest, options)
}

export function betaFaqAllentownToProps(data: PayloadBetaFaqAllentownDocument): BetaFaqAllentownContent {
  return manifestToProps(data)
}
