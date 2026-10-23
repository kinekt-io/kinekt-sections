// @generated structural section — source manifest remains the contract.
import type { Block, CollectionSlug } from 'payload'
import { createManifestBlock, manifestToProps } from '../../../shared/manifest-block.js'
import type { BetaFeaturedEventAllentownContent, PayloadBetaFeaturedEventAllentownDocument } from './featured-event-allentown.types.js'

const manifest = {
  "slug": "featured-event-allentown",
  "title": "Featured Event Allentown",
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
    }
  }
} as const

export interface CreateBetaFeaturedEventAllentownBlockOptions { mediaCollection?: CollectionSlug; formCollection?: CollectionSlug; targetCollections?: CollectionSlug[] }

export function createBetaFeaturedEventAllentownBlock(options: CreateBetaFeaturedEventAllentownBlockOptions = {}): Block {
  return createManifestBlock(manifest, options)
}

export function betaFeaturedEventAllentownToProps(data: PayloadBetaFeaturedEventAllentownDocument): BetaFeaturedEventAllentownContent {
  return manifestToProps(data)
}
