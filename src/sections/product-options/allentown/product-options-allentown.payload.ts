import type { Block, CollectionSlug } from 'payload'
import { createManifestBlock } from '../../../shared/manifest-block.js'
import { richTextToHtml } from '../../../shared/rich-text.js'
import { ctaGroupToProps, mediaToProps, optionalText, requireArray, requireObject, requireText, requireTheme, type PayloadAdapterOptions } from '../../../shared/payload.js'
import type { ProductOptionsAllentownContent, PayloadProductOptionsAllentownDocument } from './product-options-allentown.types.js'

const manifest = {
  "slug": "product-options-allentown",
  "title": "Product Options Allentown",
  "status": "beta",
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
    "ctas": {
      "kind": "ctaGroup",
      "required": false,
      "localized": true,
      "description": "Optional primary and secondary actions below the introduction."
    },
    "options": {
      "kind": "componentList",
      "componentId": "components/option-card/allentown",
      "required": true,
      "localized": true,
      "minItems": 1
    },
    "form": {
      "kind": "formEmbed",
      "required": false,
      "localized": true,
      "description": "HubSpot embed code. The catalogue renders a safe placeholder through components/form-embed/allentown; the integration owns execution of the embed."
    }
  }
} as const

export interface CreateBetaProductOptionsAllentownBlockOptions { mediaCollection?: CollectionSlug; formCollection?: CollectionSlug }

export function createBetaProductOptionsAllentownBlock(options: CreateBetaProductOptionsAllentownBlockOptions = {}): Block {
  return createManifestBlock(manifest, options)
}

function formToProps(value: PayloadProductOptionsAllentownDocument['form']): ProductOptionsAllentownContent['form'] | undefined {
  if (value === undefined || value === null) return undefined
  return optionalText(value, 'form')
}

export function betaProductOptionsAllentownToProps(data: PayloadProductOptionsAllentownDocument, options: PayloadAdapterOptions = {}): ProductOptionsAllentownContent {
  const intro = requireObject(data.intro, 'intro')
  const ctas = ctaGroupToProps(data.ctas, 'ctas')
  const form = formToProps(data.form)

  return {
    theme: requireTheme(data.theme),
    intro: {
      accentHeading: optionalText(intro.accentHeading, 'intro.accentHeading'),
      heading: requireText(intro.heading, 'intro.heading'),
      ...(intro.description ? { description: { html: richTextToHtml(intro.description, 'intro.description') } } : {}),
    },
    ...(ctas ? { ctas } : {}),
    options: requireArray(data.options, 'options').map((item, index) => {
      const option = requireObject(item, `options[${index}]`)
      const benefits = option.benefits === undefined || option.benefits === null
        ? option.benefits
        : requireArray(option.benefits, `options[${index}].benefits`).map((benefit, benefitIndex) =>
            requireText(benefit, `options[${index}].benefits[${benefitIndex}]`),
          )

      return {
        image: mediaToProps(option.image, `options[${index}].image`, options),
        title: requireText(option.title, `options[${index}].title`),
        description: requireText(option.description, `options[${index}].description`),
        ...(benefits === undefined ? {} : { benefits }),
      }
    }),
    ...(form === undefined ? {} : { form }),
  }
}
