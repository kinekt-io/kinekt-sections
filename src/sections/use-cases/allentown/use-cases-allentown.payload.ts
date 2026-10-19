// @generated structural section — source manifest remains the contract.
import type { Block, CollectionSlug } from 'payload'
import { createManifestBlock, manifestToProps } from '../../../shared/manifest-block.js'
import type { BetaUseCasesAllentownContent, PayloadBetaUseCasesAllentownDocument } from './use-cases-allentown.types.js'

const manifest = {
  "slug": "use-cases-allentown",
  "title": "Use Cases Allentown",
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
    "advantageHeading": {
      "kind": "text",
      "required": true,
      "localized": true
    },
    "advantages": {
      "kind": "componentList",
      "componentId": "atoms/label/allentown",
      "required": true,
      "localized": true,
      "minItems": 1
    },
    "gridHeading": {
      "kind": "text",
      "required": true,
      "localized": true
    },
    "items": {
      "kind": "componentList",
      "componentId": "components/use-case-item/allentown",
      "required": true,
      "localized": true,
      "minItems": 1
    }
  }
} as const

export interface CreateBetaUseCasesAllentownBlockOptions { mediaCollection?: CollectionSlug; formCollection?: CollectionSlug }

export function createBetaUseCasesAllentownBlock(options: CreateBetaUseCasesAllentownBlockOptions = {}): Block {
  return createManifestBlock(manifest, options)
}

export function betaUseCasesAllentownToProps(data: PayloadBetaUseCasesAllentownDocument): BetaUseCasesAllentownContent {
  return manifestToProps(data)
}
