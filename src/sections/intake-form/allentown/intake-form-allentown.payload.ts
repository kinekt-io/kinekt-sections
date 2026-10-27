// @generated structural section — source manifest remains the contract.
import type { Block, CollectionSlug } from 'payload'
import { createManifestBlock, manifestToProps } from '../../../shared/manifest-block.js'
import type { BetaIntakeFormAllentownContent, PayloadBetaIntakeFormAllentownDocument } from './intake-form-allentown.types.js'

const manifest = {
  "slug": "intake-form-allentown",
  "title": "Intake Form Allentown",
  "status": "beta",
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
    "stepsHeading": {
      "kind": "text",
      "required": true,
      "localized": true
    },
    "steps": {
      "kind": "componentList",
      "componentId": "components/intake-step/allentown",
      "required": true,
      "localized": true,
      "minItems": 1,
      "fields": {
        "text": {
          "kind": "text",
          "required": true,
          "localized": true
        }
      }
    },
    "formHeading": {
      "kind": "text",
      "required": false,
      "localized": true
    },
    "form": {
      "kind": "formEmbed",
      "required": true,
      "localized": true,
      "description": "HubSpot embed code. The catalogue renders a safe placeholder through components/form-embed/allentown; the integration owns execution of the embed."
    }
  }
} as const

export interface CreateBetaIntakeFormAllentownBlockOptions { mediaCollection?: CollectionSlug; formCollection?: CollectionSlug; targetCollections?: CollectionSlug[] }

export function createBetaIntakeFormAllentownBlock(options: CreateBetaIntakeFormAllentownBlockOptions = {}): Block {
  return createManifestBlock(manifest, options)
}

export function betaIntakeFormAllentownToProps(data: PayloadBetaIntakeFormAllentownDocument): BetaIntakeFormAllentownContent {
  return manifestToProps(data)
}
