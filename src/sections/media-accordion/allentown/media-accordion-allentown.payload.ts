// @generated structural section — source manifest remains the contract.
import type { Block, CollectionSlug } from 'payload'
import { createManifestBlock, manifestToProps } from '../../../shared/manifest-block.js'
import type { BetaMediaAccordionAllentownContent, PayloadBetaMediaAccordionAllentownDocument } from './media-accordion-allentown.types.js'

const manifest = {
  "slug": "media-accordion-allentown",
  "title": "Media Accordion Allentown",
  "status": "planned",
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
      "description": "An unordered list of accessible accordion items."
    }
  }
} as const

export interface CreateBetaMediaAccordionAllentownBlockOptions { mediaCollection?: CollectionSlug; formCollection?: CollectionSlug }

export function createBetaMediaAccordionAllentownBlock(options: CreateBetaMediaAccordionAllentownBlockOptions = {}): Block {
  return createManifestBlock(manifest, options)
}

export function betaMediaAccordionAllentownToProps(data: PayloadBetaMediaAccordionAllentownDocument): BetaMediaAccordionAllentownContent {
  return manifestToProps(data)
}
