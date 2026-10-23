// @generated structural section — source manifest remains the contract.
import type { Block, CollectionSlug } from 'payload'
import { createManifestBlock, manifestToProps } from '../../../shared/manifest-block.js'
import type { BetaInsightIndexAllentownContent, PayloadBetaInsightIndexAllentownDocument } from './insight-index-allentown.types.js'

const manifest = {
  "slug": "insight-index-allentown",
  "title": "Insight Index Allentown",
  "status": "beta",
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
    "insightSources": {
      "kind": "insightSourceList",
      "required": true,
      "localized": true,
      "minItems": 1,
      "description": "One or more active platform-managed Insight Sources to index."
    }
  }
} as const

export interface CreateBetaInsightIndexAllentownBlockOptions { mediaCollection?: CollectionSlug; formCollection?: CollectionSlug; targetCollections?: CollectionSlug[] }

export function createBetaInsightIndexAllentownBlock(options: CreateBetaInsightIndexAllentownBlockOptions = {}): Block {
  return createManifestBlock(manifest, options)
}

export function betaInsightIndexAllentownToProps(data: PayloadBetaInsightIndexAllentownDocument): BetaInsightIndexAllentownContent {
  return manifestToProps(data)
}
