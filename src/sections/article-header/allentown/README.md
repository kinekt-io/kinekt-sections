# Article Header Allentown

Implementation for the [Article Template — 261014 | Tulip - Europe - Desktop - Article Template](https://www.figma.com/design/7rHrxb3twyBvPo9QxkOBly/KSW-1-Tulip-Tech-Website?node-id=5639-526183&t=OtYEVTRRdAJJYQ0v-11).

- Uses semantic `section`, `header`, and `figure` elements; it does not use `StructuralSection`.
- Composes the shared Intro and Content Hero Media contracts.
- Breadcrumb and reading time are renderer-derived from route and article body; neither is editable header copy.
- The image hero supplies the article’s featured-card image. Video heroes need a poster.

Reading-time derivation and provider allow-listing belong in the Payload/frontend adapter, not in editor-owned section data.