// @generated structural section — source manifest remains the contract.
import type { Block, CollectionSlug } from 'payload'
import { createManifestBlock, manifestToProps } from '../../../shared/manifest-block.js'
import type { BetaTabsAllentownContent, PayloadBetaTabsAllentownDocument } from './tabs-allentown.types.js'

const manifest = {
  "slug": "tabs-allentown",
  "title": "Tabs Allentown",
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
    "tabs": {
      "kind": "componentList",
      "componentId": "components/tab-item/allentown",
      "required": true,
      "localized": true,
      "minItems": 1
    }
  }
} as const

export interface CreateBetaTabsAllentownBlockOptions { mediaCollection?: CollectionSlug; formCollection?: CollectionSlug }

export function createBetaTabsAllentownBlock(options: CreateBetaTabsAllentownBlockOptions = {}): Block {
  return createManifestBlock(manifest, options)
}

export function betaTabsAllentownToProps(data: PayloadBetaTabsAllentownDocument): BetaTabsAllentownContent {
  return manifestToProps(data)
}
