// @generated structural section — source manifest remains the contract.
import type { Block, CollectionSlug } from 'payload'
import { createManifestBlock, manifestToProps } from '../../../shared/manifest-block.js'
import type { BetaNotFoundHeroAllentownContent, PayloadBetaNotFoundHeroAllentownDocument } from './not-found-hero-allentown.types.js'

const manifest = {
  "slug": "not-found-hero-allentown",
  "title": "Not Found Hero Allentown",
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
    "ctaGroup": {
      "kind": "component",
      "componentId": "components/cta-group/allentown",
      "required": true,
      "localized": true
    }
  }
} as const

export interface CreateBetaNotFoundHeroAllentownBlockOptions { mediaCollection?: CollectionSlug; formCollection?: CollectionSlug }

export function createBetaNotFoundHeroAllentownBlock(options: CreateBetaNotFoundHeroAllentownBlockOptions = {}): Block {
  return createManifestBlock(manifest, options)
}

export function betaNotFoundHeroAllentownToProps(data: PayloadBetaNotFoundHeroAllentownDocument): BetaNotFoundHeroAllentownContent {
  return manifestToProps(data)
}
