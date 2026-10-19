// @generated structural section — source manifest remains the contract.
import type { Block, CollectionSlug } from 'payload'
import { createManifestBlock, manifestToProps } from '../../../shared/manifest-block.js'
import type { BetaEventOverviewAllentownContent, PayloadBetaEventOverviewAllentownDocument } from './event-overview-allentown.types.js'

const manifest = {
  "slug": "event-overview-allentown",
  "title": "Event Overview Allentown",
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
    }
  }
} as const

export interface CreateBetaEventOverviewAllentownBlockOptions { mediaCollection?: CollectionSlug; formCollection?: CollectionSlug }

export function createBetaEventOverviewAllentownBlock(options: CreateBetaEventOverviewAllentownBlockOptions = {}): Block {
  return createManifestBlock(manifest, options)
}

export function betaEventOverviewAllentownToProps(data: PayloadBetaEventOverviewAllentownDocument): BetaEventOverviewAllentownContent {
  return manifestToProps(data)
}
