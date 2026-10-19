// @generated structural section — source manifest remains the contract.
import type { Block, CollectionSlug } from 'payload'
import { createManifestBlock, manifestToProps } from '../../../shared/manifest-block.js'
import type { BetaProductDetailsAllentownContent, PayloadBetaProductDetailsAllentownDocument } from './product-details-allentown.types.js'

const manifest = {
  "slug": "product-details-allentown",
  "title": "Product Details Allentown",
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
    "image": {
      "kind": "media",
      "required": false,
      "localized": true
    },
    "detailLabel": {
      "kind": "text",
      "required": true,
      "localized": true
    },
    "items": {
      "kind": "componentList",
      "componentId": "components/product-detail-item/allentown",
      "required": true,
      "localized": true,
      "minItems": 1
    }
  }
} as const

export interface CreateBetaProductDetailsAllentownBlockOptions { mediaCollection?: CollectionSlug; formCollection?: CollectionSlug }

export function createBetaProductDetailsAllentownBlock(options: CreateBetaProductDetailsAllentownBlockOptions = {}): Block {
  return createManifestBlock(manifest, options)
}

export function betaProductDetailsAllentownToProps(data: PayloadBetaProductDetailsAllentownDocument): BetaProductDetailsAllentownContent {
  return manifestToProps(data)
}
