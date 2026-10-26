// @generated structural section — source manifest remains the contract.
import type { Block, CollectionSlug } from 'payload'
import { createManifestBlock, manifestToProps } from '../../../shared/manifest-block.js'
import type { BetaSupportContactAllentownContent, PayloadBetaSupportContactAllentownDocument } from './support-contact-allentown.types.js'

const manifest = {
  "slug": "support-contact-allentown",
  "title": "Support Contact Allentown",
  "status": "beta",
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
    "contactHeading": {
      "kind": "text",
      "required": false,
      "localized": true
    },
    "contactMethods": {
      "kind": "componentList",
      "componentId": "components/contact-method/allentown",
      "required": false,
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
    },
    "formHeading": {
      "kind": "text",
      "required": false,
      "localized": true
    },
    "form": {
      "kind": "formEmbed",
      "required": true,
      "localized": true,
      "description": "HubSpot embed code. The catalogue renders a safe placeholder through components/form-embed/allentown; the integration owns execution of the embed."
    }
  }
} as const

export interface CreateBetaSupportContactAllentownBlockOptions { mediaCollection?: CollectionSlug; formCollection?: CollectionSlug; targetCollections?: CollectionSlug[] }

export function createBetaSupportContactAllentownBlock(options: CreateBetaSupportContactAllentownBlockOptions = {}): Block {
  return createManifestBlock(manifest, options)
}

export function betaSupportContactAllentownToProps(data: PayloadBetaSupportContactAllentownDocument): BetaSupportContactAllentownContent {
  return manifestToProps(data)
}
