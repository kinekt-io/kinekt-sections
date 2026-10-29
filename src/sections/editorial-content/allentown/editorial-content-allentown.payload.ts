// @generated structural section — source manifest remains the contract.
import type { Block, CollectionSlug } from 'payload'
import { createManifestBlock, manifestToProps } from '../../../shared/manifest-block.js'
import type { BetaEditorialContentAllentownContent, PayloadBetaEditorialContentAllentownDocument } from './editorial-content-allentown.types.js'

const manifest = {
  "slug": "editorial-content-allentown",
  "title": "Editorial Content Allentown",
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
    "content": {
      "kind": "richText",
      "required": true,
      "localized": true,
      "description": "Payload Lexical content. The paired CMS implementation permits standard headings, paragraphs, lists, links and blockquotes, plus only these inline blocks: components/intro/allentown, components/quote/allentown, components/editorial-media/allentown and components/editorial-columns/allentown."
    }
  }
} as const

export interface CreateBetaEditorialContentAllentownBlockOptions { mediaCollection?: CollectionSlug; formCollection?: CollectionSlug; targetCollections?: CollectionSlug[] }

export function createBetaEditorialContentAllentownBlock(options: CreateBetaEditorialContentAllentownBlockOptions = {}): Block {
  return createManifestBlock(manifest, options)
}

export function betaEditorialContentAllentownToProps(data: PayloadBetaEditorialContentAllentownDocument): BetaEditorialContentAllentownContent {
  return manifestToProps(data)
}
