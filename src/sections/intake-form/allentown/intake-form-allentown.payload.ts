// @generated structural section — source manifest remains the contract.
import type { Block, CollectionSlug } from 'payload'
import { createManifestBlock, manifestToProps } from '../../../shared/manifest-block.js'
import type { BetaIntakeFormAllentownContent, PayloadBetaIntakeFormAllentownDocument } from './intake-form-allentown.types.js'

const manifest = {
  "slug": "intake-form-allentown",
  "title": "Intake Form Allentown",
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
      "minItems": 1
    },
    "formHeading": {
      "kind": "text",
      "required": false,
      "localized": true
    },
    "form": {
      "kind": "formReference",
      "required": true,
      "localized": true,
      "description": "Only active Battery Intake forms available to the current region are selectable. The Form record owns fields, validation, scheduling and submission."
    }
  }
} as const

export interface CreateBetaIntakeFormAllentownBlockOptions { mediaCollection?: CollectionSlug; formCollection?: CollectionSlug }

export function createBetaIntakeFormAllentownBlock(options: CreateBetaIntakeFormAllentownBlockOptions = {}): Block {
  return createManifestBlock(manifest, options)
}

export function betaIntakeFormAllentownToProps(data: PayloadBetaIntakeFormAllentownDocument): BetaIntakeFormAllentownContent {
  return manifestToProps(data)
}
