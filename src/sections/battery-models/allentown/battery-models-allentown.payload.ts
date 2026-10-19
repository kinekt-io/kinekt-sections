// @generated structural section — source manifest remains the contract.
import type { Block, CollectionSlug } from 'payload'
import { createManifestBlock, manifestToProps } from '../../../shared/manifest-block.js'
import type { BetaBatteryModelsAllentownContent, PayloadBetaBatteryModelsAllentownDocument } from './battery-models-allentown.types.js'

const manifest = {
  "slug": "battery-models-allentown",
  "title": "Battery Models Allentown",
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
    "models": {
      "kind": "componentList",
      "componentId": "components/battery-card/allentown",
      "required": true,
      "localized": true,
      "minItems": 1
    },
    "crossSell": {
      "kind": "component",
      "componentId": "patterns/cross-sell/allentown",
      "required": false,
      "localized": true
    }
  }
} as const

export interface CreateBetaBatteryModelsAllentownBlockOptions { mediaCollection?: CollectionSlug; formCollection?: CollectionSlug }

export function createBetaBatteryModelsAllentownBlock(options: CreateBetaBatteryModelsAllentownBlockOptions = {}): Block {
  return createManifestBlock(manifest, options)
}

export function betaBatteryModelsAllentownToProps(data: PayloadBetaBatteryModelsAllentownDocument): BetaBatteryModelsAllentownContent {
  return manifestToProps(data)
}
