// @generated structural section — source manifest remains the contract.
import type { Block, CollectionSlug } from 'payload'
import { createManifestBlock, manifestToProps } from '../../../shared/manifest-block.js'
import type { BetaFeaturedEventAllentownContent, PayloadBetaFeaturedEventAllentownDocument } from './featured-event-allentown.types.js'

const manifest = {
  "slug": "featured-event-allentown",
  "title": "Featured Event Allentown",
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
    "contentType": {
      "kind": "contentType",
      "required": true,
      "localized": true,
      "defaultValue": "events",
      "options": [
        "events"
      ],
      "description": "Choose the Event content type that supplies this section."
    }
  }
} as const

export interface CreateBetaFeaturedEventAllentownBlockOptions { mediaCollection?: CollectionSlug; formCollection?: CollectionSlug; faqCollection?: CollectionSlug; targetCollections?: CollectionSlug[]; contentTypeOptions?: ReadonlyArray<{ label: string; value: CollectionSlug }> }

export function createBetaFeaturedEventAllentownBlock(options: CreateBetaFeaturedEventAllentownBlockOptions = {}): Block {
  return createManifestBlock(manifest, options)
}

export function betaFeaturedEventAllentownToProps(data: PayloadBetaFeaturedEventAllentownDocument): BetaFeaturedEventAllentownContent {
  return manifestToProps(data)
}
