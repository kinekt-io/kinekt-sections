// @generated structural section — source manifest remains the contract.
import type { Block, CollectionSlug } from 'payload'
import { createManifestBlock, manifestToProps } from '../../../shared/manifest-block.js'
import type { BetaFaqIndexAllentownContent, PayloadBetaFaqIndexAllentownDocument } from './faq-index-allentown.types.js'

const manifest = {
  "slug": "faq-index-allentown",
  "title": "FAQ Index Allentown",
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
    "callout": {
      "kind": "component",
      "componentId": "components/callout/allentown",
      "required": false,
      "localized": true
    }
  }
} as const

export interface CreateBetaFaqIndexAllentownBlockOptions { mediaCollection?: CollectionSlug; formCollection?: CollectionSlug }

export function createBetaFaqIndexAllentownBlock(options: CreateBetaFaqIndexAllentownBlockOptions = {}): Block {
  return createManifestBlock(manifest, options)
}

export function betaFaqIndexAllentownToProps(data: PayloadBetaFaqIndexAllentownDocument): BetaFaqIndexAllentownContent {
  return manifestToProps(data)
}
