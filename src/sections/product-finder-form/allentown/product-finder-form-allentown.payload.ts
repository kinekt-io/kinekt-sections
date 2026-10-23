// @generated structural section — source manifest remains the contract.
import type { Block, CollectionSlug } from 'payload'
import { createManifestBlock, manifestToProps } from '../../../shared/manifest-block.js'
import type { BetaProductFinderFormAllentownContent, PayloadBetaProductFinderFormAllentownDocument } from './product-finder-form-allentown.types.js'

const manifest = {
  "slug": "product-finder-form-allentown",
  "title": "Product Finder Form Allentown",
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
    "form": {
      "kind": "formReference",
      "required": true,
      "localized": true,
      "description": "The platform-managed localized Form record owns questions, choices, validation, submission and success behavior."
    }
  }
} as const

export interface CreateBetaProductFinderFormAllentownBlockOptions { mediaCollection?: CollectionSlug; formCollection?: CollectionSlug; targetCollections?: CollectionSlug[] }

export function createBetaProductFinderFormAllentownBlock(options: CreateBetaProductFinderFormAllentownBlockOptions = {}): Block {
  return createManifestBlock(manifest, options)
}

export function betaProductFinderFormAllentownToProps(data: PayloadBetaProductFinderFormAllentownDocument): BetaProductFinderFormAllentownContent {
  return manifestToProps(data)
}
