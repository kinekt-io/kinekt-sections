// @generated Homepage Problem Solution Payload contract from the manifest.
import type { Block, CollectionSlug } from 'payload'
import { createManifestBlock } from '../../../shared/manifest-block.js'
import { ctaGroupToProps, optionalText, requireArray, requireObject, requireText, type PayloadAdapterOptions } from '../../../shared/payload.js'
import { richTextToHtml } from '../../../shared/rich-text.js'
import type { BetaHomepageProblemSolutionAllentownContent, PayloadBetaHomepageProblemSolutionAllentownDocument } from './homepage-problem-solution-allentown.types.js'

const manifest = {
  "slug": "homepage-problem-solution-allentown",
  "title": "Homepage Problem Solution Allentown",
  "status": "prerelease",
  "fields": {
    "problemIntro": {
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
    "problemItems": {
      "kind": "componentList",
      "componentId": "components/homepage-problem-item/allentown",
      "minItems": 1,
      "required": true,
      "localized": true,
      "fields": {
        "icon": {
          "kind": "select",
          "required": true,
          "localized": true,
          "options": [
            "xmark"
          ]
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
        }
      }
    },
    "solutionIntro": {
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
    "solutionSteps": {
      "kind": "componentList",
      "componentId": "components/homepage-solution-step/allentown",
      "minItems": 1,
      "required": true,
      "localized": true,
      "fields": {
        "icon": {
          "kind": "select",
          "required": true,
          "localized": true,
          "options": [
            "microchip",
            "gears",
            "shield-check"
          ]
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
        }
      }
    },
    "solutionCtaGroup": {
      "kind": "ctaGroup",
      "required": false,
      "localized": true
    }
  }
} as const

export interface CreateBetaHomepageProblemSolutionAllentownBlockOptions { mediaCollection?: CollectionSlug; formCollection?: CollectionSlug; targetCollections?: CollectionSlug[] }

export function createBetaHomepageProblemSolutionAllentownBlock(options: CreateBetaHomepageProblemSolutionAllentownBlockOptions = {}): Block {
  return createManifestBlock(manifest, options)
}

const intro = (value: unknown, field: string): Record<string, unknown> => {
  const content = requireObject(value, field)
  return {
    heading: requireText(content.heading, `${field}.heading`),
    ...(optionalText(content.accentHeading, `${field}.accentHeading`) ? { accentHeading: optionalText(content.accentHeading, `${field}.accentHeading`) } : {}),
    ...(content.description ? { description: { html: richTextToHtml(content.description, `${field}.description`) } } : {}),
  }
}

const items = (value: unknown, field: string, allowedIcons: readonly string[]): Record<string, unknown>[] =>
  requireArray(value, field).map((item, index) => {
    const content = requireObject(item, `${field}[${index}]`)
    if (typeof content.icon !== 'string' || !allowedIcons.includes(content.icon)) {
      throw new Error(`${field}[${index}].icon must be one of ${allowedIcons.join(', ')}.`)
    }
    return {
      icon: content.icon,
      title: requireText(content.title, `${field}[${index}].title`),
      description: { html: richTextToHtml(content.description, `${field}[${index}].description`) },
    }
  })

export function betaHomepageProblemSolutionAllentownToProps(data: PayloadBetaHomepageProblemSolutionAllentownDocument, options: PayloadAdapterOptions = {}): BetaHomepageProblemSolutionAllentownContent {
  const block = requireObject(data, 'homepageProblemSolution')
  const ctaGroup = ctaGroupToProps(block.solutionCtaGroup, 'solutionCtaGroup', options)

  return {
    theme: 'dark',
    problemIntro: intro(block.problemIntro, 'problemIntro'),
    problemItems: items(block.problemItems, 'problemItems', ['xmark']),
    solutionIntro: intro(block.solutionIntro, 'solutionIntro'),
    solutionSteps: items(block.solutionSteps, 'solutionSteps', ['microchip', 'gears', 'shield-check']),
    ...(ctaGroup ? {
      solutionCtaGroup: {
        ...(ctaGroup.primary ? { primaryButton: ctaGroup.primary } : {}),
        ...(ctaGroup.secondary ? { secondaryButton: ctaGroup.secondary } : {}),
      },
    } : {}),
  }
}
