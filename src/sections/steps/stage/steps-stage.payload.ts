// @generated structural section — source manifest remains the contract.
import type { Block, CollectionSlug } from 'payload'
import { createManifestBlock, manifestToProps } from '../../../shared/manifest-block.js'
import type { BetaStepsStageContent, PayloadBetaStepsStageDocument } from './steps-stage.types.js'

const manifest = {
  "slug": "steps-stage",
  "title": "Steps Stage",
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
    "media": {
      "kind": "media",
      "required": false,
      "localized": true
    },
    "steps": {
      "kind": "componentList",
      "componentId": "components/step/stage",
      "required": true,
      "localized": true,
      "minItems": 1
    }
  }
} as const

export interface CreateBetaStepsStageBlockOptions { mediaCollection?: CollectionSlug; formCollection?: CollectionSlug }

export function createBetaStepsStageBlock(options: CreateBetaStepsStageBlockOptions = {}): Block {
  return createManifestBlock(manifest, options)
}

export function betaStepsStageToProps(data: PayloadBetaStepsStageDocument): BetaStepsStageContent {
  return manifestToProps(data)
}
