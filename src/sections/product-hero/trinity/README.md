# Product Hero Trinity

Prerelease product-list hero based on [Section - Standard pack options/models in Figma](https://www.figma.com/design/7rHrxb3twyBvPo9QxkOBly/KSW-1-Tulip-Tech-Website?node-id=5744-772818&m=dev).

## Contract

The [manifest](manifest.json) reuses Battery Models Trinity's intro, optional catalogue action and repeatable Battery Card Trinity contract. It replaces the callout with a standard optional CTA group below the model list.

- `featuredLabel`: optional localized text between the intro and cards. Empty text omits the label and flightpath.
- `models`: at least one model, including media, title, rich-text description, optional best-for icon/text, one-to-five ratings, required webshop action and optional specification action.
- `ctaGroup`: zero to two actions, with Primary, Secondary, Clear or Clear base styling and Content-or-URL destinations.
- `theme`: defaults to Dark; Light, Semi-light and Semi-dark are also supported.
- `contentWidth`: Standard, 80% or 70% of the fixed desktop content cap, constrained by responsive gutters.
- `headingLevel`: renderer-owned, defaults to `h1`. All editor-owned manifest fields are localized.

## Integration

Register `createProductHeroTrinityBlock({ mediaCollection, targetCollections })` from `@kinekt-io/components/sections/product-hero-trinity.payload` in the consuming Payload layout field. Its block slug is `beta-product-hero-trinity`; the editor label is `PRERELEASE — Product Hero Trinity`.

Convert populated documents with `productHeroTrinityToProps(document, { mediaBaseUrl, contentHref })`. Pass the resulting props to the default Astro export from `@kinekt-io/components/sections/product-hero-trinity.astro`. The `contentHref` resolver must resolve selected content in the current static build.

The factory and adapter reuse Battery Models Trinity's card validation and normalization. Existing Battery Models Trinity data and rendering are unchanged. Consumers still need to register the new block and renderer; adding this package entry does not activate it in a customer CMS.

## Styling and preview

Component-owned, native-nested CSS lives in `product-hero-trinity.astro` inside `<style is:global>`. The renderer reuses Section Intro, Battery Card Trinity, Button Allentown and Subtitle Flight Path. `--kiw--product-hero-trinity-*` variables alias shared spacing, width and theme tokens. Customer colors are not embedded in the section.

The desktop list has three columns from `50rem`; below that breakpoint it stacks into one column. Section padding follows the existing `--section-space-l` convention. Preview copy is fictional.

Run `pnpm dev:catalog` from the repository root and open `/kinekt-sections/components/sections/product-hero/trinity/`. Add `?brand=tulip` to inspect customer tokens. The generated catalogue metadata exposes the 16:10 screenshot at `thumbnails/sections/product-hero/trinity.jpeg`.
