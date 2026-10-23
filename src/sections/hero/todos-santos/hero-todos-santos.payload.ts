// @generated structural section — source manifest remains the contract.
import type { Block, CollectionSlug } from 'payload'
import { createManifestBlock, manifestToProps } from '../../../shared/manifest-block.js'
import type { BetaHeroTodosSantosContent, PayloadBetaHeroTodosSantosDocument } from './hero-todos-santos.types.js'

const manifest = {
  "slug": "hero-todos-santos",
  "title": "Hero Todos Santos",
  "status": "prerelease",
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
      "minItems": 1,
      "fields": {
        "label": {
          "kind": "text",
          "required": true,
          "localized": true
        },
        "value": {
          "kind": "text",
          "required": true,
          "localized": true
        }
      }
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

export interface CreateBetaHeroTodosSantosBlockOptions { mediaCollection?: CollectionSlug; formCollection?: CollectionSlug; targetCollections?: CollectionSlug[] }

export function createBetaHeroTodosSantosBlock(options: CreateBetaHeroTodosSantosBlockOptions = {}): Block {
  return createManifestBlock(manifest, options)
}

export function betaHeroTodosSantosToProps(data: PayloadBetaHeroTodosSantosDocument): BetaHeroTodosSantosContent {
  return manifestToProps(data)
}
