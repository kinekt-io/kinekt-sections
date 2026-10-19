// @generated structural section — source manifest remains the contract.
import type { Block, CollectionSlug } from 'payload'
import { createManifestBlock, manifestToProps } from '../../../shared/manifest-block.js'
import type { CaseStudiesAllentownContent, PayloadCaseStudiesAllentownDocument } from './case-studies-allentown.types.js'

const manifest = {
  "slug": "case-studies-allentown",
  "title": "Case Studies Allentown",
  "status": "released",
  "fields": {
    "theme": {
      "kind": "select",
      "required": true,
      "localized": false,
      "options": [
        "light",
        "semi-light",
        "dark",
        "semi-dark"
      ],
      "description": "CMS-selected presentation setting passed to the renderer."
    },
    "intro": {
      "kind": "component",
      "componentId": "components/intro/allentown",
      "required": true,
      "localized": true
    },
    "sectionLabel": {
      "kind": "text",
      "required": false,
      "localized": true,
      "description": "Optional label displayed before the case carousel with a decorative line."
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

export interface CreateCaseStudiesAllentownBlockOptions { mediaCollection?: CollectionSlug; formCollection?: CollectionSlug }

export function createCaseStudiesAllentownBlock(options: CreateCaseStudiesAllentownBlockOptions = {}): Block {
  return createManifestBlock(manifest, options)
}

export function caseStudiesAllentownToProps(data: PayloadCaseStudiesAllentownDocument): CaseStudiesAllentownContent {
  return manifestToProps(data)
}
