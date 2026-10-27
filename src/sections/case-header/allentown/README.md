# Case Header Allentown

Implementation for the header "Section" of the [Case Template — 261014 | Tulip - Europe - Desktop - Case Template](https://www.figma.com/design/7rHrxb3twyBvPo9QxkOBly/KSW-1-Tulip-Tech-Website?node-id=5639-524477).

- Uses semantic `section`, `header`, and `figure` elements; it does not use `StructuralSection`.
- Composes the shared Intro and Content Hero Media contracts.
- Customer logo is optional.
- Hero media selects exactly one image, uploaded video, or safe external video URL. Uploaded video needs a poster.
- Breadcrumb is route-derived, not editable section content. The page passes the trail as the renderer-only `breadcrumb` prop (`{ label, href? }[]`, last item = current page).
- Hero media renders through `components/content-hero-media/allentown` (16:9; uploaded video gets a progressive play button).

Provider allow-listing and a Payload-specific media adapter remain the integration boundary; the Astro renderer already has native media markup.