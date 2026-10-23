// @generated structural section — source manifest remains the contract.
import type { Block, CollectionSlug } from 'payload'
import { createManifestBlock, manifestToProps } from '../../../shared/manifest-block.js'
import type { BetaUseCasesAllentownContent, PayloadBetaUseCasesAllentownDocument } from './use-cases-allentown.types.js'

const manifest = {
  "slug": "use-cases-allentown",
  "title": "Use Cases Allentown",
  "status": "planned",
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
    "advantageHeading": {
      "kind": "text",
      "required": true,
      "localized": true
    },
    "advantages": {
      "kind": "componentList",
      "componentId": "atoms/label/allentown",
      "required": true,
      "localized": true,
      "minItems": 1,
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
          "description": "Optional Font Awesome icon key rendered before the label text."
        }
      }
    },
    "gridHeading": {
      "kind": "text",
      "required": true,
      "localized": true
    },
    "items": {
      "kind": "componentList",
      "componentId": "components/use-case-item/allentown",
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
            "primaryButton": {
              "kind": "cta",
              "required": false,
              "localized": true,
              "description": "Optional primary Button component part."
            },
            "secondaryButton": {
              "kind": "cta",
              "required": false,
              "localized": true,
              "description": "Optional secondary Button component part."
            }
          }
        }
      }
    }
  }
} as const

export interface CreateBetaUseCasesAllentownBlockOptions { mediaCollection?: CollectionSlug; formCollection?: CollectionSlug; targetCollections?: CollectionSlug[] }

export function createBetaUseCasesAllentownBlock(options: CreateBetaUseCasesAllentownBlockOptions = {}): Block {
  return createManifestBlock(manifest, options)
}

export function betaUseCasesAllentownToProps(data: PayloadBetaUseCasesAllentownDocument): BetaUseCasesAllentownContent {
  return manifestToProps(data)
}
