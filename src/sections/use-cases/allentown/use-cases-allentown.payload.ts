// @generated Use Cases Payload contract from the manifest.
import type { Block, CollectionSlug } from 'payload'
import { createManifestBlock } from '../../../shared/manifest-block.js'
import { ctaGroupToProps, optionalSharpSolidIcon, optionalText, requireArray, requireObject, requireText, requireTheme, type PayloadAdapterOptions } from '../../../shared/payload.js'
import { richTextToHtml } from '../../../shared/rich-text.js'
import type { BetaUseCasesAllentownContent, PayloadBetaUseCasesAllentownDocument, UseCasesAllentownItem } from './use-cases-allentown.types.js'

const manifest = {
  "slug": "use-cases-allentown",
  "title": "Use Cases Allentown",
  "status": "prerelease",
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
    "advantageHeading": {
      "kind": "text",
      "required": true,
      "localized": true
    },
    "items": {
      "kind": "componentList",
      "componentId": "components/use-case-item/allentown",
      "required": true,
      "localized": true,
      "minItems": 1,
      "fields": {
        "title": {
          "kind": "text",
          "required": true,
          "localized": true
        },
        "icon": {
          "kind": "text",
          "required": false,
          "localized": true,
          "description": "Optional Font Awesome 7 Sharp Solid icon name rendered before the item title."
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
    }
  }
} as const

export interface CreateBetaUseCasesAllentownBlockOptions { mediaCollection?: CollectionSlug; formCollection?: CollectionSlug; targetCollections?: CollectionSlug[] }

export function createBetaUseCasesAllentownBlock(options: CreateBetaUseCasesAllentownBlockOptions = {}): Block {
  return createManifestBlock(manifest, options)
}

const introToProps = (value: unknown): BetaUseCasesAllentownContent['intro'] => {
  const intro = requireObject(value, 'intro')
  return {
    accentHeading: optionalText(intro.accentHeading, 'intro.accentHeading'),
    heading: requireText(intro.heading, 'intro.heading'),
    ...(intro.description ? { description: { html: richTextToHtml(intro.description, 'intro.description') } } : {}),
  }
}

const itemToProps = (value: unknown, index: number, options: PayloadAdapterOptions): UseCasesAllentownItem => {
  const item = requireObject(value, 'items[' + index + ']')
  const icon = optionalSharpSolidIcon(item.icon, 'items[' + index + '].icon')
  const ctaGroup = ctaGroupToProps(item.ctaGroup, 'items[' + index + '].ctaGroup', options)
  return {
    title: requireText(item.title, 'items[' + index + '].title'),
    ...(icon ? { icon } : {}),
    description: { html: richTextToHtml(item.description, 'items[' + index + '].description') },
    ...(ctaGroup ? { ctaGroup } : {}),
  }
}

export function betaUseCasesAllentownToProps(data: PayloadBetaUseCasesAllentownDocument, options: PayloadAdapterOptions = {}): BetaUseCasesAllentownContent {
  return {
    theme: requireTheme(data.theme),
    intro: introToProps(data.intro),
    advantageHeading: requireText(data.advantageHeading, 'advantageHeading'),
    items: requireArray(data.items, 'items').map((item, index) => itemToProps(item, index, options)),
  }
}
