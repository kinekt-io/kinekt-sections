import type { Block, CollectionSlug } from 'payload'
import { createManifestBlock } from '../../../shared/manifest-block.js'
import { structuralSectionToProps } from '../../../shared/structural-props.js'
import type { PayloadAdapterOptions } from '../../../shared/payload.js'
import type { BetaContactChannelsAllentownContent, PayloadBetaContactChannelsAllentownDocument } from './contact-channels-allentown.types.js'

const manifest = {
  "slug": "contact-channels-allentown",
  "title": "Contact Channels Allentown",
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
      "defaultValue": "dark",
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
      "required": true,
      "localized": true
    },
    "availability": {
      "kind": "richText",
      "required": true,
      "localized": true,
      "description": "Availability or response-time details shown below the contact heading."
    },
    "privacyNote": {
      "kind": "text",
      "required": false,
      "localized": true,
      "description": "Optional short privacy or handling reassurance shown with a renderer-owned shield icon."
    },
    "actions": {
      "kind": "ctaGroup",
      "required": true,
      "localized": true,
      "minItems": 1,
      "maxItems": 2,
      "description": "Add one or two direct contact actions. Set each action’s style, label and Content, URL or Form target."
    }
  }
} as const

export interface CreateBetaContactChannelsAllentownBlockOptions { mediaCollection?: CollectionSlug; formCollection?: CollectionSlug; faqCollection?: CollectionSlug; targetCollections?: CollectionSlug[] }

export function createBetaContactChannelsAllentownBlock(options: CreateBetaContactChannelsAllentownBlockOptions = {}): Block {
  return createManifestBlock(manifest, options)
}

export function betaContactChannelsAllentownToProps(data: PayloadBetaContactChannelsAllentownDocument, options: PayloadAdapterOptions = {}): BetaContactChannelsAllentownContent {
  return structuralSectionToProps(data, options)
}
