// @generated structural section — source manifest remains the contract.
import type { Block, CollectionSlug } from 'payload'
import { createManifestBlock, manifestToProps } from '../../../shared/manifest-block.js'
import type { BetaChecklistFeatureListAllentownContent, PayloadBetaChecklistFeatureListAllentownDocument } from './checklist-feature-list-allentown.types.js'

const manifest = {
  "slug": "checklist-feature-list-allentown",
  "title": "Checklist Feature List Allentown",
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
    "features": {
      "kind": "componentList",
      "componentId": "components/feature-item/allentown",
      "required": true,
      "localized": true,
      "minItems": 1,
      "fields": {
        "title": {
          "kind": "text",
          "required": true,
          "localized": true
        },
        "description": {
          "kind": "richText",
          "required": true,
          "localized": true
        }
      }
    }
  }
} as const

export interface CreateBetaChecklistFeatureListAllentownBlockOptions { mediaCollection?: CollectionSlug; formCollection?: CollectionSlug; targetCollections?: CollectionSlug[] }

export function createBetaChecklistFeatureListAllentownBlock(options: CreateBetaChecklistFeatureListAllentownBlockOptions = {}): Block {
  return createManifestBlock(manifest, options)
}

export function betaChecklistFeatureListAllentownToProps(data: PayloadBetaChecklistFeatureListAllentownDocument): BetaChecklistFeatureListAllentownContent {
  return manifestToProps(data)
}
