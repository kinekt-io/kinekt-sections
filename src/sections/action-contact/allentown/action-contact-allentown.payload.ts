// @generated structural section — source manifest remains the contract.
import type { Block, CollectionSlug } from 'payload'
import { createManifestBlock, manifestToProps } from '../../../shared/manifest-block.js'
import type { BetaActionContactAllentownContent, PayloadBetaActionContactAllentownDocument } from './action-contact-allentown.types.js'

const manifest = {
  "slug": "action-contact-allentown",
  "title": "Action Contact Allentown",
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
    "image": {
      "kind": "media",
      "required": true,
      "localized": true
    },
    "actionHeading": {
      "kind": "text",
      "required": true,
      "localized": true
    },
    "actions": {
      "kind": "ctaGroup",
      "required": true,
      "localized": true,
      "description": "One or more direct contact actions using Button Allentown controls."
    },
    "actionNote": {
      "kind": "text",
      "required": false,
      "localized": true
    },
    "contactHeading": {
      "kind": "text",
      "required": true,
      "localized": true
    },
    "contactMethods": {
      "kind": "componentList",
      "componentId": "components/contact-method/allentown",
      "required": true,
      "localized": true,
      "minItems": 1,
      "fields": {
        "icon": {
          "kind": "select",
          "required": true,
          "localized": true,
          "options": [
            "whatsapp",
            "phone",
            "email"
          ],
          "description": "Font Awesome Free SVG icon."
        },
        "label": {
          "kind": "text",
          "required": true,
          "localized": true
        },
        "href": {
          "kind": "text",
          "required": true,
          "localized": true,
          "description": "Actionable URI such as mailto:, tel: or https:."
        }
      }
    }
  }
} as const

export interface CreateBetaActionContactAllentownBlockOptions { mediaCollection?: CollectionSlug; formCollection?: CollectionSlug; targetCollections?: CollectionSlug[] }

export function createBetaActionContactAllentownBlock(options: CreateBetaActionContactAllentownBlockOptions = {}): Block {
  return createManifestBlock(manifest, options)
}

export function betaActionContactAllentownToProps(data: PayloadBetaActionContactAllentownDocument): BetaActionContactAllentownContent {
  return manifestToProps(data)
}
