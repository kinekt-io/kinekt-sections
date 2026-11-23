# Related Content Allentown

Implementation for the [Case Template — 261014 | Tulip - Europe - Desktop - Case Template](https://www.figma.com/design/7rHrxb3twyBvPo9QxkOBly/KSW-1-Tulip-Tech-Website?node-id=5639-524475&t=OtYEVTRRdAJJYQ0v-11) and [Article Template — 261014 | Tulip - Europe - Desktop - Article Template](https://www.figma.com/design/7rHrxb3twyBvPo9QxkOBly/KSW-1-Tulip-Tech-Website?node-id=5639-526183&t=OtYEVTRRdAJJYQ0v-11).

The section frame is "Section - Featured insights" in both templates: [Article Template 5639:526230](https://www.figma.com/design/7rHrxb3twyBvPo9QxkOBly/KSW-1-Tulip-Tech-Website?node-id=5639-526230) and [Case Template 5639:525272](https://www.figma.com/design/7rHrxb3twyBvPo9QxkOBly/KSW-1-Tulip-Tech-Website?node-id=5639-525272) (identical, semi-light).

- The localized **Related content selection** uses **Automatic** when unset. It has no stored default, so existing records need no backfill. The CMS request path supplies up to three published, Region- and locale-scoped Article cards matching the current Article type and, when present, overlapping Subjects. It excludes the current Article and orders candidates by publication date, newest first.
- **Manual** is an override. It requires one or more editor-ordered, published relationships from the configured content collections. The picker is hidden in Automatic mode.
- The shared Payload entrypoint keeps `createBetaRelatedContentAllentownBlock({ targetCollections, formCollection })`. It extends the existing manifest-built schema only for selection behavior, preserving reusable nested CTA fields, manual row fields, media options, and existing routable targets.
- The integration adapter receives renderer-shaped `contentSources` from the CMS request path. The Astro renderer does not query content or synthesize cards.
- Automatic selection can resolve to no cards. The section still renders its intro and optional overview CTA without a phantom card.
- Each resolved card derives its title, excerpt, image, metadata, and canonical route from the selected record. Automatic mode selects Articles; Manual mode retains all configured routable content collections.
- The design is an equal-card related-posts grid, not the existing Featured Insights featured/recent arrangement.
- The overview CTA is independently optional and uses the shared Content-or-URL Button contract.