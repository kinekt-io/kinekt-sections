# Hero Allentown

A two-column Kinekt homepage hero with a coral highlighted phrase, CTA, and separate desktop and mobile image fields. It is the first hero variation in this package.

## Public imports

```ts
import HeroAllentown from '@kinekt-io/components/sections/hero-allentown.astro'

import {
  createHeroBlock,
  heroToProps,
} from '@kinekt-io/components/sections/hero-allentown.payload'

import type {
  HeroContent,
  PayloadHeroDocument,
} from '@kinekt-io/components/sections/hero-allentown.types'
```

## Content contract

`HeroContent` requires an eyebrow, title, description, CTA, and desktop image. `highlight`, `titleSuffix`, and `mobileImage` are optional.

The title accepts line breaks. The renderer splits `title` on `\n` and renders each line separately. The highlighted phrase follows the title.

The renderer requires an image URL, alt text, and positive width and height. It rejects unsafe CTA and image URLs. The mobile image is selected at `767px` and below.

## Catalogue preview

`hero-allentown.preview.astro` provides representative static content for the GitHub Pages catalogue. It imports and renders the component directly; it is not a package entrypoint or a production page.

## Figma

https://www.figma.com/design/nysBrgsDUulJAWpQ8G6n0C/KI-51-Kinekt-strategy--identity--website-and-marketing?node-id=2069-11170&t=PsKz3ufuSrw4ho5z-4

## Payload block

`createHeroBlock()` registers the `hero-allentown` block. The editor can set localized text, CTA label, CTA URL, a required image, and an optional mobile image.

Call `heroToProps()` only after Payload has populated the upload relationships. It rejects unresolved upload IDs, missing required fields, invalid dimensions, unsafe URLs, and non-string alt text before Astro renders the block.
