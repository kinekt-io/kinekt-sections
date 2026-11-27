// @generated structural section — source manifest remains the contract.
import type { Block, CollectionSlug } from 'payload'
import { createManifestBlock, manifestToProps } from '../../../shared/manifest-block.js'
import type { BetaHdEngineeringAllentownContent, PayloadBetaHdEngineeringAllentownDocument } from './hd-engineering-allentown.types.js'

const manifest = {
  "slug": "hd-engineering-allentown",
  "title": "HD Engineering Allentown",
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
        "labels": {
          "kind": "componentList",
          "componentId": "components/result-item/allentown",
          "required": false,
          "localized": true,
          "minItems": 0,
          "maxItems": 2,
          "admin": {
            "initCollapsed": true
          },
          "description": "Add up to two informational labels. Each has a title, label text and optional Font Awesome Sharp Solid icon; labels are not links.",
          "fields": {
            "label": {
              "kind": "text",
              "required": true,
              "localized": true
            },
            "value": {
              "kind": "component",
              "componentId": "atoms/label/allentown",
              "required": true,
              "localized": true,
              "fields": {
                "text": {
                  "kind": "text",
                  "required": true,
                  "localized": true
                },
                "icon": {
                  "kind": "text",
                  "required": false,
                  "localized": true,
                  "description": "Optional Font Awesome 7 Sharp Solid icon name rendered before the label text."
                }
              }
            }
          }
        }
      }
    },
    "moreInformationLabel": {
      "kind": "text",
      "required": false,
      "localized": true,
      "defaultValue": "More information",
      "description": "Text for the control that reveals an engineering topic’s details."
    }
  }
} as const

export interface CreateBetaHdEngineeringAllentownBlockOptions { mediaCollection?: CollectionSlug; formCollection?: CollectionSlug; faqCollection?: CollectionSlug; targetCollections?: CollectionSlug[] }

export function createBetaHdEngineeringAllentownBlock(options: CreateBetaHdEngineeringAllentownBlockOptions = {}): Block {
  return createManifestBlock(manifest, options)
}

export function betaHdEngineeringAllentownToProps(data: PayloadBetaHdEngineeringAllentownDocument): BetaHdEngineeringAllentownContent {
  return manifestToProps(data)
}
