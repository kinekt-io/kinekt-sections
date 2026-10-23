import type { Block, CollectionSlug } from 'payload'
import { createManifestBlock } from '../../../shared/manifest-block.js'
import { structuralSectionToProps } from '../../../shared/structural-props.js'
import type { PayloadAdapterOptions } from '../../../shared/payload.js'
import type { BetaProcessStoryTrinityContent, PayloadBetaProcessStoryTrinityDocument } from './process-story-trinity.types.js'

const manifest = {
  "slug": "process-story-trinity",
  "title": "Process Story Trinity",
  "status": "prerelease",
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
    "items": {
      "kind": "componentList",
      "componentId": "components/process-item/trinity",
      "required": true,
      "localized": true,
      "minItems": 1,
      "description": "Ordered process steps. The renderer owns the active state, timing bar, and pause behaviour."
    }
  }
} as const

export interface CreateBetaProcessStoryTrinityBlockOptions { mediaCollection?: CollectionSlug; formCollection?: CollectionSlug }

export function createBetaProcessStoryTrinityBlock(options: CreateBetaProcessStoryTrinityBlockOptions = {}): Block {
  return createManifestBlock(manifest, options)
}

export function betaProcessStoryTrinityToProps(data: PayloadBetaProcessStoryTrinityDocument, options: PayloadAdapterOptions = {}): BetaProcessStoryTrinityContent {
  return structuralSectionToProps(data, options)
}
