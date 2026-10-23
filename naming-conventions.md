# Component naming conventions

This package can contain several implementations of the same UI role. A generic name such as `Hero` becomes ambiguous as soon as a second hero exists. Every component variant therefore has a stable descriptive role and a unique variation name.

Follow the [section developer handoff](DEVELOPER-HANDOFF.md) for the current manifest-first workflow, token contract and generator ownership rules.

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
- Use the same base name for the paired source files; inspect the actual Payload factory for generated maturity prefixes in its stored slug and interface name.
- Do not rename a published variation. A rename is a breaking import and content-model change. Add a new variation instead.

## File and import names

Place all files for one implementation together:

```text
src/
└── sections/
    └── hero/
        └── allentown/
            ├── manifest.json
            ├── README.md
            ├── hero-allentown.astro
            ├── hero-allentown.payload.ts
            ├── hero-allentown.preview.astro
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

`<name>.types.ts` owns the value types shared by Astro and Payload conversion. For example, `HeroContent['intro']` describes the renderer-ready intro rather than a raw Payload document.

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
2. Define and review `manifest.json`, including localized editor fields and renderer-owned runtime props.
3. Create the paired source files and a `README.md` in the component folder; verify the factory's stable stored slug.
4. Keep the README descriptive; the manifest supplies the generated catalogue's title and description.
5. Run `pnpm build` to regenerate exports and compile the package.
6. Add a representative preview and verify the approved states before publishing.

## Catalogue previews

Add an optional `<name>.preview.astro` beside a component when it has representative, static preview content. The GitHub Pages catalogue makes its card clickable and renders this file on a generated detail page.

Preview files are not package exports. They MAY contain component-specific example props, but MUST NOT use production credentials, customer data, or CMS connections. Do not add a preview that invents required props; leave the component listed without a preview until a real example exists.

## Figma links

Record the approved HTTPS Figma URL in `manifest.json` under `figma.url`, with its meaningful frame name in the component documentation. The current generator requires this manifest reference and uses it for catalogue metadata.

The component README may also link to the same design for readers. A README-only link does not replace the manifest reference.

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
