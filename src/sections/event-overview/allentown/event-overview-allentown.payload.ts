// @generated structural section — source manifest remains the contract.
import type { Block, CollectionSlug } from 'payload'
import { createManifestBlock, manifestToProps } from '../../../shared/manifest-block.js'
import type { BetaEventOverviewAllentownContent, PayloadBetaEventOverviewAllentownDocument } from './event-overview-allentown.types.js'

const manifest = {
  "slug": "event-overview-allentown",
  "title": "Event Overview Allentown",
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
    }
  }
} as const

export interface CreateBetaEventOverviewAllentownBlockOptions { mediaCollection?: CollectionSlug; formCollection?: CollectionSlug; targetCollections?: CollectionSlug[] }

export function createBetaEventOverviewAllentownBlock(options: CreateBetaEventOverviewAllentownBlockOptions = {}): Block {
  return createManifestBlock(manifest, options)
}

export function betaEventOverviewAllentownToProps(data: PayloadBetaEventOverviewAllentownDocument): BetaEventOverviewAllentownContent {
  return manifestToProps(data)
}
