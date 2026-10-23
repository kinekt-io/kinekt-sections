// @generated structural section — source manifest remains the contract.
import type { Block, CollectionSlug } from 'payload'
import { createManifestBlock, manifestToProps } from '../../../shared/manifest-block.js'
import type { BetaTabsAllentownContent, PayloadBetaTabsAllentownDocument } from './tabs-allentown.types.js'

const manifest = {
  "slug": "tabs-allentown",
  "title": "Tabs Allentown",
  "status": "planned",
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
    "tabs": {
      "kind": "componentList",
      "componentId": "components/tab-item/allentown",
      "required": true,
      "localized": true,
      "minItems": 1,
      "fields": {
        "label": {
          "kind": "text",
          "required": true,
          "localized": true
        },
        "description": {
          "kind": "richText",
          "required": false,
          "localized": true
        },
        "form": {
          "kind": "formReference",
          "required": false,
          "localized": true,
          "description": "The selected Form record owns actions, inputs, validation, submission, success behavior and optional footnote."
        }
      }
    }
  }
} as const

export interface CreateBetaTabsAllentownBlockOptions { mediaCollection?: CollectionSlug; formCollection?: CollectionSlug; targetCollections?: CollectionSlug[] }

export function createBetaTabsAllentownBlock(options: CreateBetaTabsAllentownBlockOptions = {}): Block {
  return createManifestBlock(manifest, options)
}

export function betaTabsAllentownToProps(data: PayloadBetaTabsAllentownDocument): BetaTabsAllentownContent {
  return manifestToProps(data)
}
