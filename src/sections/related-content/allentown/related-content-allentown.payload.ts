// @generated structural section — source manifest remains the contract.
import type { Block, CollectionSlug } from 'payload'
import { createManifestBlock, manifestToProps } from '../../../shared/manifest-block.js'
import type { BetaRelatedContentAllentownContent, PayloadBetaRelatedContentAllentownDocument } from './related-content-allentown.types.js'

const manifest = {
  "slug": "related-content-allentown",
  "title": "Related Content Allentown",
  "status": "planned",
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
    "contentSources": {
      "kind": "contentReferenceList",
      "required": true,
      "localized": true,
      "minItems": 1,
      "description": "Explicitly select published related content. Each card derives its content type, title, card excerpt, hero image or video poster, and route from the selected document."
    },
    "cta": {
      "kind": "component",
      "componentId": "controls/button/allentown",
      "required": false,
      "localized": true,
      "description": "Optional Content-or-URL overview action.",
      "fields": {
        "cta": {
          "kind": "cta",
          "required": true,
          "localized": true
        }
      }
    }
  }
} as const

export interface CreateBetaRelatedContentAllentownBlockOptions { mediaCollection?: CollectionSlug; formCollection?: CollectionSlug; targetCollections?: CollectionSlug[] }

export function createBetaRelatedContentAllentownBlock(options: CreateBetaRelatedContentAllentownBlockOptions = {}): Block {
  return createManifestBlock(manifest, options)
}

export function betaRelatedContentAllentownToProps(data: PayloadBetaRelatedContentAllentownDocument): BetaRelatedContentAllentownContent {
  return manifestToProps(data)
}
