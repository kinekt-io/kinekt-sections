// @generated structural section — source manifest remains the contract.
import type { Block, CollectionSlug } from 'payload'
import { createManifestBlock, manifestToProps } from '../../../shared/manifest-block.js'
import type { BetaChecklistFeatureListAllentownContent, PayloadBetaChecklistFeatureListAllentownDocument } from './checklist-feature-list-allentown.types.js'

const manifest = {
  "slug": "checklist-feature-list-allentown",
  "title": "Checklist Feature List Allentown",
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
    "checklist": {
      "kind": "componentList",
      "componentId": "components/checklist-item/allentown",
      "required": true,
      "localized": true,
      "minItems": 1
    },
    "features": {
      "kind": "componentList",
      "componentId": "components/feature-item/allentown",
      "required": true,
      "localized": true,
      "minItems": 1
    }
  }
} as const

export interface CreateBetaChecklistFeatureListAllentownBlockOptions { mediaCollection?: CollectionSlug; formCollection?: CollectionSlug }

export function createBetaChecklistFeatureListAllentownBlock(options: CreateBetaChecklistFeatureListAllentownBlockOptions = {}): Block {
  return createManifestBlock(manifest, options)
}

export function betaChecklistFeatureListAllentownToProps(data: PayloadBetaChecklistFeatureListAllentownDocument): BetaChecklistFeatureListAllentownContent {
  return manifestToProps(data)
}
