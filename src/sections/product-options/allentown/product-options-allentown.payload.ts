// @generated structural section — source manifest remains the contract.
import type { Block, CollectionSlug } from 'payload'
import { createManifestBlock, manifestToProps } from '../../../shared/manifest-block.js'
import type { BetaProductOptionsAllentownContent, PayloadBetaProductOptionsAllentownDocument } from './product-options-allentown.types.js'

const manifest = {
  "slug": "product-options-allentown",
  "title": "Product Options Allentown",
  "status": "planned",
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
    "options": {
      "kind": "componentList",
      "componentId": "components/option-card/allentown",
      "required": true,
      "localized": true,
      "minItems": 1
    },
    "form": {
      "kind": "formReference",
      "required": false,
      "localized": true,
      "description": "Only active forms available to the current region are selectable."
    }
  }
} as const

export interface CreateBetaProductOptionsAllentownBlockOptions { mediaCollection?: CollectionSlug; formCollection?: CollectionSlug }

export function createBetaProductOptionsAllentownBlock(options: CreateBetaProductOptionsAllentownBlockOptions = {}): Block {
  return createManifestBlock(manifest, options)
}

export function betaProductOptionsAllentownToProps(data: PayloadBetaProductOptionsAllentownDocument): BetaProductOptionsAllentownContent {
  return manifestToProps(data)
}
