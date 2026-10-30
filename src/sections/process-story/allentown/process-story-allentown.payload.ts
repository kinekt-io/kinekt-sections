// @generated structural section — source manifest remains the contract.
import type { Block, CollectionSlug } from 'payload'
import { createManifestBlock, manifestToProps } from '../../../shared/manifest-block.js'
import type { BetaProcessStoryAllentownContent, PayloadBetaProcessStoryAllentownDocument } from './process-story-allentown.types.js'

const manifest = {
  "slug": "process-story-allentown",
  "title": "Process Story Allentown",
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
    "image": {
      "kind": "media",
      "required": false,
      "localized": true
    },
    "items": {
      "kind": "componentList",
      "componentId": "components/process-item/allentown",
      "required": true,
      "localized": true,
      "minItems": 1,
      "fields": {
        "label": {
          "kind": "text",
          "required": true,
          "localized": true
        },
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

export interface CreateBetaProcessStoryAllentownBlockOptions { mediaCollection?: CollectionSlug; formCollection?: CollectionSlug; targetCollections?: CollectionSlug[] }

export function createBetaProcessStoryAllentownBlock(options: CreateBetaProcessStoryAllentownBlockOptions = {}): Block {
  return createManifestBlock(manifest, options)
}

export function betaProcessStoryAllentownToProps(data: PayloadBetaProcessStoryAllentownDocument): BetaProcessStoryAllentownContent {
  return manifestToProps(data)
}
