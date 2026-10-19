// @generated structural section — source manifest remains the contract.
import type { Block, CollectionSlug } from 'payload'
import { createManifestBlock, manifestToProps } from '../../../shared/manifest-block.js'
import type { BetaComplianceTextAllentownContent, PayloadBetaComplianceTextAllentownDocument } from './compliance-text-allentown.types.js'

const manifest = {
  "slug": "compliance-text-allentown",
  "title": "Compliance Text Allentown",
  "status": "planned",
  "fields": {
    "theme": {
      "kind": "select",
      "required": true,
      "localized": false,
      "options": [
        "light",
        "semi-light",
        "dark",
        "semi-dark"
      ],
      "description": "CMS-selected presentation setting passed to the renderer."
    },
    "intro": {
      "kind": "component",
      "componentId": "components/intro/allentown",
      "required": true,
      "localized": true
    },
    "checklistItems": {
      "kind": "componentList",
      "componentId": "components/checklist-item/allentown",
      "minItems": 1,
      "required": true,
      "localized": true
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

export interface CreateBetaComplianceTextAllentownBlockOptions { mediaCollection?: CollectionSlug; formCollection?: CollectionSlug }

export function createBetaComplianceTextAllentownBlock(options: CreateBetaComplianceTextAllentownBlockOptions = {}): Block {
  return createManifestBlock(manifest, options)
}

export function betaComplianceTextAllentownToProps(data: PayloadBetaComplianceTextAllentownDocument): BetaComplianceTextAllentownContent {
  return manifestToProps(data)
}
