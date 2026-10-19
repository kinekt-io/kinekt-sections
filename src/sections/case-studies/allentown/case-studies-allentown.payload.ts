// @generated structural section — source manifest remains the contract.
import type { Block, CollectionSlug } from 'payload'
import { createManifestBlock, manifestToProps } from '../../../shared/manifest-block.js'
import type { BetaCaseStudiesAllentownContent, PayloadBetaCaseStudiesAllentownDocument } from './case-studies-allentown.types.js'

const manifest = {
  "slug": "case-studies-allentown",
  "title": "Case Studies Allentown",
  "fields": {
    "theme": {
      "kind": "select",
      "required": true,
      "localized": false,
      "options": [
        "light",
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
    "carousel": {
      "kind": "component",
      "componentId": "patterns/case-study-carousel/allentown",
      "required": true,
      "localized": true
    },
    "cta": {
      "kind": "component",
      "componentId": "controls/button/allentown",
      "required": false,
      "localized": true
    }
  }
} as const

export interface CreateBetaCaseStudiesAllentownBlockOptions { mediaCollection?: CollectionSlug; formCollection?: CollectionSlug }

export function createBetaCaseStudiesAllentownBlock(options: CreateBetaCaseStudiesAllentownBlockOptions = {}): Block {
  return createManifestBlock(manifest, options)
}

export function betaCaseStudiesAllentownToProps(data: PayloadBetaCaseStudiesAllentownDocument): BetaCaseStudiesAllentownContent {
  return manifestToProps(data)
}
