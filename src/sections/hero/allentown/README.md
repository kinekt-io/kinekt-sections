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

## Payload block

`createHeroBlock()` registers the `hero-allentown` block. The editor can set localized text, CTA label, CTA URL, a required image, and an optional mobile image.

Call `heroToProps()` only after Payload has populated the upload relationships. It rejects unresolved upload IDs, missing required fields, invalid dimensions, unsafe URLs, and non-string alt text before Astro renders the block.
