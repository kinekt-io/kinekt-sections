# Kinekt components

`@kinekt-io/components` contains paired Astro renderers and Payload block definitions. Each component implementation has separate public Astro, Payload, and type entrypoints.

Source repository: [`kinekt-io/kinekt-sections`](https://github.com/kinekt-io/kinekt-sections).

## Install a fixed GitHub release

Install the package in each separate consumer application:

- the Astro application imports `.astro` renderers and, when needed, component conversion helpers;
- the Payload application imports `.payload` block definitions;
- Astro MUST fetch content from the CMS API. It MUST NOT import a Payload config or source file directly.

### Prerequisites

- Node.js `>=22.12.0`.
- pnpm `10.18.0`.

### Install

The public repository is the distribution source. Pin a release tag; never depend on `main`.

```bash
pnpm add github:kinekt-io/kinekt-sections#components-v26.9.26
```

The installed package remains named `@kinekt-io/components`, so imports are stable:

```ts
import { createHeroBlock } from '@kinekt-io/components/sections/hero-allentown.payload'
```

Commit both `package.json` and `pnpm-lock.yaml`. A site updates only when its Git dependency is deliberately changed to a new release tag.

## Use a component

The Allentown hero currently exports three entries:

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

### Payload application

Register the block in the existing page-layout field:

```ts
import { createHeroBlock } from '@kinekt-io/components/sections/hero-allentown.payload'

{
  name: 'layout',
  type: 'blocks',
  blocks: [createHeroBlock({ mediaCollection: 'media' })],
}
```

The media collection must provide populated media documents with `url`, `width`, `height`, and `alt`. The block uses the stable Payload `blockType` value `hero-allentown`.

### Astro application

Fetch the published page from the separate CMS process with relationship depth sufficient to populate media. Convert the populated hero block before rendering it:

```astro
---
import HeroAllentown from '@kinekt-io/components/sections/hero-allentown.astro'
import { heroToProps } from '@kinekt-io/components/sections/hero-allentown.payload'
import type { PayloadHeroDocument } from '@kinekt-io/components/sections/hero-allentown.types'

const response = await fetch(
  'https://cms.example.test/api/pages?where[slug][equals]=home&depth=1&locale=en',
)

if (!response.ok) throw new Error('Could not load the homepage from Payload.')

const page = (await response.json()).docs[0]
const hero = page.layout.find(
  (block: PayloadHeroDocument) => block.blockType === 'hero-allentown',
)

if (!hero) throw new Error('The homepage has no Allentown hero block.')
---

<HeroAllentown {...heroToProps(hero, { mediaBaseUrl: 'https://cms.example.test' })} />
```

`heroToProps()` rejects missing editor-required fields, unresolved media IDs, unsafe URLs, invalid dimensions, and absent alt text. Do not bypass it by casting the CMS document to Astro props.

## Wireframe styling and site token overrides

Shared sections use the canonical contract in [`src/styles/wireframe-tokens.css`](src/styles/wireframe-tokens.css), based on the supplied wireframe token file. Defaults are grayscale with system fonts. Customer colors and fonts belong in one customer stylesheet, not in section renderers.

Import the shared canonical tokens once in the consuming layout:

```ts
import '@kinekt-io/components/styles/wireframe-tokens.css'
import '../styles/customer-tokens.css'
```

Each section renderer owns its semantic aliases, theme fallbacks, reset, typography and layout in Astro `<style is:global>` blocks; static token redeclarations never belong in HTML `style` attributes. Every selector is anchored to its owning component root. Reusable children keep low-specificity global bases so root-anchored parent overrides win without cross-component leakage. Canonical defaults are inside `@layer kinekt.tokens`; unlayered customer declarations take precedence even when loaded before those defaults. Use root declarations for canonical inputs and a component class for component-specific overrides:

```css
:root {
  --primary-ultra-dark: #20103b;
  --primary-dark: #382354;
  --neutral-ultra-light: #fff8eb;
  --neutral-light: #f0e4d1;
  --heading-font-family: Georgia, serif;
  --text-font-family: system-ui, sans-serif;
  --desktop-content-width: 75rem;
  --desktop-section-gutter: 5rem;
  --mobile-section-gutter: 1.25rem;
  --desktop-base-spacing-value: 1.75rem;
  --mobile-base-spacing-value: 1.125rem;
  --buttons-has-radius: 1;
  --buttons-radius: var(--radius-m);
}

.hero-allentown {
  --kiw--hero-allentown-block-space: var(--section-space-m);
  --kiw--hero-allentown-gap: var(--space-xs);
}

.button {
  --kiw--button-allentown-radius: var(--radius-l);
}
```

### Fluid values and radii

`--content-width`, `--website-width`, `--section-gutter`, `--container-gap`, `--content-gap`, `--grid-gap`, width/spacing scales, heading sizes, text sizes and input height interpolate between their mobile and desktop endpoints. Values clamp outside the fluid interval. Website width derives from content width plus both gutters; `--fluid-min-width` and `--fluid-max-width` define the interpolation interval.

Override the `--mobile-*` and `--desktop-*` inputs rather than copying their equations. Container, content and grid gaps have independent endpoint pairs, such as `--mobile-grid-gap` and `--desktop-grid-gap`. Equal endpoints produce a constant value. The calculations use CSS typed arithmetic and `pow()`; runtime verification currently covers Chromium, not every browser engine.

Radius values are `--radius-none` (0), `--radius-xs` (2px), `--radius-s` (4px), `--radius-m` (8px), `--radius-l` (16px), `--radius-xl` (24px) and `--radius-xxl` (32px), expressed in rem. Buttons multiply their selected radius by `--buttons-has-radius`: `0` disables rounding, `1` enables it. The wireframe default is `0`.

### Section content widths

Every section exposes the localized Payload field **Content width**: `standard`, `80`, or `70`. The same choices are available in both catalogue inspectors. Omitted or null values use `standard`; existing content needs no migration.

These are fixed maximum content widths based on `--desktop-content-width`, not percentages of the viewport: the default 90rem base produces 90rem, 72rem, and 63rem (1440px, 1152px, and 1008px at a 16px root). Containers use the available width until their selected cap is reached; gutters are additional and remain responsive. Main containers no longer impose a second, narrower section-specific cap. Internal columns and deliberate text-reading limits still belong to the component.

Astro receives `contentWidth` and emits `data-kinekt-content-width`. Each section owns the preset rules in `<style is:global>`, mapping the selection to `--kinekt-section-content-width` and `--kinekt-component-content-width`. Keep these rules in new section renderers and use `sectionContentWidthField()` in their Payload factories. Backgrounds and full-bleed media do not inherit the narrower content cap. Hero Trinity's copy fills its content container below 50rem and uses half of it on desktop.

### Component defaults and theme roles

Each section root carries `data-kinekt-section`. Its owning Astro component maps `--kiw--<section-slug>-<role>` overrides to canonical defaults in a static root rule inside its `<style is:global>` block; static mappings never use a root `style` attribute. Renderers define additional component aliases beside those styles. Use the nearest scale value instead of introducing a second spacing or typography scale.

Hero Trinity's image frame fills the available width up to the site-width token (`--website-width` by default), then remains centered at that width. It does not use the narrower `--content-width` as its frame limit. `--kiw--hero-trinity-site-width` and the explicit `--kiw--hero-trinity-frame-width` hook support component-specific limits.

The four semantic themes retain their meaning: `light` uses `--neutral-ultra-light`, `semi-light` uses `--neutral-light`, `dark` uses `--primary-ultra-dark`, and `semi-dark` uses `--primary-dark`. Existing explicit `--kinekt-section-*` hooks remain available; old generic `--kinekt-color-*`, `--kinekt-font-*` and `--kinekt-space-*` site contracts have been replaced.

Keep component defaults low-specificity while exceeding generic `:where([data-kinekt-section])` defaults. Use a root-class selector in `<style is:global>` where needed, and keep each component's layout and responsive rules beside that component. Never point a bridged component alias back to the semantic variable that consumes it: that creates a CSS custom-property cycle.

The token migration is part of this source revision. Installing it through a published package still requires an authorized new package release and updated consumer pins; older consumer pins do not provide the new CSS exports.

## Interactions

The structural renderers now activate the renderer-owned behaviours recorded in their manifests:

- Accordion Item, Product Detail Item and Step lists use native `<details>` disclosures. The first item is open server-side; a small enhancement keeps each declared group single-open.
- Tabs use the WAI-ARIA tab pattern with mouse, arrow-key, `Home` and `End` navigation. The first panel remains visible without JavaScript.
- Case Study Carousel uses [`embla-carousel`](https://www.embla-carousel.com/): touch/drag support, previous/next buttons, disabled endpoint controls and an announced slide position. Cards remain a readable list before JavaScript.
- Insight Index uses Pagefind’s JavaScript API for its text search, scoped by `pagefindFilters` and the selected Media type / Subject filters (OR). Result URLs are matched to the server-rendered cards, and the facets, sorting and four-per-page pagination run on that list. When the Pagefind bundle is unavailable, the same query falls back to the cards’ title and excerpt. A consumer can replace the search by setting `section.kinektInsightIndexSearch` to a function that returns result URLs.

The shared package includes Embla because its API controls the generated carousel. Pagefind is deliberately not bundled: it must index the consuming frontend’s completed static output. Add Pagefind after the Astro build and pass the actual bundle location when it differs from `/pagefind/pagefind.js`:

```astro
<InsightIndex
  pagefindUrl="/pagefind/pagefind.js"
  pagefindFilters={{ region: "eu", locale: "en" }}
  {...insightIndexProps}
/>
```

The consumer’s indexed article layouts must expose the governed metadata, for example `data-pagefind-filter="type:Case"` and `data-pagefind-filter="subject:Drone"`. `pagefindFilters` scopes this component to the active region and locale; its selected Type and Subject filters use the manifest’s OR behaviour.

## Add a component

Start with the [section developer handoff](DEVELOPER-HANDOFF.md). It covers this repository's manifest, paired Astro/Payload contract, token usage, previews, checks and GitHub workflows. See [naming conventions](naming-conventions.md) for role and variation names.

1. Review the approved design and define `manifest.json` before implementing its editor-owned fields or runtime props.
2. Add the paired `<name>.astro`, `<name>.payload.ts` and `<name>.types.ts` entries under `src/<category>/<role>/<variation>/`.
3. Keep manifest fields, native Payload fields, adapter output and Astro props consistent; inspect generator ownership before editing generated files.
4. Document behavior in the component `README.md`; catalogue title, description, tags and Figma reference come from the manifest.
5. Add `<name>.preview.astro` with realistic fictional content and the required states; previews are not public package entrypoints.
6. Regenerate exports, run the checks below and inspect the actual responsive preview.
7. Publish only after authorization, with a new immutable package version.

The build discovers entrypoints and rewrites `package.json` exports and catalogue metadata. Do not edit either generated output manually. The implemented manifest checks are not full JSON Schema validation.

## Component maturity and release stages

Component maturity is separate from publishing the package. A package can contain components at different stages; publishing a version does not automatically mark every component as released.

### Review gates

Use these human review gates when promoting a component. The tooling does not assess readiness or advance the stage automatically.

| Stage | Manifest status | Intended use and promotion gate |
| --- | --- | --- |
| Alpha | `alpha` | Early design and content-contract review; structure and fields may change, so do not treat it as a stable consumer contract. |
| Beta | `beta` | Paired Astro/Payload implementation and preview work; use it for integration testing while resolving contract, responsive and interaction issues. |
| Prerelease | `prerelease` | Release candidate: approved scope is implemented, field parity and localization are checked, and responsive, theme, optional-content and accessibility behavior have been exercised. |
| Release | `released` | Maintainer-approved stable contract with passing checks and a documented release; breaking changes require an explicit migration or a new variation. |

Use the spelling `prerelease`, including `PRERELEASE` in display labels. `planned` and `deprecated` are additional lifecycle values, not synonyms for alpha or release.

### What the generator actually does

The current generated Payload factory has these observable behaviors:

| `manifest.status` | Generated display label | Stored block slug |
| --- | --- | --- |
| `alpha` | `BETA — <Title>` | `beta-<slug>` |
| `beta` | `BETA — <Title>` | `beta-<slug>` |
| `prerelease` | `PRERELEASE — <Title>` | `beta-<slug>` |
| `released` | `<Title>` without a maturity prefix | `<slug>` |

**Current limitations:** alpha has no separate generated `ALPHA` label. The string `release` passes metadata validation but does not select the stable generator branch; it still produces a `BETA` label and `beta-` slug. Use `released` for the release stage in generated manifests.

Handwritten adapters can preserve existing stable slugs and explicitly defined labels. Read More, for example, has beta metadata but uses `read-more-allentown`. Always inspect the actual factory rather than inferring the stored identifier from the stage.

### Promote without breaking stored content

1. Confirm the next stage's review gate and update `manifest.status` plus matching catalogue tags.
2. Check handwritten Payload labels and documentation; they do not automatically follow manifest metadata.
3. Regenerate exports and inspect generated names, interface names and block slugs.
4. If a stored slug changes, plan and apply the coordinated content/caller migration before exposing the new contract; do not silently rename existing CMS blocks.
5. Run the package checks and actual preview scenarios before approval.

For generated components, changing `prerelease` to `released` removes the `beta-` slug prefix. That can be a breaking content-model change even when the visual design is unchanged.

### Keep the version fields distinct

- `schemaVersion` identifies the manifest format; the current value is `1`.
- `manifest.status` identifies that component's maturity.
- `manifest.version` records component metadata using the validator's supported CalVer forms: `YY.MM.revision` or `YY.MM.revision-beta.index`.
- `package.json.version` identifies the installable package and must be unique for every publication.

Do not invent `-alpha` or `-prerelease` manifest version suffixes: the current metadata validator does not accept them. Component maturity can be `prerelease` while its version still uses the supported `-beta.N` format.

The [developer handoff](DEVELOPER-HANDOFF.md) covers the full manifest, implementation, token, preview and PR workflow. Catalogue deployment and package publication remain separate actions described below.


## Local development

Icon dependencies require a Font Awesome **Pro Package Token** with access to `@fortawesome/sharp-solid-svg-icons@7.3.1`. Set `FONTAWESOME_NPM_AUTH_TOKEN` in your local process environment before installing. `.npmrc` references this variable; never commit the token itself. A Kit code or general API token does not grant package-registry access.

Shared components render Font Awesome 7 Sharp Solid definitions as SVG, without an icon font or browser-side Font Awesome API. Editor icon fields accept icon names such as `bolt` or `shield-halved`; optional empty fields omit the icon.

Consumers can import `isCtaIcon` and `ctaIconPaths` from `@kinekt-io/components/icons` to validate editor-owned icon names and resolve the same SVG definitions. Featured Insights accepts optional renderer-owned `insightSources[].kindIcon`; a CMS can derive this from central article-type settings without duplicating icon controls on each card.

Run commands from this repository:

```bash
pnpm install
pnpm test
pnpm build
pnpm check
pnpm build:example
pnpm build:catalog
pnpm dev
pnpm dev:catalog
```

`pnpm dev` builds the TypeScript entries, then starts the Astro preview in `examples/astro`. `pnpm dev:catalog` starts the generated component catalogue. `pnpm build` updates generated exports and removes stale `dist/` output before compiling.

## Component catalogue

The workflow targets [kinekt-io.github.io/kinekt-sections](https://kinekt-io.github.io/kinekt-sections/) and deploys after a push to `main`. Run **Actions → Deploy component catalogue → Run workflow** to deploy the current `main` revision manually.

GitHub Pages MUST be available for private repositories on the organization plan before the deployment can succeed. If it is unavailable, run `pnpm build:catalog` or `pnpm dev:catalog` locally; neither command requires GitHub Pages.

The check, catalogue-build, and private-publish jobs read `FONTAWESOME_NPM_AUTH_TOKEN` from the `github-pages` environment. Checks do not expose this credential to fork pull requests.

### Netlify deploy previews

`netlify.toml` builds `examples/catalog/dist` with the current Node 22 release and pnpm `10.18.0`. On Netlify, import `kinekt-io/kinekt-sections`, set `main` as the production branch, and enable **Deploy Previews** for pull requests. Netlify uses this file, creates one preview URL per pull request, and posts the URL through its GitHub integration.

Add `FONTAWESOME_NPM_AUTH_TOKEN` to the Netlify site's build environment for production and trusted deploy previews. It is required during dependency installation, before the build command runs.

The catalogue keeps its `/kinekt-sections` base only outside Netlify. Netlify production and pull-request previews use their own root URL, preventing GitHub Pages paths from leaking into preview links.

## Publish a release

The package publishes to GitHub Packages, not npmjs.com.

1. Run the local checks above.
2. Increase `version` in `package.json` before committing release changes. GitHub Packages does not allow replacing an existing version.
3. Commit and push the approved source, generated `package.json`, and lockfile.
4. In GitHub, open **Actions → Publish private package → Run workflow**.

The workflow builds the package, publishes it, verifies private visibility, installs the resulting package in a new consumer directory, and discovers every generated Astro, Payload, and type entrypoint. It does not need a component-specific update when you add a new entrypoint.

## Repository structure

```text
src/
├── urls.ts                         Shared URL validation
└── sections/
    └── hero/
        └── allentown/
            ├── hero-allentown.astro
            ├── hero-allentown.payload.ts
            └── hero-allentown.types.ts
scripts/
├── generate-exports.mjs            Generates package exports from source entries
├── generate-exports.test.mjs       Tests discovery and duplicate-name rejection
└── verify-package.mjs              Validates every installed public entrypoint
```

The source repository is named `kinekt-sections`. The package name is `@kinekt-io/components`; the two names do not need to match.

## Ordering and process section contracts

- **MOQ Lead Times Trinity** (`sections/moq-lead-times-trinity.astro`, Payload block `beta-moq-lead-times-trinity`) uses a shared intro, 1–6 ordering items and an optional shared callout. Each item has a literal title, rich-text description, optional Font Awesome Sharp Solid icon name and optional Label Allentown. Desktop uses up to three columns; mobile uses two, with the final odd item spanning both. The callout accepts the standard 0–2-action CTA group. Empty labels and callouts can be saved. The default theme is `semi-light`; all four themes and the standard content-width presets are supported.
  - [Desktop: Section – MOQ & Lead times](https://www.figma.com/design/7rHrxb3twyBvPo9QxkOBly/KSW-1-Tulip-Tech-Website?node-id=5744-772930).
  - [Mobile: Section – FAQ, showing MOQ and lead time](https://www.figma.com/design/7rHrxb3twyBvPo9QxkOBly/KSW-1-Tulip-Tech-Website?node-id=5722-497588).
- **Steps Stage** exposes a localized `markerType` selector: `number` (default) or `icon`. Each step has an optional `icon` name. Number mode always renders sequential `01`, `02`, … and ignores saved icon names. Icon mode renders Sharp Solid SVGs without an icon font; an empty icon does not fall back to a number. Existing content without the selector keeps its numbered presentation.
- **Proof Metrics Allentown** accepts 1–4 metrics and has an optional callout. An absent or blank callout heading omits the entire callout; its CTA group remains optional.
- **HD Cells Engineering Allentown** uses `engineeringTopics[].labels` instead of item CTA groups. Each topic accepts 0–2 Result Item Allentown entries: `label` is the title, `value.text` is the label text, and `value.icon` is the optional Sharp Solid icon name. These labels have no URLs or button styles. The separate “More information” disclosure control remains unchanged.
- **Proof Metrics Trinity** (`sections/proof-metrics-trinity.astro`, Payload block `beta-proof-metrics-trinity`) combines a shared intro, 1–6 titled rich-text items and an optional shared callout. Each item may include one Result Item Allentown (`label` title, `value.text`, optional `value.icon`). Desktop uses two columns; mobile uses one. Default theme: `light`. All four themes and standard content-width presets are supported.
  - [Desktop: Section – Use cases for the right fit, showing Testing & reliability](https://www.figma.com/design/7rHrxb3twyBvPo9QxkOBly/KSW-1-Tulip-Tech-Website?node-id=5744-771911).
  - [Mobile: Section – Use cases for the right fit](https://www.figma.com/design/7rHrxb3twyBvPo9QxkOBly/KSW-1-Tulip-Tech-Website?node-id=5722-499189).
- **Read More Allentown** stores `ctas` as the standard localized 0–2-action array, not fixed `primary`/`secondary` groups. Each action has its own style, optional SVG icon and content/URL target. Before deploying over legacy data, migrate populated `ctas.primary` and `ctas.secondary` objects into ordered rows, preserving links and explicit styles; use the old slot name as the style when none was stored. Back up current documents and revisions before migration.
- **Tabs Allentown** remains beta. It accepts one or more tabs, each with a required navigation label and independently optional intro fields (accent, heading, rich-text description), a standard 0–2-action CTA group and a form embed. Blank forms render nothing. The optional `tabsHeading` labels the navigation. Desktop forms have a bounded width; mobile fields stack. Arrow keys, Home and End select tabs; without JavaScript all panels remain readable. Existing consumers must move `tabs[].description` to `tabs[].intro.description` before updating.
