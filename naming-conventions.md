# Component naming conventions

This package can contain several implementations of the same UI role. A generic name such as `Hero` becomes ambiguous as soon as a second hero exists. Every component variant therefore has a stable descriptive role and a unique variation name.

## Name a component

Use lowercase kebab case:

```text
<role>-<variation>
```

Examples:

```text
hero-allentown
hero-trinity
hero-todos-santos
card-cold-harbor
```

- `role` describes the interface role: `hero`, `card`, `gallery`, `quote`, or `cta`.
- `variation` identifies one implementation of that role. It does not describe a client, a page, or temporary campaign content.
- A variation name MUST be unique within its role.
- Use the same base name for the Astro renderer, Payload adapter, shared types, Payload block slug, and Payload interface name.
- Do not rename a published variation. A rename is a breaking import and content-model change. Add a new variation instead.

## File and import names

Place all files for one implementation together:

```text
src/
└── sections/
    └── hero/
        └── allentown/
            ├── hero-allentown.astro
            ├── hero-allentown.payload.ts
            └── hero-allentown.types.ts
```

This produces these public imports:

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

The `.payload` and `.types` suffixes are package entrypoint names. Their source files remain TypeScript: `.payload.ts` and `.types.ts`.

## Shared type contract

`<name>.types.ts` owns names and value types shared by Astro and Payload. For example, `HeroContent['eyebrow']` is the same `string` in the renderer and the CMS-to-render conversion.

Payload has additional document types for its own lifecycle:

- text fields can be missing or `null` in drafts;
- an upload relationship can be an ID before the media document is populated;
- Astro receives a complete image with URL, dimensions, and alt text.

Keep those Payload-only representations in the same `<name>.types.ts`. Do not duplicate shared text-field types in `<name>.payload.ts` or `<name>.astro`.

## Payload names

The Payload block slug uses the component base name:

```ts
slug: 'hero-allentown'
interfaceName: 'HeroAllentown'
```

Use PascalCase for the `interfaceName`. Keep the slug stable after content exists in a CMS. Changing it requires a data migration for stored `blockType` values.

## Adding a variation

1. Choose an unused variation from the list below.
2. Create the three paired source files and a `README.md` in a new component folder.
3. Use the same base name in all source filenames, the Payload slug, and interface name.
4. Put the component name in the README heading and a one-paragraph description directly below it. The generated catalogue uses both.
5. Run `pnpm build`.
6. Add a real rendering example before publishing when the component has required props or runtime behaviour.

The build discovers `.astro`, `.payload.ts`, and `.types.ts` files beneath `src/` and generates `package.json` exports. Do not edit `exports` by hand. Two files that produce the same public import path stop the build.

## Reserved variation names

Use these names in order for new variants unless an existing published name already needs to be retained:

1. Allentown
2. Trinity
3. Todos Santos
4. Cold Harbor
5. Lucknow
6. St. Pierre
7. Coleman
8. Waynesboro
9. Cork
10. Molde
11. Cairns
12. Bodo
13. Zurich
14. Culpepper
15. Bellingham
16. Billings
17. Yakima
18. Loveland
19. Merida
20. Sopchoppy
21. Vilnius
22. Rhodes
23. Wellington
24. Dranesville
25. Astoria
