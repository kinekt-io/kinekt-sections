// @generated structural section — source manifest remains the contract.
import type { Block, CollectionSlug } from 'payload'
import { createManifestBlock, manifestToProps } from '../../../shared/manifest-block.js'
import type { BetaFeaturedInsightsAllentownContent, PayloadBetaFeaturedInsightsAllentownDocument } from './featured-insights-allentown.types.js'

const manifest = {
  "slug": "featured-insights-allentown",
  "title": "Featured Insights Allentown",
  "status": "beta",
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
    "insightSources": {
      "kind": "insightSourceList",
      "required": true,
      "localized": true,
      "minItems": 1,
      "description": "Multiple active platform-admin Insight Sources. Each source maps a collection or collection filter, such as Articles: Case or Certifications."
    },
    "cta": {
      "kind": "component",
      "componentId": "controls/button/allentown",
      "required": false,
      "localized": true
    }
  }
} as const

export interface CreateBetaFeaturedInsightsAllentownBlockOptions { mediaCollection?: CollectionSlug; formCollection?: CollectionSlug }

export function createBetaFeaturedInsightsAllentownBlock(options: CreateBetaFeaturedInsightsAllentownBlockOptions = {}): Block {
  return createManifestBlock(manifest, options)
}

export function betaFeaturedInsightsAllentownToProps(data: PayloadBetaFeaturedInsightsAllentownDocument): BetaFeaturedInsightsAllentownContent {
  return manifestToProps(data)
}
