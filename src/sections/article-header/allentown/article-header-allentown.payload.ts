// @generated structural section — source manifest remains the contract.
import type { Block, CollectionSlug } from 'payload'
import { createManifestBlock, manifestToProps } from '../../../shared/manifest-block.js'
import type { BetaArticleHeaderAllentownContent, PayloadBetaArticleHeaderAllentownDocument } from './article-header-allentown.types.js'

const manifest = {
  "slug": "article-header-allentown",
  "title": "Article Header Allentown",
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
    "heroMedia": {
      "kind": "component",
      "componentId": "components/content-hero-media/allentown",
      "required": true,
      "localized": true,
      "fields": {
        "sourceType": {
          "kind": "select",
          "required": true,
          "localized": true,
          "options": [
            "image",
            "uploaded-video",
            "external-video"
          ],
          "description": "Select one source. The paired adapter validates the matching media field and never renders multiple source types."
        },
        "image": {
          "kind": "media",
          "required": false,
          "localized": true,
          "description": "Required when Source type is image. Used as the Article hero and its related-content card image."
        },
        "video": {
          "kind": "video",
          "required": false,
          "localized": true,
          "description": "Required when Source type is uploaded-video. Stored in the customer S3-backed Media collection."
        },
        "externalVideoUrl": {
          "kind": "text",
          "required": false,
          "localized": true,
          "description": "Required when Source type is external-video. The adapter validates the supported external provider URL."
        },
        "poster": {
          "kind": "media",
          "required": false,
          "localized": true,
          "description": "Required for either video source. Used before playback and as the Case featured image in related-content cards."
        }
      }
    }
  }
} as const

export interface CreateBetaArticleHeaderAllentownBlockOptions { mediaCollection?: CollectionSlug; formCollection?: CollectionSlug; targetCollections?: CollectionSlug[] }

export function createBetaArticleHeaderAllentownBlock(options: CreateBetaArticleHeaderAllentownBlockOptions = {}): Block {
  return createManifestBlock(manifest, options)
}

export function betaArticleHeaderAllentownToProps(data: PayloadBetaArticleHeaderAllentownDocument): BetaArticleHeaderAllentownContent {
  return manifestToProps(data)
}
