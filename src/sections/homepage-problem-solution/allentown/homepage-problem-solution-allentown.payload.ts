// @generated structural section — source manifest remains the contract.
import type { Block, CollectionSlug } from 'payload'
import { createManifestBlock, manifestToProps } from '../../../shared/manifest-block.js'
import type { BetaHomepageProblemSolutionAllentownContent, PayloadBetaHomepageProblemSolutionAllentownDocument } from './homepage-problem-solution-allentown.types.js'

const manifest = {
  "slug": "homepage-problem-solution-allentown",
  "title": "Homepage Problem Solution Allentown",
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
    "problemIntro": {
      "kind": "component",
      "componentId": "components/intro/allentown",
      "required": true,
      "localized": true
    },
    "problemItems": {
      "kind": "componentList",
      "componentId": "components/homepage-problem-item/allentown",
      "minItems": 1,
      "required": true,
      "localized": true
    },
    "solutionIntro": {
      "kind": "component",
      "componentId": "components/intro/allentown",
      "required": true,
      "localized": true
    },
    "solutionSteps": {
      "kind": "componentList",
      "componentId": "components/homepage-solution-step/allentown",
      "minItems": 1,
      "required": true,
      "localized": true
    },
    "solutionCtaGroup": {
      "kind": "component",
      "componentId": "components/cta-group/allentown",
      "required": false,
      "localized": true
    }
  }
} as const

export interface CreateBetaHomepageProblemSolutionAllentownBlockOptions { mediaCollection?: CollectionSlug; formCollection?: CollectionSlug }

export function createBetaHomepageProblemSolutionAllentownBlock(options: CreateBetaHomepageProblemSolutionAllentownBlockOptions = {}): Block {
  return createManifestBlock(manifest, options)
}

export function betaHomepageProblemSolutionAllentownToProps(data: PayloadBetaHomepageProblemSolutionAllentownDocument): BetaHomepageProblemSolutionAllentownContent {
  return manifestToProps(data)
}
