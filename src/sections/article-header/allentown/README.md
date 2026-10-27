# Article Header Allentown

Structural implementation for the [Article Template](https://www.figma.com/design/7rHrxb3twyBvPo9QxkOBly/KSW-1-Tulip-Tech-Website?node-id=5639-526183&t=OtYEVTRRdAJJYQ0v-11), frame **261014 | Tulip - Europe - Desktop - Article Template**.

- Composes the shared Intro and Content Hero Media contracts.
- Breadcrumb and reading time are renderer-derived from content context and body content; neither is editable header copy.
- Image heroes are used for the article featured-card image. Video heroes must provide a poster.

The current generated structural implementation establishes package entrypoints only; reading-time derivation and media source validation need the specialized adapter pass.
