import type { Block, CollectionSlug } from 'payload'
import { createManifestBlock } from '../../../shared/manifest-block.js'
import { structuralSectionToProps } from '../../../shared/structural-props.js'
import type { PayloadAdapterOptions } from '../../../shared/payload.js'
import type { BetaProofMetricsTrinityContent, PayloadBetaProofMetricsTrinityDocument } from './proof-metrics-trinity.types.js'

const manifest = {
  "slug": "proof-metrics-trinity",
  "title": "Proof Metrics Trinity",
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
      ]
    },
    "theme": {
      "kind": "select",
      "required": true,
      "localized": true,
      "defaultValue": "light",
      "options": [
        "light",
        "semi-light",
        "semi-dark",
        "dark"
      ]
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
          "required": false,
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
      "required": true,
      "localized": true,
      "minItems": 1,
      "maxItems": 6,
      "admin": {
        "initCollapsed": true
      },
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
        "label": {
          "kind": "component",
          "componentId": "components/result-item/allentown",
          "required": false,
          "localized": true,
          "fields": {
            "label": {
              "kind": "text",
              "required": false,
              "localized": true
            },
            "value": {
              "kind": "component",
              "componentId": "atoms/label/allentown",
              "required": false,
              "localized": true,
              "fields": {
                "text": {
                  "kind": "text",
                  "required": false,
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
    "callout": {
      "kind": "component",
      "componentId": "components/callout/allentown",
      "required": false,
      "localized": true,
      "admin": {
        "initCollapsed": true
      },
      "fields": {
        "intro": {
          "kind": "component",
          "componentId": "components/intro/allentown",
          "required": false,
          "localized": true,
          "fields": {
            "accentHeading": {
              "kind": "text",
              "required": false,
              "localized": true
            },
            "heading": {
              "kind": "text",
              "required": false,
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

export interface CreateBetaProofMetricsTrinityBlockOptions { mediaCollection?: CollectionSlug; formCollection?: CollectionSlug; targetCollections?: CollectionSlug[] }

export function createBetaProofMetricsTrinityBlock(options: CreateBetaProofMetricsTrinityBlockOptions = {}): Block {
  return createManifestBlock(manifest, options)
}

export function betaProofMetricsTrinityToProps(data: PayloadBetaProofMetricsTrinityDocument, options: PayloadAdapterOptions = {}): BetaProofMetricsTrinityContent {
  return structuralSectionToProps(data, options)
}
