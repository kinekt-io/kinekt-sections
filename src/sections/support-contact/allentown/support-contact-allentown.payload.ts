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
      "localized": false,
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
      "localized": true
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
      "minItems": 1
    },
    "formHeading": {
      "kind": "text",
      "required": false,
      "localized": true
    },
    "form": {
      "kind": "formReference",
      "required": true,
      "localized": true,
      "description": "Only active Support Request forms available to the current region are selectable. The Form record owns conditional fields, managed dropdowns, uploads, validation and submission."
    }
  }
} as const

export interface CreateBetaSupportContactAllentownBlockOptions { mediaCollection?: CollectionSlug; formCollection?: CollectionSlug }

export function createBetaSupportContactAllentownBlock(options: CreateBetaSupportContactAllentownBlockOptions = {}): Block {
  return createManifestBlock(manifest, options)
}

export function betaSupportContactAllentownToProps(data: PayloadBetaSupportContactAllentownDocument): BetaSupportContactAllentownContent {
  return manifestToProps(data)
}
