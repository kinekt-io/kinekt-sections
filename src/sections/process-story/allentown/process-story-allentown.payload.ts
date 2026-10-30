import type { Block, CollectionSlug } from 'payload'
import { createManifestBlock } from '../../../shared/manifest-block.js'
import { structuralSectionToProps } from '../../../shared/structural-props.js'
import type { PayloadAdapterOptions } from '../../../shared/payload.js'
import type { BetaProcessStoryAllentownContent, PayloadBetaProcessStoryAllentownDocument } from './process-story-allentown.types.js'

const manifest = {
  "slug": "process-story-allentown",
  "title": "Process Story Allentown",
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
    "introCtaGroup": {
      "kind": "component",
      "componentId": "components/cta-group/allentown",
      "required": false,
      "localized": true,
      "description": "Optional primary, secondary or clear actions below the introduction.",
      "fields": {
        "buttons": {
          "kind": "ctaGroup",
          "required": false,
          "localized": true,
          "minItems": 0,
          "maxItems": 2,
          "description": "Add zero, one or two actions. Set the style of each action to Primary, Secondary or Clear."
        }
      }
    },
    "image": {
      "kind": "media",
      "required": false,
      "localized": true
    },
    "items": {
      "kind": "componentList",
      "componentId": "components/process-item/allentown",
      "required": true,
      "localized": true,
      "minItems": 1,
      "fields": {
        "label": {
          "kind": "text",
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
        "ctaGroup": {
          "kind": "component",
          "componentId": "components/cta-group/allentown",
          "required": false,
          "localized": true,
          "description": "Optional primary, secondary or clear actions below this process item.",
          "fields": {
            "buttons": {
              "kind": "ctaGroup",
              "required": false,
              "localized": true,
              "minItems": 0,
              "maxItems": 2,
              "description": "Add zero, one or two actions. Set the style of each action to Primary, Secondary or Clear."
            }
          }
        }
      }
    },
    "listCtaGroup": {
      "kind": "component",
      "componentId": "components/cta-group/allentown",
      "required": false,
      "localized": true,
      "description": "Optional primary, secondary or clear actions below the process item list.",
      "fields": {
        "buttons": {
          "kind": "ctaGroup",
          "required": false,
          "localized": true,
          "minItems": 0,
          "maxItems": 2,
          "description": "Add zero, one or two actions. Set the style of each action to Primary, Secondary or Clear."
        }
      }
    }
  }
} as const

export interface CreateBetaProcessStoryAllentownBlockOptions { mediaCollection?: CollectionSlug; formCollection?: CollectionSlug; targetCollections?: CollectionSlug[] }

export function createBetaProcessStoryAllentownBlock(options: CreateBetaProcessStoryAllentownBlockOptions = {}): Block {
  return createManifestBlock(manifest, options)
}

export function betaProcessStoryAllentownToProps(data: PayloadBetaProcessStoryAllentownDocument, options: PayloadAdapterOptions = {}): BetaProcessStoryAllentownContent {
  return structuralSectionToProps(data, options)
}
