// @generated structural section — source manifest remains the contract.
import type { Block, CollectionSlug } from 'payload'
import { createManifestBlock, manifestToProps } from '../../../shared/manifest-block.js'
import type { BetaMoqLeadTimesAllentownContent, PayloadBetaMoqLeadTimesAllentownDocument } from './moq-lead-times-allentown.types.js'

const manifest = {
  "slug": "moq-lead-times-allentown",
  "title": "MOQ Lead Times Allentown",
  "status": "prerelease",
  "fields": {
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
    "cta": {
      "kind": "component",
      "componentId": "controls/button/allentown",
      "required": false,
      "localized": true,
      "fields": {
        "cta": {
          "kind": "cta",
          "required": true,
          "localized": true
        }
      }
    },
    "moq": {
      "kind": "component",
      "componentId": "components/delivery-fact/allentown",
      "required": true,
      "localized": true,
      "fields": {
        "title": {
          "kind": "text",
          "required": true,
          "localized": true
        },
        "description": {
          "kind": "textarea",
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
    },
    "leadTimes": {
      "kind": "componentList",
      "componentId": "components/delivery-fact/allentown",
      "required": true,
      "localized": true,
      "minItems": 1,
      "fields": {
        "title": {
          "kind": "text",
          "required": true,
          "localized": true
        },
        "description": {
          "kind": "textarea",
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
} as const

export interface CreateBetaMoqLeadTimesAllentownBlockOptions { mediaCollection?: CollectionSlug; formCollection?: CollectionSlug; targetCollections?: CollectionSlug[] }

export function createBetaMoqLeadTimesAllentownBlock(options: CreateBetaMoqLeadTimesAllentownBlockOptions = {}): Block {
  return createManifestBlock(manifest, options)
}

export function betaMoqLeadTimesAllentownToProps(data: PayloadBetaMoqLeadTimesAllentownDocument): BetaMoqLeadTimesAllentownContent {
  return manifestToProps(data)
}
