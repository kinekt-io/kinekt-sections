// @generated structural section — source manifest remains the contract.
import type { Block, CollectionSlug } from 'payload'
import { createManifestBlock, manifestToProps } from '../../../shared/manifest-block.js'
import type { BetaThankYouHeroAllentownContent, PayloadBetaThankYouHeroAllentownDocument } from './thank-you-hero-allentown.types.js'

const manifest = {
  "slug": "thank-you-hero-allentown",
  "title": "Thank You Hero Allentown",
  "status": "planned",
  "fields": {
    "theme": {
      "kind": "select",
      "required": true,
      "localized": false,
      "options": [
        "light",
        "semi-light",
        "dark",
        "semi-dark"
      ],
      "description": "CMS-selected presentation setting passed to the renderer."
    },
    "intro": {
      "kind": "component",
      "componentId": "components/intro/allentown",
      "required": true,
      "localized": true
    },
    "media": {
      "kind": "media",
      "required": false,
      "localized": true
    },
    "nextStepsHeading": {
      "kind": "text",
      "required": true,
      "localized": true
    },
    "nextSteps": {
      "kind": "componentList",
      "componentId": "components/next-step/allentown",
      "required": true,
      "localized": true,
      "minItems": 1
    }
  }
} as const

export interface CreateBetaThankYouHeroAllentownBlockOptions { mediaCollection?: CollectionSlug; formCollection?: CollectionSlug }

export function createBetaThankYouHeroAllentownBlock(options: CreateBetaThankYouHeroAllentownBlockOptions = {}): Block {
  return createManifestBlock(manifest, options)
}

export function betaThankYouHeroAllentownToProps(data: PayloadBetaThankYouHeroAllentownDocument): BetaThankYouHeroAllentownContent {
  return manifestToProps(data)
}
