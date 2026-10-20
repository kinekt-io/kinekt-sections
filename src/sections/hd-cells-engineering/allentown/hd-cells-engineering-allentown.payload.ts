// @generated structural section — source manifest remains the contract.
import type { Block, CollectionSlug } from 'payload'
import { createManifestBlock, manifestToProps } from '../../../shared/manifest-block.js'
import type { BetaHdCellsEngineeringAllentownContent, PayloadBetaHdCellsEngineeringAllentownDocument } from './hd-cells-engineering-allentown.types.js'

const manifest = {
  "slug": "hd-cells-engineering-allentown",
  "title": "HD Cells Engineering Allentown",
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
    "cellsIntro": {
      "kind": "component",
      "componentId": "components/intro/allentown",
      "required": true,
      "localized": true
    },
    "cellItems": {
      "kind": "componentList",
      "componentId": "components/hd-cell-item/allentown",
      "minItems": 1,
      "required": true,
      "localized": true
    },
    "engineeringIntro": {
      "kind": "component",
      "componentId": "components/intro/allentown",
      "required": true,
      "localized": true
    },
    "engineeringTopics": {
      "kind": "componentList",
      "componentId": "components/hd-engineering-topic/allentown",
      "minItems": 1,
      "required": true,
      "localized": true
    }
  }
} as const

export interface CreateBetaHdCellsEngineeringAllentownBlockOptions { mediaCollection?: CollectionSlug; formCollection?: CollectionSlug }

export function createBetaHdCellsEngineeringAllentownBlock(options: CreateBetaHdCellsEngineeringAllentownBlockOptions = {}): Block {
  return createManifestBlock(manifest, options)
}

export function betaHdCellsEngineeringAllentownToProps(data: PayloadBetaHdCellsEngineeringAllentownDocument): BetaHdCellsEngineeringAllentownContent {
  return manifestToProps(data)
}
