// @generated structural section — source manifest remains the contract.
import type { Block, CollectionSlug } from 'payload'
import { createManifestBlock, manifestToProps } from '../../../shared/manifest-block.js'
import type { BetaBatteryModelsAllentownContent, PayloadBetaBatteryModelsAllentownDocument } from './battery-models-allentown.types.js'

const manifest = {
  "slug": "battery-models-allentown",
  "title": "Battery Models Allentown",
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
    "ctas": {
      "kind": "ctaGroup",
      "required": false,
      "localized": true,
      "description": "Optional primary and secondary actions below the introduction."
    },
    "models": {
      "kind": "componentList",
      "componentId": "components/battery-card/allentown",
      "required": true,
      "localized": true,
      "minItems": 1,
      "fields": {
        "image": {
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
        "specs": {
          "kind": "componentList",
          "componentId": "components/spec-pair/allentown",
          "required": true,
          "localized": true,
          "minItems": 1,
          "fields": {
            "label": {
              "kind": "text",
              "required": true,
              "localized": true,
              "admin": {
                "width": "50%"
              }
            },
            "value": {
              "kind": "text",
              "required": true,
              "localized": true,
              "admin": {
                "width": "50%"
              }
            }
          }
        }
      }
    },
    "crossSell": {
      "kind": "component",
      "componentId": "patterns/cross-sell/allentown",
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
        "items": {
          "kind": "componentList",
          "componentId": "components/cross-sell-item/allentown",
          "required": true,
          "localized": true,
          "minItems": 0,
          "fields": {
            "image": {
              "kind": "media",
              "required": true,
              "localized": true
            },
            "title": {
              "kind": "text",
              "required": true,
              "localized": true
            },
            "cta": {
              "kind": "component",
              "componentId": "controls/button/allentown",
              "required": true,
              "localized": true,
              "fields": {
                "cta": {
                  "kind": "cta",
                  "required": true,
                  "localized": true
                }
              }
            }
          }
        }
      }
    }
  }
} as const

export interface CreateBetaBatteryModelsAllentownBlockOptions { mediaCollection?: CollectionSlug; formCollection?: CollectionSlug; targetCollections?: CollectionSlug[] }

export function createBetaBatteryModelsAllentownBlock(options: CreateBetaBatteryModelsAllentownBlockOptions = {}): Block {
  return createManifestBlock(manifest, options)
}

export function betaBatteryModelsAllentownToProps(data: PayloadBetaBatteryModelsAllentownDocument): BetaBatteryModelsAllentownContent {
  return manifestToProps(data)
}
