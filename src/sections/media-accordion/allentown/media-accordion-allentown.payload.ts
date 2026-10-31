// @generated structural section — source manifest remains the contract.
import type { Block, CollectionSlug } from 'payload'
import { createManifestBlock, manifestToProps } from '../../../shared/manifest-block.js'
import type { BetaMediaAccordionAllentownContent, PayloadBetaMediaAccordionAllentownDocument } from './media-accordion-allentown.types.js'

const manifest = {
  "slug": "media-accordion-allentown",
  "title": "Media Accordion Allentown",
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
    "ctas": {
      "kind": "ctaGroup",
      "required": false,
      "localized": true,
      "description": "Optional primary and secondary actions below the introduction."
    },
    "media": {
      "kind": "media",
      "required": false,
      "localized": true,
      "description": "Optional editor-selected media, localized per locale. The renderer removes the media column when absent."
    },
    "items": {
      "kind": "componentList",
      "componentId": "components/accordion-item/allentown",
      "required": true,
      "localized": true,
      "minItems": 1,
      "description": "An unordered list of accessible accordion items.",
      "fields": {
        "markerType": {
          "kind": "select",
          "required": true,
          "localized": true,
          "options": [
            "none",
            "number",
            "icon"
          ],
          "description": "When number is selected, the renderer derives the marker from the item's list position. When icon is selected, icon is required."
        },
        "icon": {
          "kind": "text",
          "required": false,
          "localized": true,
          "description": "Required when markerType is icon. Font Awesome 7 Sharp Solid icon name."
        },
        "title": {
          "kind": "text",
          "required": true,
          "localized": true
        },
        "subtitle": {
          "kind": "text",
          "required": false,
          "localized": true
        },
        "description": {
          "kind": "richText",
          "required": true,
          "localized": true
        }
      }
    }
  }
} as const

export interface CreateBetaMediaAccordionAllentownBlockOptions { mediaCollection?: CollectionSlug; formCollection?: CollectionSlug; targetCollections?: CollectionSlug[] }

export function createBetaMediaAccordionAllentownBlock(options: CreateBetaMediaAccordionAllentownBlockOptions = {}): Block {
  return createManifestBlock(manifest, options)
}

export function betaMediaAccordionAllentownToProps(data: PayloadBetaMediaAccordionAllentownDocument): BetaMediaAccordionAllentownContent {
  return manifestToProps(data)
}
