import type { Block, CollectionSlug } from 'payload'
import { createManifestBlock } from '../../../shared/manifest-block.js'
import { structuralSectionToProps } from '../../../shared/structural-props.js'
import type { PayloadAdapterOptions } from '../../../shared/payload.js'
import type { BetaTabsAllentownContent, PayloadBetaTabsAllentownDocument } from './tabs-allentown.types.js'

const manifest = {
  "slug": "tabs-allentown",
  "title": "Tabs Allentown",
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
    "tabsHeading": {
      "kind": "text",
      "required": false,
      "localized": true,
      "description": "Optional prompt above the tab navigation."
    },
    "tabs": {
      "kind": "componentList",
      "componentId": "components/tab-item/allentown",
      "required": true,
      "localized": true,
      "minItems": 1,
      "admin": {
        "initCollapsed": true
      },
      "fields": {
        "label": {
          "kind": "text",
          "required": true,
          "localized": true
        },
        "intro": {
          "kind": "component",
          "componentId": "components/intro/allentown",
          "required": false,
          "localized": true,
          "admin": {
            "initCollapsed": true
          },
          "description": "Optional accent heading, heading and rich-text description. Every field may be left empty.",
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
          "kind": "ctaGroup",
          "required": false,
          "localized": true,
          "minItems": 0,
          "maxItems": 2
        },
        "form": {
          "kind": "formEmbed",
          "required": false,
          "localized": true,
          "description": "Optional HubSpot embed code. Leave empty for an introduction or contact actions without a form."
        }
      }
    }
  }
} as const

export interface CreateBetaTabsAllentownBlockOptions { mediaCollection?: CollectionSlug; formCollection?: CollectionSlug; targetCollections?: CollectionSlug[] }

export function createBetaTabsAllentownBlock(options: CreateBetaTabsAllentownBlockOptions = {}): Block {
  return createManifestBlock(manifest, options)
}

export function betaTabsAllentownToProps(data: PayloadBetaTabsAllentownDocument, options: PayloadAdapterOptions = {}): BetaTabsAllentownContent {
  return structuralSectionToProps(data, options)
}
