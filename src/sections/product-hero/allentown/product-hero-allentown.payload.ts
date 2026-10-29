// @generated structural section — source manifest remains the contract.
import type { Block, CollectionSlug } from 'payload'
import { createManifestBlock, manifestToProps } from '../../../shared/manifest-block.js'
import type { BetaProductHeroAllentownContent, PayloadBetaProductHeroAllentownDocument } from './product-hero-allentown.types.js'

const manifest = {
  "slug": "product-hero-allentown",
  "title": "Product Hero Allentown",
  "status": "prerelease",
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
    "features": {
      "kind": "featureItems",
      "required": true,
      "localized": true,
      "minItems": 1,
      "description": "Short product features. The renderer supplies the check marker."
    },
    "ctaGroup": {
      "kind": "component",
      "componentId": "components/cta-group/allentown",
      "required": true,
      "localized": true,
      "fields": {
        "buttons": {
          "kind": "ctaGroup",
          "required": false,
          "localized": true,
          "minItems": 0,
          "maxItems": 2,
          "description": "Add zero, one or two actions. Set the style of each action to Primary, Secondary or Clear."
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
