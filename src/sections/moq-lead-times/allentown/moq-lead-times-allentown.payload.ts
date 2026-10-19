// @generated structural section — source manifest remains the contract.
import type { Block, CollectionSlug } from 'payload'
import { createManifestBlock, manifestToProps } from '../../../shared/manifest-block.js'
import type { BetaMoqLeadTimesAllentownContent, PayloadBetaMoqLeadTimesAllentownDocument } from './moq-lead-times-allentown.types.js'

const manifest = {
  "slug": "moq-lead-times-allentown",
  "title": "MOQ Lead Times Allentown",
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
    "cta": {
      "kind": "component",
      "componentId": "controls/button/allentown",
      "required": false,
      "localized": true
    },
    "moq": {
      "kind": "component",
      "componentId": "components/delivery-fact/allentown",
      "required": true,
      "localized": true
    },
    "leadTimes": {
      "kind": "componentList",
      "componentId": "components/delivery-fact/allentown",
      "required": true,
      "localized": true,
      "minItems": 1
    }
  }
} as const

export interface CreateBetaMoqLeadTimesAllentownBlockOptions { mediaCollection?: CollectionSlug; formCollection?: CollectionSlug }

export function createBetaMoqLeadTimesAllentownBlock(options: CreateBetaMoqLeadTimesAllentownBlockOptions = {}): Block {
  return createManifestBlock(manifest, options)
}

export function betaMoqLeadTimesAllentownToProps(data: PayloadBetaMoqLeadTimesAllentownDocument): BetaMoqLeadTimesAllentownContent {
  return manifestToProps(data)
}
