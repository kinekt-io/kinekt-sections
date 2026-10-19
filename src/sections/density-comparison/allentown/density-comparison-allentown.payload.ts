// @generated structural section — source manifest remains the contract.
import type { Block, CollectionSlug } from 'payload'
import { createManifestBlock, manifestToProps } from '../../../shared/manifest-block.js'
import type { BetaDensityComparisonAllentownContent, PayloadBetaDensityComparisonAllentownDocument } from './density-comparison-allentown.types.js'

const manifest = {
  "slug": "density-comparison-allentown",
  "title": "Density Comparison Allentown",
  "status": "planned",
  "fields": {
    "theme": {
      "kind": "select",
      "required": true,
      "localized": false,
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
      "localized": true
    },
    "comparison": {
      "kind": "component",
      "componentId": "patterns/comparison-table/trinity",
      "required": true,
      "localized": true
    },
    "cta": {
      "kind": "component",
      "componentId": "controls/button/allentown",
      "required": false,
      "localized": true
    }
  }
} as const

export interface CreateBetaDensityComparisonAllentownBlockOptions { mediaCollection?: CollectionSlug; formCollection?: CollectionSlug }

export function createBetaDensityComparisonAllentownBlock(options: CreateBetaDensityComparisonAllentownBlockOptions = {}): Block {
  return createManifestBlock(manifest, options)
}

export function betaDensityComparisonAllentownToProps(data: PayloadBetaDensityComparisonAllentownDocument): BetaDensityComparisonAllentownContent {
  return manifestToProps(data)
}
