/** Related selection extends the existing expanded manifest schema. */
import type { Block, CollectionSlug } from 'payload'
import { createManifestBlock } from '../../../shared/manifest-block.js'
import { withRelatedContentSelection } from './related-content-allentown.contract.js'
export { betaRelatedContentAllentownToProps } from './related-content-allentown.contract.js'
export type { RelatedContentSelectionMode } from './related-content-allentown.contract.js'

const manifest = {
  "slug": "related-content-allentown",
  "title": "Related Content Allentown",
  "status": "prerelease",
  "fields": {
    "cardReadMoreIcon": {
      "kind": "text",
      "required": false,
      "localized": true,
      "description": "Optional installed CTA icon for every related-content card Read More link. Empty uses chevron-right."
    },
    "contentWidth": {
      "kind": "select",
      "required": false,
      "localized": true,
      "defaultValue": "standard",
      "options": [
        "standard",
        "80",
        "70",
        "50"
      ],
      "description": "Maximum content width: Standard (100%), 80%, 70%, or 50%."
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
    "selectionMode": {
      "kind": "select",
      "required": false,
      "localized": true,
      "options": [
        "automatic",
        "manual"
      ],
      "description": "Automatic when left empty: show related published Articles selected by the CMS request path. Choose Manual to select published content in display order."
    },
    "contentSources": {
      "kind": "contentReferenceList",
      "required": false,
      "localized": true,
      "minItems": 0,
      "description": "Manual selection only. Select one or more published content items in display order. In Automatic mode, leave this empty; the CMS request path supplies matching related Articles."
    },
    "cta": {
      "kind": "component",
      "componentId": "controls/button/allentown",
      "required": false,
      "localized": true,
      "description": "Optional Content-or-URL overview action.",
      "fields": {
        "cta": {
          "kind": "cta",
          "required": true,
          "localized": true
        }
      }
    }
  }
} as const

export interface CreateBetaRelatedContentAllentownBlockOptions { mediaCollection?: CollectionSlug; formCollection?: CollectionSlug; faqCollection?: CollectionSlug; targetCollections?: CollectionSlug[] }

export function createBetaRelatedContentAllentownBlock(options: CreateBetaRelatedContentAllentownBlockOptions = {}): Block {
  return withRelatedContentSelection(createManifestBlock(manifest, options))
}
