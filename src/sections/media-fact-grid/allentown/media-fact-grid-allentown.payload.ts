// @generated structural section — source manifest remains the contract.
import type { Block, CollectionSlug } from 'payload'
import { createManifestBlock, manifestToProps } from '../../../shared/manifest-block.js'
import type { BetaMediaFactGridAllentownContent, PayloadBetaMediaFactGridAllentownDocument } from './media-fact-grid-allentown.types.js'

const manifest = {
  "slug": "media-fact-grid-allentown",
  "title": "Media Fact Grid Allentown",
  "status": "prerelease",
  "fields": {
    "contentWidth": {
      "kind": "select",
      "required": false,
      "localized": true,
      "defaultValue": "standard",
      "options": [
        "standard",
        "80",
        "70"
      ],
      "description": "Maximum content width: Standard (100%), 80%, or 70%."
    },
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
    "media": {
      "kind": "media",
      "required": false,
      "localized": true
    },
    "facts": {
      "kind": "componentList",
      "componentId": "components/fact-card/allentown",
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
        },
        "value": {
          "kind": "text",
          "required": true,
          "localized": true
        }
      }
    }
  }
} as const

export interface CreateBetaMediaFactGridAllentownBlockOptions { mediaCollection?: CollectionSlug; formCollection?: CollectionSlug; targetCollections?: CollectionSlug[] }

export function createBetaMediaFactGridAllentownBlock(options: CreateBetaMediaFactGridAllentownBlockOptions = {}): Block {
  return createManifestBlock(manifest, options)
}

export function betaMediaFactGridAllentownToProps(data: PayloadBetaMediaFactGridAllentownDocument): BetaMediaFactGridAllentownContent {
  return manifestToProps(data)
}
