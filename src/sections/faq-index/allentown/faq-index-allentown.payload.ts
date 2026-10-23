// @generated structural section — source manifest remains the contract.
import type { Block, CollectionSlug } from 'payload'
import { createManifestBlock, manifestToProps } from '../../../shared/manifest-block.js'
import type { BetaFaqIndexAllentownContent, PayloadBetaFaqIndexAllentownDocument } from './faq-index-allentown.types.js'

const manifest = {
  "slug": "faq-index-allentown",
  "title": "FAQ Index Allentown",
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
    "callout": {
      "kind": "component",
      "componentId": "components/callout/allentown",
      "required": false,
      "localized": true,
      "fields": {
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
        }
      }
    }
  }
} as const

export interface CreateBetaFaqIndexAllentownBlockOptions { mediaCollection?: CollectionSlug; formCollection?: CollectionSlug; targetCollections?: CollectionSlug[] }

export function createBetaFaqIndexAllentownBlock(options: CreateBetaFaqIndexAllentownBlockOptions = {}): Block {
  return createManifestBlock(manifest, options)
}

export function betaFaqIndexAllentownToProps(data: PayloadBetaFaqIndexAllentownDocument): BetaFaqIndexAllentownContent {
  return manifestToProps(data)
}
