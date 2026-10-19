// @generated structural section — source manifest remains the contract.
import type { Block, CollectionSlug } from 'payload'
import { createManifestBlock, manifestToProps } from '../../../shared/manifest-block.js'
import type { BetaComplianceOverviewAllentownContent, PayloadBetaComplianceOverviewAllentownDocument } from './compliance-overview-allentown.types.js'

const manifest = {
  "slug": "compliance-overview-allentown",
  "title": "Compliance Overview Allentown",
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
      "localized": true
    },
    "checklistTitle": {
      "kind": "text",
      "required": false,
      "localized": true
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
    }
  }
} as const

export interface CreateBetaComplianceOverviewAllentownBlockOptions { mediaCollection?: CollectionSlug; formCollection?: CollectionSlug }

export function createBetaComplianceOverviewAllentownBlock(options: CreateBetaComplianceOverviewAllentownBlockOptions = {}): Block {
  return createManifestBlock(manifest, options)
}

export function betaComplianceOverviewAllentownToProps(data: PayloadBetaComplianceOverviewAllentownDocument): BetaComplianceOverviewAllentownContent {
  return manifestToProps(data)
}
