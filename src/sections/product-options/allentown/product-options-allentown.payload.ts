import type { Block, CollectionSlug } from 'payload'
import { createManifestBlock, manifestToProps } from '../../../shared/manifest-block.js'
import type { ProductOptionsAllentownContent, PayloadProductOptionsAllentownDocument } from './product-options-allentown.types.js'

const manifest = {
  "slug": "product-options-allentown",
  "title": "Product Options Allentown",
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
    "ctas": {
      "kind": "ctaGroup",
      "required": false,
      "localized": true,
      "description": "Optional primary and secondary actions below the introduction."
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

export function betaProductOptionsAllentownToProps(data: PayloadProductOptionsAllentownDocument): ProductOptionsAllentownContent {
  return manifestToProps(data) as ProductOptionsAllentownContent
}
