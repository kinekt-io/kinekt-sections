// @generated structural section — source manifest remains the contract.
import type { Block, CollectionSlug } from 'payload'
import { createManifestBlock, manifestToProps } from '../../../shared/manifest-block.js'
import type { BetaThankYouHeroAllentownContent, PayloadBetaThankYouHeroAllentownDocument } from './thank-you-hero-allentown.types.js'

const manifest = {
  "slug": "thank-you-hero-allentown",
  "title": "Thank You Hero Allentown",
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
    "media": {
      "kind": "media",
      "required": false,
      "localized": true
    },
    "nextStepsHeading": {
      "kind": "text",
      "required": true,
      "localized": true
    },
    "nextSteps": {
      "kind": "componentList",
      "componentId": "components/next-step/allentown",
      "required": true,
      "localized": true,
      "minItems": 1,
      "fields": {
        "title": {
          "kind": "text",
          "required": true,
          "localized": true
        },
        "description": {
          "kind": "textarea",
          "required": true,
          "localized": true
        },
        "ctaGroup": {
          "kind": "component",
          "componentId": "components/cta-group/allentown",
          "required": false,
          "localized": true,
          "fields": {
            "buttons": {
              "kind": "ctaGroup",
              "required": false,
              "localized": true,
              "minItems": 0,
              "maxItems": 2,
              "description": "Add zero, one or two actions. Set the style of each action to Primary, Secondary or Clear."
            }
          }
        }
      }
    }
  }
} as const

export interface CreateBetaThankYouHeroAllentownBlockOptions { mediaCollection?: CollectionSlug; formCollection?: CollectionSlug; targetCollections?: CollectionSlug[] }

export function createBetaThankYouHeroAllentownBlock(options: CreateBetaThankYouHeroAllentownBlockOptions = {}): Block {
  return createManifestBlock(manifest, options)
}

export function betaThankYouHeroAllentownToProps(data: PayloadBetaThankYouHeroAllentownDocument): BetaThankYouHeroAllentownContent {
  return manifestToProps(data)
}
