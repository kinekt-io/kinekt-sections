import type { Block, CollectionSlug } from 'payload'
import { createManifestBlock } from '../../../shared/manifest-block.js'
import { structuralSectionToProps } from '../../../shared/structural-props.js'
import type { PayloadAdapterOptions } from '../../../shared/payload.js'
import type { BetaFormSectionAllentownContent, PayloadBetaFormSectionAllentownDocument } from './form-section-allentown.types.js'

const manifest = {
  "slug": "form-section-allentown",
  "title": "Form Section Allentown",
  "status": "prerelease",
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
    "image": {
      "kind": "media",
      "required": false,
      "localized": true
    },
    "imagePosition": {
      "kind": "select",
      "required": true,
      "localized": true,
      "options": [
        "left",
        "right"
      ],
      "description": "Desktop media position. Mobile always presents content before media."
    },
    "form": {
      "kind": "formReference",
      "required": true,
      "localized": true,
      "description": "Only active forms available to the current region are selectable. The integration renders the selected form as a HubSpot embed."
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
    }
  }
} as const

export interface CreateBetaFormSectionAllentownBlockOptions { mediaCollection?: CollectionSlug; formCollection?: CollectionSlug }

export function createBetaFormSectionAllentownBlock(options: CreateBetaFormSectionAllentownBlockOptions = {}): Block {
  return createManifestBlock(manifest, options)
}

export function betaFormSectionAllentownToProps(data: PayloadBetaFormSectionAllentownDocument, options: PayloadAdapterOptions = {}): BetaFormSectionAllentownContent {
  return structuralSectionToProps(data, options)
}
