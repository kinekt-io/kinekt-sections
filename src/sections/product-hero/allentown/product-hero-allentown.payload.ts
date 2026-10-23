// @generated structural section — source manifest remains the contract.
import type { Block, CollectionSlug } from 'payload'
import { createManifestBlock, manifestToProps } from '../../../shared/manifest-block.js'
import type { BetaProductHeroAllentownContent, PayloadBetaProductHeroAllentownDocument } from './product-hero-allentown.types.js'

const manifest = {
  "slug": "product-hero-allentown",
  "title": "Product Hero Allentown",
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
    "featureListTitle": {
      "kind": "text",
      "required": true,
      "localized": true
    },
    "featurePairs": {
      "kind": "componentList",
      "componentId": "components/feature-pair/allentown",
      "minItems": 1,
      "required": true,
      "localized": true,
      "fields": {
        "label": {
          "kind": "text",
          "required": true,
          "localized": true
        },
        "value": {
          "kind": "text",
          "required": true,
          "localized": true
        }
      }
    },
    "ctaGroup": {
      "kind": "component",
      "componentId": "components/cta-group/allentown",
      "required": true,
      "localized": true,
      "fields": {
        "primaryButton": {
          "kind": "cta",
          "required": false,
          "localized": true,
          "description": "Optional primary Button component part."
        },
        "secondaryButton": {
          "kind": "cta",
          "required": false,
          "localized": true,
          "description": "Optional secondary Button component part."
        }
      }
    },
    "media": {
      "kind": "media",
      "required": true,
      "localized": true,
      "description": "Desktop hero media."
    },
    "mobileMedia": {
      "kind": "media",
      "required": false,
      "localized": true,
      "description": "Optional mobile-specific hero media."
    }
  }
} as const

export interface CreateBetaProductHeroAllentownBlockOptions { mediaCollection?: CollectionSlug; formCollection?: CollectionSlug; targetCollections?: CollectionSlug[] }

export function createBetaProductHeroAllentownBlock(options: CreateBetaProductHeroAllentownBlockOptions = {}): Block {
  return createManifestBlock(manifest, options)
}

export function betaProductHeroAllentownToProps(data: PayloadBetaProductHeroAllentownDocument): BetaProductHeroAllentownContent {
  return manifestToProps(data)
}
