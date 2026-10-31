// @generated structural section — source manifest remains the contract.
import type { Block, CollectionSlug } from 'payload'
import { createManifestBlock, manifestToProps } from '../../../shared/manifest-block.js'
import type { BetaFaqAllentownContent, PayloadBetaFaqAllentownDocument } from './faq-allentown.types.js'

const manifest = {
  "slug": "faq-allentown",
  "title": "FAQ Allentown",
  "status": "beta",
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
    "items": {
      "kind": "componentList",
      "componentId": "components/faq-item/allentown",
      "required": true,
      "localized": true,
      "minItems": 1,
      "fields": {
        "question": {
          "kind": "text",
          "required": true,
          "localized": true
        },
        "answer": {
          "kind": "textarea",
          "required": true,
          "localized": true
        }
      }
    },
    "overviewCta": {
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
    "callout": {
      "kind": "component",
      "componentId": "components/callout/allentown",
      "required": false,
      "localized": true,
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

export interface CreateBetaFaqAllentownBlockOptions { mediaCollection?: CollectionSlug; formCollection?: CollectionSlug; targetCollections?: CollectionSlug[] }

export function createBetaFaqAllentownBlock(options: CreateBetaFaqAllentownBlockOptions = {}): Block {
  return createManifestBlock(manifest, options)
}

export function betaFaqAllentownToProps(data: PayloadBetaFaqAllentownDocument): BetaFaqAllentownContent {
  return manifestToProps(data)
}
