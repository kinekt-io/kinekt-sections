// @generated structural section — source manifest remains the contract.
import type { Block, CollectionSlug } from 'payload'
import { createManifestBlock, manifestToProps } from '../../../shared/manifest-block.js'
import type { BetaFeaturedPageHeaderAllentownContent, PayloadBetaFeaturedPageHeaderAllentownDocument } from './featured-page-header-allentown.types.js'

const manifest = {
  "slug": "featured-page-header-allentown",
  "title": "Featured Page Header Allentown",
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
      "description": "Use the optional Intro description only in a renderer variation that supports it.",
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
      "description": "One or more active platform-managed Insight Sources."
    }
  }
} as const

export interface CreateBetaFeaturedPageHeaderAllentownBlockOptions { mediaCollection?: CollectionSlug; formCollection?: CollectionSlug; targetCollections?: CollectionSlug[] }

export function createBetaFeaturedPageHeaderAllentownBlock(options: CreateBetaFeaturedPageHeaderAllentownBlockOptions = {}): Block {
  return createManifestBlock(manifest, options)
}

export function betaFeaturedPageHeaderAllentownToProps(data: PayloadBetaFeaturedPageHeaderAllentownDocument): BetaFeaturedPageHeaderAllentownContent {
  return manifestToProps(data)
}
