// @generated structural section — source manifest remains the contract.
import type { Block, CollectionSlug } from 'payload'
import { createManifestBlock, manifestToProps } from '../../../shared/manifest-block.js'
import type { BetaFacilitiesOverviewAllentownContent, PayloadBetaFacilitiesOverviewAllentownDocument } from './facilities-overview-allentown.types.js'

const manifest = {
  "slug": "facilities-overview-allentown",
  "title": "Facilities Overview Allentown",
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
    "label": {
      "kind": "component",
      "componentId": "atoms/label/allentown",
      "required": false,
      "localized": true,
      "fields": {
        "text": {
          "kind": "text",
          "required": true,
          "localized": true
        },
        "icon": {
          "kind": "text",
          "required": false,
          "localized": true,
          "description": "Optional Font Awesome 7 Sharp Solid icon name rendered before the label text."
        }
      }
    },
    "facts": {
      "kind": "componentList",
      "componentId": "components/facility-fact/allentown",
      "minItems": 1,
      "required": true,
      "localized": true,
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
        }
      }
    },
    "media": {
      "kind": "media",
      "required": false,
      "localized": true
    }
  }
} as const

export interface CreateBetaFacilitiesOverviewAllentownBlockOptions { mediaCollection?: CollectionSlug; formCollection?: CollectionSlug; targetCollections?: CollectionSlug[] }

export function createBetaFacilitiesOverviewAllentownBlock(options: CreateBetaFacilitiesOverviewAllentownBlockOptions = {}): Block {
  return createManifestBlock(manifest, options)
}

export function betaFacilitiesOverviewAllentownToProps(data: PayloadBetaFacilitiesOverviewAllentownDocument): BetaFacilitiesOverviewAllentownContent {
  return manifestToProps(data)
}
