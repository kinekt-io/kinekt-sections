import type { Block, CollectionSlug } from 'payload'
import { createManifestBlock } from '../../../shared/manifest-block.js'
import { structuralSectionToProps } from '../../../shared/structural-props.js'
import type { PayloadAdapterOptions } from '../../../shared/payload.js'
import type { BetaProcessStoryTrinityContent, PayloadBetaProcessStoryTrinityDocument } from './process-story-trinity.types.js'

const manifest = {
  "slug": "process-story-trinity",
  "title": "Process Story Trinity",
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
    "items": {
      "kind": "componentList",
      "componentId": "components/process-item/trinity",
      "required": true,
      "localized": true,
      "minItems": 1,
      "description": "Ordered process steps. The renderer owns the active state, timing bar, and pause behaviour.",
      "fields": {
        "markerType": {
          "kind": "select",
          "required": true,
          "localized": true,
          "options": [
            "number",
            "icon"
          ]
        },
        "icon": {
          "kind": "text",
          "required": false,
          "localized": true,
          "description": "Required when markerType is icon. Font Awesome 7 Sharp Solid icon name, for example blender-phone or dumpster-fire."
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

export interface CreateBetaProcessStoryTrinityBlockOptions { mediaCollection?: CollectionSlug; formCollection?: CollectionSlug; targetCollections?: CollectionSlug[] }

export function createBetaProcessStoryTrinityBlock(options: CreateBetaProcessStoryTrinityBlockOptions = {}): Block {
  return createManifestBlock(manifest, options)
}

export function betaProcessStoryTrinityToProps(data: PayloadBetaProcessStoryTrinityDocument, options: PayloadAdapterOptions = {}): BetaProcessStoryTrinityContent {
  return structuralSectionToProps(data, options)
}
