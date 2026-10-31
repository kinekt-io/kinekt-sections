import type { Block, CollectionSlug } from 'payload'
import { createManifestBlock } from '../../../shared/manifest-block.js'
import { structuralSectionToProps } from '../../../shared/structural-props.js'
import type { PayloadAdapterOptions } from '../../../shared/payload.js'
import type { BetaMoqLeadTimesAllentownContent, PayloadBetaMoqLeadTimesAllentownDocument } from './moq-lead-times-allentown.types.js'

const manifest = {
  "slug": "moq-lead-times-allentown",
  "title": "MOQ Lead Times Allentown",
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
    "ctas": {
      "kind": "ctaGroup",
      "required": false,
      "localized": true,
      "minItems": 0,
      "maxItems": 2,
      "description": "Optional primary and secondary actions below the introduction."
    },
    "infoColumns": {
      "kind": "componentList",
      "required": true,
      "localized": true,
      "minItems": 1,
      "maxItems": 2,
      "description": "One or two ordering and delivery information columns.",
      "fields": {
        "title": {
          "kind": "text",
          "required": true,
          "localized": true
        },
        "rows": {
          "kind": "componentList",
          "required": true,
          "localized": true,
          "minItems": 1,
          "fields": {
            "title": {
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
    }
  }
} as const

export interface CreateBetaMoqLeadTimesAllentownBlockOptions { mediaCollection?: CollectionSlug; formCollection?: CollectionSlug; targetCollections?: CollectionSlug[] }

export function createBetaMoqLeadTimesAllentownBlock(options: CreateBetaMoqLeadTimesAllentownBlockOptions = {}): Block {
  return createManifestBlock(manifest, options)
}

export function betaMoqLeadTimesAllentownToProps(data: PayloadBetaMoqLeadTimesAllentownDocument, options: PayloadAdapterOptions = {}): BetaMoqLeadTimesAllentownContent {
  return structuralSectionToProps(data, options)
}
