// @generated structural section — source manifest remains the contract.
import type { Block, CollectionSlug } from 'payload'
import { createManifestBlock, manifestToProps } from '../../../shared/manifest-block.js'
import type { BetaProductDetailsAllentownContent, PayloadBetaProductDetailsAllentownDocument } from './product-details-allentown.types.js'

const manifest = {
  "slug": "product-details-allentown",
  "title": "Product Details Allentown",
  "status": "beta",
  "fields": {
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
      "minItems": 1,
      "fields": {
        "title": {
          "kind": "text",
          "required": true,
          "localized": true
        },
        "subtitle": {
          "kind": "text",
          "required": false,
          "localized": true
        },
        "description": {
          "kind": "textarea",
          "required": true,
          "localized": true
        },
        "detailHeading": {
          "kind": "text",
          "required": false,
          "localized": true
        },
        "details": {
          "kind": "componentList",
          "componentId": "atoms/label/allentown",
          "required": false,
          "localized": true,
          "minItems": 0,
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
              "description": "Optional Font Awesome icon key rendered before the label text."
            }
          }
        }
      }
    }
  }
} as const

export interface CreateBetaProductDetailsAllentownBlockOptions { mediaCollection?: CollectionSlug; formCollection?: CollectionSlug; targetCollections?: CollectionSlug[] }

export function createBetaProductDetailsAllentownBlock(options: CreateBetaProductDetailsAllentownBlockOptions = {}): Block {
  return createManifestBlock(manifest, options)
}

export function betaProductDetailsAllentownToProps(data: PayloadBetaProductDetailsAllentownDocument): BetaProductDetailsAllentownContent {
  return manifestToProps(data)
}
