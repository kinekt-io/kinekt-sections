// @generated structural section — source manifest remains the contract.
import type { Block, CollectionSlug } from 'payload'
import { createManifestBlock, manifestToProps } from '../../../shared/manifest-block.js'
import type { BetaFacilitiesOverviewAllentownContent, PayloadBetaFacilitiesOverviewAllentownDocument } from './facilities-overview-allentown.types.js'

const manifest = {
  "slug": "facilities-overview-allentown",
  "title": "Facilities Overview Allentown",
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
    "label": {
      "kind": "component",
      "componentId": "atoms/label/allentown",
      "required": false,
      "localized": true
    },
    "facts": {
      "kind": "componentList",
      "componentId": "components/facility-fact/allentown",
      "minItems": 1,
      "required": true,
      "localized": true
    },
    "media": {
      "kind": "media",
      "required": false,
      "localized": true
    }
  }
} as const

export interface CreateBetaFacilitiesOverviewAllentownBlockOptions { mediaCollection?: CollectionSlug; formCollection?: CollectionSlug }

export function createBetaFacilitiesOverviewAllentownBlock(options: CreateBetaFacilitiesOverviewAllentownBlockOptions = {}): Block {
  return createManifestBlock(manifest, options)
}

export function betaFacilitiesOverviewAllentownToProps(data: PayloadBetaFacilitiesOverviewAllentownDocument): BetaFacilitiesOverviewAllentownContent {
  return manifestToProps(data)
}
