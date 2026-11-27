// @generated structural section — source manifest remains the contract.
import type { Block, CollectionSlug } from 'payload'
import { createManifestBlock, manifestToProps } from '../../../shared/manifest-block.js'
import type { BetaHdCellsAllentownContent, PayloadBetaHdCellsAllentownDocument } from './hd-cells-allentown.types.js'

const manifest = {
  "slug": "hd-cells-allentown",
  "title": "HD Cells Allentown",
  "status": "prerelease",
  "fields": {
    "contentWidth": {
      "kind": "select",
      "required": false,
      "localized": true,
      "defaultValue": "standard",
      "options": [
        "standard",
        "80",
        "70",
        "50"
      ],
      "description": "Maximum content width: Standard (100%), 80%, 70%, or 50%."
    },
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
    "cellItems": {
      "kind": "componentList",
      "componentId": "components/hd-cell-item/allentown",
      "minItems": 1,
      "required": true,
      "localized": true,
      "fields": {
        "media": {
          "kind": "media",
          "required": true,
          "localized": true
        },
        "title": {
          "kind": "text",
          "required": true,
          "localized": true
        },
        "subtitle": {
          "kind": "text",
          "required": false,
          "localized": true
        },
        "description": {
          "kind": "richText",
          "required": true,
          "localized": true
        }
      }
    }
  }
} as const

export interface CreateBetaHdCellsAllentownBlockOptions { mediaCollection?: CollectionSlug; formCollection?: CollectionSlug; faqCollection?: CollectionSlug; targetCollections?: CollectionSlug[] }

export function createBetaHdCellsAllentownBlock(options: CreateBetaHdCellsAllentownBlockOptions = {}): Block {
  return createManifestBlock(manifest, options)
}

export function betaHdCellsAllentownToProps(data: PayloadBetaHdCellsAllentownDocument): BetaHdCellsAllentownContent {
  return manifestToProps(data)
}
