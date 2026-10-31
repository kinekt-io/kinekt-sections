// @generated structural section — source manifest remains the contract.
import type { Block, CollectionSlug } from 'payload'
import { createManifestBlock, manifestToProps } from '../../../shared/manifest-block.js'
import type { BetaProofMetricsAllentownContent, PayloadBetaProofMetricsAllentownDocument } from './proof-metrics-allentown.types.js'

const manifest = {
  "slug": "proof-metrics-allentown",
  "title": "Proof Metrics Allentown",
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
    "metrics": {
      "kind": "componentList",
      "componentId": "components/result-item/allentown",
      "required": true,
      "localized": true,
      "minItems": 4,
      "maxItems": 4,
      "description": "Four named proof values; each metric has a required label and a localized Label value.",
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
    },
    "media": {
      "kind": "media",
      "required": false,
      "localized": true,
      "description": "Optional editor-selected proof media, localized per locale."
    },
    "callout": {
      "kind": "component",
      "componentId": "components/callout/allentown",
      "required": true,
      "localized": true,
      "description": "A localized action callout with a required Button component.",
      "fields": {
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

export interface CreateBetaProofMetricsAllentownBlockOptions { mediaCollection?: CollectionSlug; formCollection?: CollectionSlug; targetCollections?: CollectionSlug[] }

export function createBetaProofMetricsAllentownBlock(options: CreateBetaProofMetricsAllentownBlockOptions = {}): Block {
  return createManifestBlock(manifest, options)
}

export function betaProofMetricsAllentownToProps(data: PayloadBetaProofMetricsAllentownDocument): BetaProofMetricsAllentownContent {
  return manifestToProps(data)
}
