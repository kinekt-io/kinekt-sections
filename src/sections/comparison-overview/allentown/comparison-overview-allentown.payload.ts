import type { Block, CollectionSlug } from 'payload'
import { createManifestBlock } from '../../../shared/manifest-block.js'
import { structuralSectionToProps } from '../../../shared/structural-props.js'
import type { PayloadAdapterOptions } from '../../../shared/payload.js'
import type { BetaComparisonOverviewAllentownContent, PayloadBetaComparisonOverviewAllentownDocument } from './comparison-overview-allentown.types.js'

const manifest = {
  "slug": "comparison-overview-allentown",
  "title": "Comparison Overview Allentown",
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
    "introCta": {
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
    },
    "comparison": {
      "kind": "component",
      "componentId": "patterns/comparison-table/allentown",
      "required": true,
      "localized": true,
      "fields": {
        "columns": {
          "kind": "infoItems",
          "required": true,
          "localized": true,
          "minItems": 1,
          "description": "Product column labels."
        },
        "rows": {
          "kind": "componentList",
          "componentId": "components/comparison-row/allentown",
          "required": true,
          "localized": true,
          "minItems": 1,
          "description": "Each row must provide exactly one cell for every column.",
          "fields": {
            "feature": {
              "kind": "text",
              "required": true,
              "localized": true
            },
            "cells": {
              "kind": "componentList",
              "componentId": "components/comparison-cell/allentown",
              "required": true,
              "localized": true,
              "minItems": 1,
              "fields": {
                "type": {
                  "kind": "select",
                  "required": true,
                  "localized": true,
                  "options": [
                    "text",
                    "status"
                  ]
                },
                "text": {
                  "kind": "text",
                  "required": false,
                  "localized": true
                },
                "status": {
                  "kind": "select",
                  "required": false,
                  "localized": true,
                  "options": [
                    "positive",
                    "negative"
                  ]
                },
                "icon": {
                  "kind": "text",
                  "required": false,
                  "localized": true,
                  "description": "Required for status. Font Awesome icon key."
                }
              }
            }
          }
        }
      }
    },
    "callout": {
      "kind": "component",
      "componentId": "components/callout/allentown",
      "required": true,
      "localized": true,
      "fields": {
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
        "ctaGroup": {
          "kind": "component",
          "componentId": "components/cta-group/allentown",
          "required": true,
          "localized": true,
          "fields": {
            "primaryButton": {
              "kind": "cta",
              "required": false,
              "localized": true,
              "description": "Optional primary Button component part."
            },
            "secondaryButton": {
              "kind": "cta",
              "required": false,
              "localized": true,
              "description": "Optional secondary Button component part."
            }
          }
        }
      }
    }
  }
} as const

export interface CreateBetaComparisonOverviewAllentownBlockOptions { mediaCollection?: CollectionSlug; formCollection?: CollectionSlug; targetCollections?: CollectionSlug[] }

export function createBetaComparisonOverviewAllentownBlock(options: CreateBetaComparisonOverviewAllentownBlockOptions = {}): Block {
  return createManifestBlock(manifest, options)
}

export function betaComparisonOverviewAllentownToProps(data: PayloadBetaComparisonOverviewAllentownDocument, options: PayloadAdapterOptions = {}): BetaComparisonOverviewAllentownContent {
  return structuralSectionToProps(data, options)
}
