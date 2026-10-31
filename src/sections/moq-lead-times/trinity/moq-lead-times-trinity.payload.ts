import type { Block, CollectionSlug } from 'payload'
import { createManifestBlock } from '../../../shared/manifest-block.js'
import { structuralSectionToProps } from '../../../shared/structural-props.js'
import type { PayloadAdapterOptions } from '../../../shared/payload.js'
import type { BetaMoqLeadTimesTrinityContent, PayloadBetaMoqLeadTimesTrinityDocument } from './moq-lead-times-trinity.types.js'

const manifest = {
  "slug": "moq-lead-times-trinity",
  "title": "MOQ Lead Times Trinity",
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
      "defaultValue": "semi-light",
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
      "description": "One to six items. Titles render literally; numbering is never added automatically.",
      "fields": {
        "icon": {
          "kind": "text",
          "required": false,
          "localized": true,
          "description": "Optional Font Awesome 7 Sharp Solid icon name; rendered as SVG, without an icon font."
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
        "label": {
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

export interface CreateBetaMoqLeadTimesTrinityBlockOptions { mediaCollection?: CollectionSlug; formCollection?: CollectionSlug; targetCollections?: CollectionSlug[] }

export function createBetaMoqLeadTimesTrinityBlock(options: CreateBetaMoqLeadTimesTrinityBlockOptions = {}): Block {
  return createManifestBlock(manifest, options)
}

export function betaMoqLeadTimesTrinityToProps(data: PayloadBetaMoqLeadTimesTrinityDocument, options: PayloadAdapterOptions = {}): BetaMoqLeadTimesTrinityContent {
  return structuralSectionToProps(data, options)
}
