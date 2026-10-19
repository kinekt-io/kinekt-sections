// @generated structural section — source manifest remains the contract.
import type { Block, CollectionSlug } from 'payload'
import { createManifestBlock, manifestToProps } from '../../../shared/manifest-block.js'
import type { BetaSolutionListAllentownContent, PayloadBetaSolutionListAllentownDocument } from './solution-list-allentown.types.js'

const manifest = {
  "slug": "solution-list-allentown",
  "title": "Solution List Allentown",
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
    "items": {
      "kind": "componentList",
      "componentId": "components/solution-item/allentown",
      "required": true,
      "localized": true,
      "minItems": 2
    },
    "callout": {
      "kind": "component",
      "componentId": "components/callout/allentown",
      "required": false,
      "localized": true
    }
  }
} as const

export interface CreateBetaSolutionListAllentownBlockOptions { mediaCollection?: CollectionSlug; formCollection?: CollectionSlug }

export function createBetaSolutionListAllentownBlock(options: CreateBetaSolutionListAllentownBlockOptions = {}): Block {
  return createManifestBlock(manifest, options)
}

export function betaSolutionListAllentownToProps(data: PayloadBetaSolutionListAllentownDocument): BetaSolutionListAllentownContent {
  return manifestToProps(data)
}
