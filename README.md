# Kinekt components

`@kinekt-io/components` is a private GitHub Packages library of paired Astro renderers and Payload block definitions. Each component implementation has separate public Astro, Payload, and type entrypoints.

Current source package: [`kinekt-io/kinekt-sections`](https://github.com/kinekt-io/kinekt-sections).

## Install the private package

Install the package in each separate consumer application:

- the Astro application imports `.astro` renderers and, when needed, component conversion helpers;
- the Payload application imports `.payload` block definitions;
- Astro MUST fetch content from the CMS API. It MUST NOT import a Payload config or source file directly.

### Prerequisites

- Node.js `>=22.12.0`.
- pnpm `10.18.0`.
- GitHub access to the private `@kinekt-io/components` package.
- A GitHub Personal Access Token (classic) with `read:packages` for local installation. Do not commit or paste this token into a project file.

For GitHub Actions, grant the site repository read access in the package's **Manage Actions access** settings. The workflow can then use its `GITHUB_TOKEN` with `packages: read`.

### Configure the registry

Create `.npmrc` in the root of each consumer application:

```ini
@kinekt-io:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

The file maps only the `@kinekt-io` scope to GitHub Packages. Other dependencies still use the default npm registry. Commit this configuration, but never replace `${NODE_AUTH_TOKEN}` with a token value.

### Authenticate locally

Load a new read-only GitHub token into the current terminal session:

```zsh
read -s "NODE_AUTH_TOKEN?GitHub package token: "
echo
export NODE_AUTH_TOKEN
```

The token remains only in that terminal session. Remove it after installation if you no longer need it:

```zsh
unset NODE_AUTH_TOKEN
```

### Install a fixed release

Run this in the Astro application and again in the separate Payload application:

```bash
pnpm add --save-exact @kinekt-io/components@0.1.0
```

Use a concrete version. A site updates only when you deliberately change this dependency and rebuild it.

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

## Add a component

See [`naming-conventions.md`](./naming-conventions.md) for the naming scheme and folder layout.

1. Add `<name>.astro`, `<name>.payload.ts`, `<name>.types.ts`, and `README.md` below `src/<category>/`.
2. Use the same base name for the three source files and for the Payload slug.
3. Describe the component in its `README.md`. The first heading and paragraph appear in the generated catalogue.
4. Run the checks below.
5. Increase `version` in `package.json` before publishing a release.

The build discovers the three filenames and rewrites `package.json` `exports`. Do not add exports manually. The generator stops on duplicate public import paths.

## Local development

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

## Publish a release

The package publishes to GitHub Packages, not npmjs.com.

1. Run the local checks above.
2. Commit and push the component source, generated `package.json`, and lockfile.
3. Increase `version` in `package.json` before each new package version. GitHub Packages does not allow replacing an existing version.
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
