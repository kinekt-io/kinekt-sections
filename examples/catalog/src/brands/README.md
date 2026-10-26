# Catalogue preview brands

Every `*.css` file in this folder becomes an option in the catalogue's **Brand** switch. Shared sections are still checked against the neutral wireframe tokens by default.

## Add a brand

1. Copy the customer's token stylesheet here, e.g. `acme-corp.css`. The file name becomes the option label ("Acme Corp").
2. Keep it a plain customer token file: canonical token overrides on `:root { … }`, as described in the root README under "Wireframe styling and site token overrides". Don't add component selectors.
3. Fonts the tokens reference need an `@import` as the **first** line (see `tulip.css`). Licensed fonts that can't be loaded fall back to the next family in the stack.
4. Restart `pnpm dev:catalog` if the new option doesn't appear. Brands are collected at build time.

## Using the switch

- **Local dev** (`pnpm dev:catalog`): the Brand switch (bottom right) is always visible on the catalogue index, the all-sections page and each component page. Check themes with the component page's "Inspect options".
- **Built/deployed catalogue:** the tools are hidden. Turn them on in your browser with `?tools=on` on any catalogue URL, and off with `?tools=off`. The choice is remembered per browser. With tools off, every preview renders with the neutral tokens.
- Direct links: `?brand=<file-name>` or `?brand=neutral`.
- Embed pages (`/components/embed/…`, used for the index thumbnails) show only the component, without controls. They still follow the selected brand.

The gate keeps the tools out of the way; it is not access control. Anyone who knows `?tools=on` can enable them.

Brand files are catalogue-only. They are never part of the published `@kinekt-io/components` package.
