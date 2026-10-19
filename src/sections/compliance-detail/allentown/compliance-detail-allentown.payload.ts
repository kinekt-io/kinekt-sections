// @generated structural section — source manifest remains the contract.
import type { Block, CollectionSlug } from 'payload'
import { createManifestBlock, manifestToProps } from '../../../shared/manifest-block.js'
import type { BetaComplianceDetailAllentownContent, PayloadBetaComplianceDetailAllentownDocument } from './compliance-detail-allentown.types.js'

const manifest = {
  "slug": "compliance-detail-allentown",
  "title": "Compliance Detail Allentown",
  "fields": {
    "theme": {
      "kind": "select",
      "required": true,
      "localized": false,
      "options": [
        "light",
        "dark"
      ],
      "description": "CMS-selected presentation setting passed to the renderer."
    },
    "intro": {
      "kind": "component",
      "componentId": "components/intro/allentown",
      "required": true,
      "localized": true,
      "description": "The localized accent heading maps from the former section title; description remains optional."
    },
    "checklistItems": {
      "kind": "componentList",
      "componentId": "components/checklist-item/allentown",
      "minItems": 1,
      "required": true,
      "localized": true
    },
    "ctaGroup": {
      "kind": "component",
      "componentId": "components/cta-group/allentown",
      "required": true,
      "localized": true
    },
    "certImage": {
      "kind": "media",
      "required": true,
      "localized": true,
      "description": "The certification collage image for this in-page content section."
    },
    "media": {
      "kind": "media",
      "required": false,
      "localized": true,
      "description": "Optional supplementary main media; independent of certImage."
    }
  }
} as const

export interface CreateBetaComplianceDetailAllentownBlockOptions { mediaCollection?: CollectionSlug; formCollection?: CollectionSlug }

export function createBetaComplianceDetailAllentownBlock(options: CreateBetaComplianceDetailAllentownBlockOptions = {}): Block {
  return createManifestBlock(manifest, options)
}

export function betaComplianceDetailAllentownToProps(data: PayloadBetaComplianceDetailAllentownDocument): BetaComplianceDetailAllentownContent {
  return manifestToProps(data)
}
