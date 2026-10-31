import type { Block, CollectionSlug } from 'payload'
import { createManifestBlock } from '../../../shared/manifest-block.js'
import { structuralSectionToProps } from '../../../shared/structural-props.js'
import type { PayloadAdapterOptions } from '../../../shared/payload.js'
import type { BetaStepsStageContent, PayloadBetaStepsStageDocument } from './steps-stage.types.js'

const manifest = {
  "slug": "steps-stage",
  "title": "Steps Stage",
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
    "introCtaGroup": {
      "kind": "component",
      "componentId": "components/cta-group/allentown",
      "required": false,
      "localized": true,
      "description": "Optional actions below the introduction.",
      "fields": {
        "buttons": {
          "kind": "ctaGroup",
          "required": false,
          "localized": true,
          "minItems": 0,
          "maxItems": 2,
          "description": "Add zero, one or two actions. Set the style of each action to Primary, Secondary, Clear or Clear base."
        }
      }
    },
    "media": {
      "kind": "media",
      "required": false,
      "localized": true
    },
    "markerType": {
      "kind": "select",
      "required": false,
      "localized": true,
      "defaultValue": "number",
      "options": [
        "number",
        "icon"
      ],
      "description": "Use sequential numbers or each step's Font Awesome Sharp Solid icon. Number mode ignores saved icon names."
    },
    "steps": {
      "kind": "componentList",
      "componentId": "components/step/stage",
      "required": true,
      "localized": true,
      "minItems": 1,
      "fields": {
        "icon": {
          "kind": "text",
          "required": false,
          "localized": true,
          "description": "Font Awesome 7 Sharp Solid icon name, used only when the section selects icon markers. Rendered as SVG without an icon font."
        },
        "title": {
          "kind": "text",
          "required": true,
          "localized": true
        },
        "description": {
          "kind": "richText",
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
              "description": "Add zero, one or two actions. Set the style of each action to Primary, Secondary, Clear or Clear base."
            }
          }
        }
      }
    },
    "listCtaGroup": {
      "kind": "component",
      "componentId": "components/cta-group/allentown",
      "required": false,
      "localized": true,
      "description": "Optional actions below the steps.",
      "fields": {
        "buttons": {
          "kind": "ctaGroup",
          "required": false,
          "localized": true,
          "minItems": 0,
          "maxItems": 2,
          "description": "Add zero, one or two actions. Set the style of each action to Primary, Secondary, Clear or Clear base."
        }
      }
    }
  }
} as const

export interface CreateBetaStepsStageBlockOptions { mediaCollection?: CollectionSlug; formCollection?: CollectionSlug; targetCollections?: CollectionSlug[] }

export function createBetaStepsStageBlock(options: CreateBetaStepsStageBlockOptions = {}): Block {
  return createManifestBlock(manifest, options)
}

export function betaStepsStageToProps(data: PayloadBetaStepsStageDocument, options: PayloadAdapterOptions = {}): BetaStepsStageContent {
  return structuralSectionToProps(data, options)
}
