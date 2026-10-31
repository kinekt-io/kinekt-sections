// @generated structural section — source manifest remains the contract.
import type { Block, CollectionSlug } from 'payload'
import { createManifestBlock, manifestToProps } from '../../../shared/manifest-block.js'
import type { BetaProjectGlanceAllentownContent, PayloadBetaProjectGlanceAllentownDocument } from './project-glance-allentown.types.js'

const manifest = {
  "slug": "project-glance-allentown",
  "title": "Project Glance Allentown",
  "status": "prerelease",
  "fields": {
    "contentWidth": {
      "kind": "select",
      "required": false,
      "localized": true,
      "defaultValue": "standard",
      "options": [
        "standard",
        "80",
        "70"
      ],
      "description": "Maximum content width: Standard (100%), 80%, or 70%."
    },
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
    "heading": {
      "kind": "text",
      "required": true,
      "localized": true,
      "description": "Section heading, for example Project at a glance."
    },
    "facts": {
      "kind": "componentList",
      "componentId": "components/key-fact/allentown",
      "required": true,
      "localized": true,
      "minItems": 1,
      "description": "Repeatable labelled project facts. The three-column desktop arrangement and mobile stacking are renderer-owned.",
      "fields": {
        "label": {
          "kind": "text",
          "required": true,
          "localized": true,
          "description": "Short fact label, for example Challenge, Solution or Result."
        },
        "description": {
          "kind": "richText",
          "required": true,
          "localized": true,
          "description": "Concise explanation of the fact."
        }
      }
    }
  }
} as const

export interface CreateBetaProjectGlanceAllentownBlockOptions { mediaCollection?: CollectionSlug; formCollection?: CollectionSlug; targetCollections?: CollectionSlug[] }

export function createBetaProjectGlanceAllentownBlock(options: CreateBetaProjectGlanceAllentownBlockOptions = {}): Block {
  return createManifestBlock(manifest, options)
}

export function betaProjectGlanceAllentownToProps(data: PayloadBetaProjectGlanceAllentownDocument): BetaProjectGlanceAllentownContent {
  return manifestToProps(data)
}
