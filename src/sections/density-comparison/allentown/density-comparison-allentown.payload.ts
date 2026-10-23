import type { Block, CollectionSlug } from 'payload'
import { createManifestBlock } from '../../../shared/manifest-block.js'
import { structuralSectionToProps } from '../../../shared/structural-props.js'
import type { PayloadAdapterOptions } from '../../../shared/payload.js'
import type { BetaDensityComparisonAllentownContent, PayloadBetaDensityComparisonAllentownDocument } from './density-comparison-allentown.types.js'

const manifest = {
  "slug": "density-comparison-allentown",
  "title": "Density Comparison Allentown",
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
    "comparison": {
      "kind": "component",
      "componentId": "patterns/comparison-table/trinity",
      "required": true,
      "localized": true,
      "fields": {
        "columns": {
          "kind": "infoItems",
          "required": true,
          "localized": true,
          "minItems": 1
        },
        "rows": {
          "kind": "componentList",
          "componentId": "components/comparison-row/trinity",
          "required": true,
          "localized": true,
          "minItems": 1,
          "fields": {
            "feature": {
              "kind": "text",
              "required": true,
              "localized": true
            },
            "cells": {
              "kind": "componentList",
              "componentId": "components/comparison-cell/trinity",
              "required": true,
              "localized": true,
              "minItems": 1,
              "fields": {
                "text": {
                  "kind": "text",
                  "required": true,
                  "localized": true
                },
                "status": {
                  "kind": "select",
                  "required": true,
                  "localized": true,
                  "options": [
                    "positive",
                    "negative"
                  ]
                },
                "icon": {
                  "kind": "text",
                  "required": true,
                  "localized": true,
                  "description": "Font Awesome icon key."
                }
              }
            }
          }
        }
      }
    },
    "cta": {
      "kind": "component",
      "componentId": "controls/button/allentown",
      "required": false,
      "localized": true,
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

export interface CreateBetaDensityComparisonAllentownBlockOptions { mediaCollection?: CollectionSlug; formCollection?: CollectionSlug; targetCollections?: CollectionSlug[] }

export function createBetaDensityComparisonAllentownBlock(options: CreateBetaDensityComparisonAllentownBlockOptions = {}): Block {
  return createManifestBlock(manifest, options)
}

export function betaDensityComparisonAllentownToProps(data: PayloadBetaDensityComparisonAllentownDocument, options: PayloadAdapterOptions = {}): BetaDensityComparisonAllentownContent {
  return structuralSectionToProps(data, options)
}
