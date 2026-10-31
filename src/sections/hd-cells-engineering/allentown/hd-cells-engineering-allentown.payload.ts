// @generated structural section — source manifest remains the contract.
import type { Block, CollectionSlug } from 'payload'
import { createManifestBlock, manifestToProps } from '../../../shared/manifest-block.js'
import type { BetaHdCellsEngineeringAllentownContent, PayloadBetaHdCellsEngineeringAllentownDocument } from './hd-cells-engineering-allentown.types.js'

const manifest = {
  "slug": "hd-cells-engineering-allentown",
  "title": "HD Cells Engineering Allentown",
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
        "70"
      ],
      "description": "Maximum content width: Standard (100%), 80%, or 70%."
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
    "cellsIntro": {
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
    },
    "engineeringIntro": {
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
    "engineeringTopics": {
      "kind": "componentList",
      "componentId": "components/hd-engineering-topic/allentown",
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
        "description": {
          "kind": "richText",
          "required": true,
          "localized": true
        },
        "ctaGroup": {
          "kind": "component",
          "componentId": "components/cta-group/allentown",
          "required": false,
          "localized": true,
          "fields": {
            "buttons": {
              "kind": "ctaGroup",
              "required": false,
              "localized": true,
              "minItems": 0,
              "maxItems": 2,
              "description": "Add zero, one or two actions. Set the style of each action to Primary, Secondary, Clear or Clear base."
            }
          }
        }
      }
    }
  }
} as const

export interface CreateBetaHdCellsEngineeringAllentownBlockOptions { mediaCollection?: CollectionSlug; formCollection?: CollectionSlug; targetCollections?: CollectionSlug[] }

export function createBetaHdCellsEngineeringAllentownBlock(options: CreateBetaHdCellsEngineeringAllentownBlockOptions = {}): Block {
  return createManifestBlock(manifest, options)
}

export function betaHdCellsEngineeringAllentownToProps(data: PayloadBetaHdCellsEngineeringAllentownDocument): BetaHdCellsEngineeringAllentownContent {
  return manifestToProps(data)
}
