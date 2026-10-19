// @generated structural section — source manifest remains the contract.
import type { Block, CollectionSlug } from 'payload'
import { createManifestBlock, manifestToProps } from '../../../shared/manifest-block.js'
import type { BetaComparisonOverviewAllentownContent, PayloadBetaComparisonOverviewAllentownDocument } from './comparison-overview-allentown.types.js'

const manifest = {
  "slug": "comparison-overview-allentown",
  "title": "Comparison Overview Allentown",
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
    "introCta": {
      "kind": "component",
      "componentId": "controls/button/allentown",
      "required": false,
      "localized": true
    },
    "comparison": {
      "kind": "component",
      "componentId": "patterns/comparison-table/allentown",
      "required": true,
      "localized": true
    },
    "callout": {
      "kind": "component",
      "componentId": "components/callout/allentown",
      "required": true,
      "localized": true
    }
  }
} as const

export interface CreateBetaComparisonOverviewAllentownBlockOptions { mediaCollection?: CollectionSlug; formCollection?: CollectionSlug }

export function createBetaComparisonOverviewAllentownBlock(options: CreateBetaComparisonOverviewAllentownBlockOptions = {}): Block {
  return createManifestBlock(manifest, options)
}

export function betaComparisonOverviewAllentownToProps(data: PayloadBetaComparisonOverviewAllentownDocument): BetaComparisonOverviewAllentownContent {
  return manifestToProps(data)
}
