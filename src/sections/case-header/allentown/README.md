# Case Header Allentown

Implementation for the [Case Template — 261014 | Tulip - Europe - Desktop - Case Template](https://www.figma.com/design/7rHrxb3twyBvPo9QxkOBly/KSW-1-Tulip-Tech-Website?node-id=5639-524475&t=OtYEVTRRdAJJYQ0v-11).

- Uses semantic `section`, `header`, and `figure` elements; it does not use `StructuralSection`.
- Composes the shared Intro and Content Hero Media contracts.
- Customer logo is optional.
- Hero media selects exactly one image, uploaded video, or safe external video URL. Uploaded video needs a poster.
- Breadcrumb is route-derived, not editable section content.

Provider allow-listing and a Payload-specific media adapter remain the integration boundary; the Astro renderer already has native media markup.