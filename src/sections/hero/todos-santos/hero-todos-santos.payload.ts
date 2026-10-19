// @generated structural section — source manifest remains the contract.
import type { Block, CollectionSlug } from 'payload'
import { createManifestBlock, manifestToProps } from '../../../shared/manifest-block.js'
import type { BetaHeroTodosSantosContent, PayloadBetaHeroTodosSantosDocument } from './hero-todos-santos.types.js'

const manifest = {
  "slug": "hero-todos-santos",
  "title": "Hero Todos Santos",
  "status": "planned",
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
    "featureHeading": {
      "kind": "text",
      "required": true,
      "localized": true
    },
    "features": {
      "kind": "componentList",
      "componentId": "components/feature-pair/allentown",
      "required": true,
      "localized": true,
      "minItems": 1
    },
    "ctas": {
      "kind": "ctaGroup",
      "required": false,
      "localized": true,
      "description": "Optional primary and secondary actions."
    },
    "image": {
      "kind": "media",
      "required": true,
      "localized": true
    }
  }
} as const

export interface CreateBetaHeroTodosSantosBlockOptions { mediaCollection?: CollectionSlug; formCollection?: CollectionSlug }

export function createBetaHeroTodosSantosBlock(options: CreateBetaHeroTodosSantosBlockOptions = {}): Block {
  return createManifestBlock(manifest, options)
}

export function betaHeroTodosSantosToProps(data: PayloadBetaHeroTodosSantosDocument): BetaHeroTodosSantosContent {
  return manifestToProps(data)
}
