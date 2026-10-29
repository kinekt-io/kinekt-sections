// @generated structural section — source manifest remains the contract.
import type { Block, CollectionSlug } from 'payload'
import { createManifestBlock, manifestToProps } from '../../../shared/manifest-block.js'
import type { BetaComplianceOverviewAllentownContent, PayloadBetaComplianceOverviewAllentownDocument } from './compliance-overview-allentown.types.js'

const manifest = {
  "slug": "compliance-overview-allentown",
  "title": "Compliance Overview Allentown",
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
      "localized": true,
      "fields": {
        "text": {
          "kind": "text",
          "required": true,
          "localized": true
        }
      }
    },
    "ctaGroup": {
      "kind": "component",
      "componentId": "components/cta-group/allentown",
      "required": true,
      "localized": true,
      "fields": {
        "primaryButton": {
          "kind": "cta",
          "required": false,
          "localized": true,
          "description": "Optional primary Button component part."
        },
        "secondaryButton": {
          "kind": "cta",
          "required": false,
          "localized": true,
          "description": "Optional secondary Button component part."
        }
      }
    }
  }
} as const

export interface CreateBetaComplianceOverviewAllentownBlockOptions { mediaCollection?: CollectionSlug; formCollection?: CollectionSlug; targetCollections?: CollectionSlug[] }

export function createBetaComplianceOverviewAllentownBlock(options: CreateBetaComplianceOverviewAllentownBlockOptions = {}): Block {
  return createManifestBlock(manifest, options)
}

export function betaComplianceOverviewAllentownToProps(data: PayloadBetaComplianceOverviewAllentownDocument): BetaComplianceOverviewAllentownContent {
  return manifestToProps(data)
}
