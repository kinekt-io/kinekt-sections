import type { Block, CollectionSlug } from 'payload'
import { createManifestBlock } from '../../../shared/manifest-block.js'
import { structuralSectionToProps } from '../../../shared/structural-props.js'
import type { PayloadAdapterOptions } from '../../../shared/payload.js'
import type { BetaFeaturedInsightsAllentownContent, PayloadBetaFeaturedInsightsAllentownDocument } from './featured-insights-allentown.types.js'

const manifest = {
  "slug": "featured-insights-allentown",
  "title": "Featured Insights Allentown",
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
      "localized": true,
      "fields": {
        "cta": {
          "kind": "cta",
          "required": true,
          "localized": true
        }
      }
    }
  }
} as const

export interface CreateBetaFeaturedInsightsAllentownBlockOptions { mediaCollection?: CollectionSlug; formCollection?: CollectionSlug; targetCollections?: CollectionSlug[] }

export function createBetaFeaturedInsightsAllentownBlock(options: CreateBetaFeaturedInsightsAllentownBlockOptions = {}): Block {
  return createManifestBlock(manifest, options)
}

export function betaFeaturedInsightsAllentownToProps(data: PayloadBetaFeaturedInsightsAllentownDocument, options: PayloadAdapterOptions = {}): BetaFeaturedInsightsAllentownContent {
  return structuralSectionToProps(data, options)
}
