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
          "description": "Add zero, one or two actions. Set each action’s style, label, and Content, URL, or Form target. A Form target opens its HubSpot embed code in a modal."
        }
      }
    },
    "mediaType": {
      "kind": "select",
      "required": false,
      "localized": true,
      "defaultValue": "image",
      "options": [
        "image",
        "video"
      ],
      "description": "Show the image or a trusted HTML video embed."
    },
    "image": {
      "kind": "media",
      "required": false,
      "localized": true,
      "description": "Image shown when Media type is Image. Optional static fallback when Media type is Video."
    },
    "videoEmbedHtml": {
      "kind": "embedHtml",
      "required": false,
      "localized": true,
      "description": "Paste trusted video embed HTML. Required when Media type is Video."
    },
    "imageAspectRatio": {
      "kind": "select",
      "required": false,
      "localized": true,
      "defaultValue": "16:9",
      "options": [
        "1:1",
        "5:4",
        "4:5",
        "16:9",
        "9:16"
      ],
      "description": "Desktop media aspect ratio. Mobile media remains square."
    },
    "markerType": {
      "kind": "select",
      "required": false,
      "localized": true,
      "defaultValue": "label",
      "options": [
        "label",
        "number",
        "label-number"
      ],
      "description": "Show each item’s label with its flight path, a zero-padded sequential number, or both together."
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
          "required": false,
          "localized": true,
          "description": "Displayed only when the parent Process Story uses label markers."
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
              "description": "Add zero, one or two actions. Set each action’s style, label, and Content, URL, or Form target. A Form target opens its HubSpot embed code in a modal."
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
          "description": "Add zero, one or two actions. Set each action’s style, label, and Content, URL, or Form target. A Form target opens its HubSpot embed code in a modal."
        }
      }
    }
  }
} as const

export interface CreateBetaProcessStoryAllentownBlockOptions { mediaCollection?: CollectionSlug; formCollection?: CollectionSlug; faqCollection?: CollectionSlug; targetCollections?: CollectionSlug[] }

export function createBetaProcessStoryAllentownBlock(options: CreateBetaProcessStoryAllentownBlockOptions = {}): Block {
  return createManifestBlock(manifest, options)
}

export function betaProcessStoryAllentownToProps(data: PayloadBetaProcessStoryAllentownDocument, options: PayloadAdapterOptions = {}): BetaProcessStoryAllentownContent {
  return structuralSectionToProps(data, options)
}
