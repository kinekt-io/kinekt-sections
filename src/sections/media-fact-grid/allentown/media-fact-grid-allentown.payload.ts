// @generated structural section — source manifest remains the contract.
import type { Block, CollectionSlug } from 'payload'
import { createManifestBlock, manifestToProps } from '../../../shared/manifest-block.js'
import type { BetaMediaFactGridAllentownContent, PayloadBetaMediaFactGridAllentownDocument } from './media-fact-grid-allentown.types.js'

const manifest = {
  "slug": "media-fact-grid-allentown",
  "title": "Media Fact Grid Allentown",
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
    "media": {
      "kind": "media",
      "required": false,
      "localized": true
    },
    "facts": {
      "kind": "componentList",
      "componentId": "components/fact-card/allentown",
      "required": true,
      "localized": true,
      "minItems": 1
    }
  }
} as const

export interface CreateBetaMediaFactGridAllentownBlockOptions { mediaCollection?: CollectionSlug; formCollection?: CollectionSlug }

export function createBetaMediaFactGridAllentownBlock(options: CreateBetaMediaFactGridAllentownBlockOptions = {}): Block {
  return createManifestBlock(manifest, options)
}

export function betaMediaFactGridAllentownToProps(data: PayloadBetaMediaFactGridAllentownDocument): BetaMediaFactGridAllentownContent {
  return manifestToProps(data)
}
