// @generated structural section — source manifest remains the contract.
import type { Block, CollectionSlug } from 'payload'
import { createManifestBlock, manifestToProps } from '../../../shared/manifest-block.js'
import type { BetaComplianceTextAllentownContent, PayloadBetaComplianceTextAllentownDocument } from './compliance-text-allentown.types.js'

const manifest = {
  "slug": "compliance-text-allentown",
  "title": "Compliance Text Allentown",
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
    "checklistItems": {
      "kind": "componentList",
      "componentId": "components/checklist-item/allentown",
      "minItems": 1,
      "required": true,
      "localized": true,
      "fields": {
        "text": {
          "kind": "text",
          "required": true,
          "localized": true
        }
      }
    },
    "closingText": {
      "kind": "richText",
      "required": true,
      "localized": true
    },
    "certImage": {
      "kind": "media",
      "required": true,
      "localized": true,
      "description": "The certification collage image for this in-page content section."
    }
  }
} as const

export interface CreateBetaComplianceTextAllentownBlockOptions { mediaCollection?: CollectionSlug; formCollection?: CollectionSlug; targetCollections?: CollectionSlug[] }

export function createBetaComplianceTextAllentownBlock(options: CreateBetaComplianceTextAllentownBlockOptions = {}): Block {
  return createManifestBlock(manifest, options)
}

export function betaComplianceTextAllentownToProps(data: PayloadBetaComplianceTextAllentownDocument): BetaComplianceTextAllentownContent {
  return manifestToProps(data)
}
