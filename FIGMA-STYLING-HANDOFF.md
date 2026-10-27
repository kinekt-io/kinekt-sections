# Styling sections to Figma: handoff

Handoff from Simon to Odinn, 2026-10-27. This covers the work that styled the beta and alpha sections to Tulip's Figma frames: what is done, what is left, the rules the work followed, and how to style another section the same way.

Read [DEVELOPER-HANDOFF.md](DEVELOPER-HANDOFF.md) first for the component contract, tokens, previews and checks. This file only adds what the Figma work introduced.

## 1. Where things stand

- **Beta sections:** 31 of 32 are styled to their Figma frames. 23 of them were converted from generated structural sections to handwritten renderers. **faq** is not done (see §2).
- **Alpha (`planned`) sections:** case-header, article-header, project-glance, editorial-content, related-content and use-cases are styled (PR #10).
- **Shared parts** (Button, intro accent, Label, Callout, CTA spacing) match the Figma library (PR #9). §6 lists every shared part built along the way.
- **Theme roles** match Figma in every section, including the new `accent`, `action-icon` and `subtle` roles (§5.2).

Merged PRs, in order: #3 (theme roles, Read More, catalogue brand switch), #4 (Media Feature List, Tulip spacing fix), #5 and #6 (shared parts), #7 (30 beta sections), #9 (shared parts to Figma), #10 (alpha sections), #12 (Font Awesome icon clipping).

### 1.1 Open PRs to review

| PR | What | Notes |
|---|---|---|
| [#11](https://github.com/kinekt-io/kinekt-sections/pull/11) `fix/default-contrast` | Contrast fixes for the default (Neutral) styling. Text failures 271 → 0 across 51 embeds × 4 themes | Changes the default palette in `wireframe-tokens.css` (Tulip is unaffected). Also fixes Form Section and Solution List never applying their non-light themes |
| [#14](https://github.com/kinekt-io/kinekt-sections/pull/14) `feat/homepage-problem-solution-scroll` | The scroll infographic for Homepage Problem Solution | First asset import in `src/` (WebP map). Uses a Font Awesome **Pro** icon (Tulip's licence). Renderer-only label props until the contract PR |

### 1.2 Clean-up after merging

- Delete the asset-only branches `pr-assets/pr-9` and `pr-assets/default-contrast` once nobody needs the PR screenshots (#9's are only on `pr-assets/pr-9`; #11's on `pr-assets/default-contrast`).
- The merged feature branches on `origin` can be deleted.
- `src/shared/structural-section.astro` still has dead selectors for sections that are now handwritten (they need `[data-kinekt-structural-section]`, so they are inert). Remove them in a shared PR.

## 2. What is left

**Sections**
- **faq** (beta): its Figma link `4811:276546` is invalid. It needs a correct node from the designer. faq-index already builds FAQ rows in-section; extract them into the planned `faq-item` when faq is done.
- **tabs** (`5255:538861`) and **moq-lead-times** (`4811:283011`): their Figma nodes are deleted. Both need new links.
- **action-contact** (`4131:288`): not part of the styling batches. It now uses the shared Button secondary (#11), but it hasn't been checked against its frame.

**Contract PR (approved, not started).** The converted sections keep the generated `.types.ts` (`Record<string, unknown>`) and an identity Payload adapter, so raw Lexical, media IDs and CTA destinations reach the renderers, which normalise them. A separate PR should add typed types and adapters, plus the fields the renderers currently take as renderer-only props. The gaps found per section:

| Section | Missing or renderer-only |
|---|---|
| facilities-overview | Label `title` ("US Presence") |
| product-options | `formIntro {heading, description}`; intro copy is hard-coded English |
| support-contact | `form` prop (the manifest requires it) |
| product-details | intro CTA group |
| media-fact-grid | fact `description` is rich text flattened into a one-line Label; propose plain text |
| event-overview, featured-event | event-type and load-more labels; `featured`, `publishedAt`, `eventStageLabel` |
| product-finder-form | `formLabel` |
| process-story (allentown) | intro checklist, step subtitle, step CTAs; `itemDecoration: flightPath` has no counterpart in the frame |
| faq-index | `faqs` / `subjects` shape and English labels |
| insight-index | subjects, extra media types, body |
| compliance-detail, compliance-overview | detail title/copy (`detailHeading`, `detailDescription`); collage shape |
| hd-cells-engineering | topic card heading, result labels, hotspots |
| product-hero | rows are single-text in Figma, the contract has label + value (propose optional `value`) |
| steps/stage | Figma media has a play overlay (video?) |
| case-header, article-header | `breadcrumb`, `customerLogoLabel` ("/ Client") |
| editorial-content | intro labels |
| homepage-problem-solution | `problemInfographicLabel`, `solutionInfographicLabel` and callout labels (#14) |

Also: heading-level defaults for hero-like sections (not-found-hero, thank-you-hero, compliance-overview and product-hero default to h1; featured-page-header and support-contact still h2).

**Open decisions** are in §7. Several shared-part proposals are in §6.2.

## 3. Rules the work followed

These were agreed with Simon during the work. Keep to them unless you decide otherwise; your choices win over consistency preferences.

1. **Layout from Figma, colours from theme roles.** Per section, take container width, columns, gaps, aspect ratios, element order and which shared parts appear from the frame. Colours come from the theme roles (§5.2), never hex in components. Where Figma uses a colour no role covers, point a section variable at a palette name (`var(--primary)`), not a hex value.
2. **Reuse before building.** Before writing any part of a section, check (a) whether the Figma element is an *instance* of a library component, (b) whether a renderer already exists in `src/atoms`, `src/primitives`, `src/controls` or `src/components`, and (c) whether another section already built it. If a shared part can't express the design, change the shared part (for every section) instead of copying it.
3. **Shared building blocks as-is.** `SectionIntro` (with the `after-heading` slot for labels), the shared `Button` with no per-section size or padding overrides, CTA icons from `cta.icon` via `src/shared/cta-icons.ts`, `style="clear"` for secondary/text CTAs in Allentown variants. No Font Awesome chevrons in buttons.
4. **Forms use the shared Form Embed** (`src/components/form-embed/allentown`) with a `formEmbed` field (HubSpot embed code). No section-local form markup or field CSS; tune only through `--kiw--form-embed-allentown-*`. See DEVELOPER-HANDOFF.md "Forms".
5. **Brand files set hard values only:** numbers, lengths, hex codes, font names. Never override a computed token (anything defined with `calc()` or `var()` in `wireframe-tokens.css`, such as `--space-xs`). If a computed value is wrong, change the hard input it derives from. If no hard input can produce the Figma value, report it instead of patching.
6. **Fix mismatches globally**, not with section-local calcs or overrides.
7. **Map Figma variables by name and value, not by their code syntax.** The code syntax in the Tulip library is wrong in places: `Desktop/D Space XXS` (8.96) has code syntax `var(--space-xs)`. That mistake once made the Tulip brand override `--space-xs`.
8. **Verify by measurement** at 1720 px with the Tulip brand and the frame's theme, then check that Neutral still looks coherent and that phones (390 px) stack without horizontal overflow.
9. Bugs found while styling get fixed and called out in the PR.

## 4. How to style a section

### 4.1 Read the frame

The Figma file is **KSW-1-Tulip-Tech-Website**, key `7rHrxb3twyBvPo9QxkOBly`. Each section's node is in its `manifest.json` → `figma.nodeId`. Only desktop frames (1720 wide) are linked; infer mobile behaviour (stack columns below `50rem`, like the finished sections).

- Confirm the node exists and look at its structure before anything else. Some links point at inner containers, some layer names are reused for unrelated sections ("Section - The 5 steps"), and several nodes have been deleted.
- **Theme from the canvas:** neutral-ultra-light = light, neutral-light = semi-light, primary-dark = semi-dark, primary-ultra-dark = dark. Set the preview's theme to match.
- **Spacing:** read the variable's name. Codegen printing `var(--space-xs, 8.96px)` means Figma **XXS** → `--space-xxs`; `var(--space-xs, 12.8px)` means XS → `--space-xs`. When a value looks off, read the node's bound variables (`node.boundVariables` → `figma.variables.getVariableByIdAsync(id)` → `name`, `valuesByMode`). Industry Insights reads XS 10.0 / S 14.14 from a stale second Spacing collection; map those by name too, and ask the designer to relink it.
- Divider colours come back as SVG assets: read their `stroke`.
- Generated React/Tailwind code is reference only. Placeholder images in Figma are media slots, not assets.

Known library component sets: Label `4706:98511`, Subtile + Flight Path `4649:23717`, Call to Action Block `4805:266705`, Button `4700:58121`, intro Column `5685:654403`, Battery Output Card `4700:59363`, Content Item `4705:34467`, Label Icon `4650:28087`. The older `4811-*` links (Intro, Button, Label, Callout) are stale.

### 4.2 Implement

- Edit the section's `.astro` (markup and `<style is:global>`) and `.preview.astro`. Leave manifest, payload and types alone unless a contract bug needs fixing (call it out).
- Map every Figma value to the nearest token behind a section variable, `:where(.<slug>) { --kiw--<slug>-<name>: var(--token); }`, and use the variable in the rules.
- Container widths apply as max-width only from `50rem` (the width tokens are fluid). 1440 = `--content-width`, 1296 = `--width-xxl`, 1152 = `--width-xl`, 864 = `--width-l`, 576 = `--width-m`, 288 = `--width-s`, 144 = `--width-xs`.
- Section padding stays `--section-space-l` (80) unless the section already uses something else. Figma's 140 is an open decision (§7). Media radius stays `--radius-none` (also open).
- CTA rows: `space-l` between buttons, `section-xs` above (the Figma Column values; every section bridge and the generator use them).
- Previews: realistic content that exercises every feature in the frame. Media uses `catalogue-asset:placeholder-<W>x<H>.svg` from `examples/catalog/public/placeholders/`; add a new size by copying an existing SVG. Avoid nested template literals in preview frontmatter (Astro's compiler misparses them).
- Font Awesome icons drawn by hand as `<svg viewBox=…><path d={icon[4]}/></svg>` need `overflow: visible` on the SVG: many FA 7 glyphs draw past their viewBox (gears, cogs, dog…). The resolver is copied in several renderers; a shared FA icon helper is proposed (§6.2).

### 4.3 Converting a generated section

Generated sections (`// @generated structural section`) render through `src/shared/structural-section.astro` and `structural-content.astro`, so CSS alone can't reach the design. Only **faq** and **tabs** are left. To convert one:

1. Write a handwritten `.astro`: section root with `data-kinekt-section data-kinekt-theme`, token bridge block, role block per theme (copy the current one from read-more), component styles.
2. Drop the marker from **both** `.astro` and `.preview.astro`. The overwrite check is a substring match on `@generated structural section`, and the generated preview's own marker contains it.
3. Keep `.types.ts` and `.payload.ts`; they keep their marker and regenerate byte-identically. Type the renderer's own props and normalise the input (raw Lexical, media IDs, content-destination CTAs).
4. Remove the section's entry from `generatedComponentRules` in `scripts/materialize-structural-sections.mjs`. Some outputs are force-written (for example the media-metrics preview), so read the generator for the section first.
5. Build child items as reusable renderers under `src/components/<role>/allentown/`. A new renderer automatically gets a package export and a catalogue entry, so `package.json` and `examples/catalog/src/generated/components.json` change.
6. Run `pnpm build` and confirm `git status` shows no regeneration of your files.

Things the generated renderers got wrong and the conversions fixed: CTA rows rendered twice, sample `'#'` links rejected by `isSafeWebUrl`, accent headings getting heading copy, icon keys printed as text. The manifests' `runtimeProps` (anchors, collage eligibility, region-pattern decoration, error code) were never implemented by the generic renderer either.

### 4.4 Verify

1. `pnpm build`, then `git status` (no unexpected changes), `pnpm check` (0 errors), `pnpm test`, `pnpm build:catalog`.
2. **Restart the catalogue dev server** after any checkout, pull, rebase or stash. Vite keeps serving stale component CSS otherwise.
3. Compare at 1720 px against the frame, Tulip brand on, frame's theme. Measure container left/width, column widths and gaps, vertical gaps, per-element colours, label and accent font sizes.
4. 390 px: columns stack and `document.documentElement.scrollWidth === innerWidth`.
5. All four themes coherent, Neutral brand coherent, all preview images load.

Catalogue URLs need `127.0.0.1` and the `/kinekt-sections/` base:
- Component page (theme via "Inspect options", brand via the bottom-right switch): `/kinekt-sections/components/sections/<section>/<variation>/?brand=tulip`
- Embed (component only, clean for screenshots): `/kinekt-sections/components/embed/sections/<section>/<variation>/?brand=tulip`. There is no `?theme=` parameter; set it in the console with `document.querySelector('[data-kinekt-section]').dataset.kinektTheme = 'dark'`.
- The brand switch is always on in dev; on the built catalogue add `?tools=on`. It is not access control.

Machines with Windows animation effects off report `prefers-reduced-motion: reduce`, so motion (Homepage Problem Solution, hd-cells tabs fades) shows its static fallback there.

## 5. Tokens and theme roles

### 5.1 Figma variables → tokens

| Figma | Token | Note |
|---|---|---|
| `h1`–`h6`, `text-xs`–`text-xxl` | same | h1 56 … h6 20; text 12 … 22 |
| `space-s` … `space-xxl` | same | 16 / 20 / 25 / 31.25 / 39.06 (20 × 1.25ⁿ) |
| `D Space XS` 12.8 | `--space-xs` | |
| `D Space XXS` 8.96 | `--space-xxs` (10.24) | Off the 1.25 scale; **10.24 accepted**. Its code syntax wrongly says `var(--space-xs)` |
| `D Space calc(xxs+xs)2` 10.88 | `calc((var(--space-xxs) + var(--space-xs)) / 2)` | Label vertical padding; code syntax also wrong |
| `section-xs` … `section-xxl` | `--section-space-*` | 40.96 / 51.2 / 64 / 80 / 100 / 125 |
| `width-xs` … `width-xxl`, `content-width` | same | 144 / 288 / 576 / 864 / 1152 / 1296, 1440 |
| `d-section-gutter` 140 | `--section-gutter` | Figma also uses it as vertical section padding (open, §7) |
| `border-size` | `--border-width` | |
| `radius-m` 2, `radius-l` 2.666 | same | Set by the Tulip brand. Tulip has no Radius XL 5.332 (hd-cells-engineering uses radius-l) |

Hard 120 and 210 gaps in some frames are mapped to `section-xxl` (125). Figma's code-syntax bugs (`D Space XXS`, `D Space calc(xxs+xs)2`) should be fixed by the designer in the remote Tulip spacing library.

### 5.2 Theme roles

In every handwritten section's role block, in `src/shared/structural-section.astro` and in `sectionColorRoles` in the generator.

| Role | light | semi-light | semi-dark | dark |
|---|---|---|---|---|
| canvas | neutral-ultra-light | neutral-light | primary-dark | primary-ultra-dark |
| surface | white | white | primary-semi-dark | primary-semi-dark |
| ink | primary-ultra-dark | primary-ultra-dark | white | white |
| muted | primary-semi-dark | primary-semi-dark | primary-light | primary-ultra-light |
| subtle | primary | primary | primary-light | primary-ultra-light |
| line | primary-ultra-light | primary-ultra-light | primary | primary |
| action / action-text | primary / white | primary-semi-dark / white | primary / white | primary / white |
| accent | accent-semi-dark | accent-semi-dark | accent | accent |
| action-icon | accent | accent | accent | accent |

- `accent`: accent headings, the Label atom, icons in `clear` and `secondary` buttons. `action-icon`: icons in filled buttons.
- Each role has `--kinekt-section-<role>` and `--kiw--<slug>-<role>` hooks.
- Evidence frames: light = Battery Models, semi-light = Read More, semi-dark = Form Section "Book a call" (5240:411427), dark = Compliance Overview / Support Contact.

### 5.3 Tulip brand

`examples/catalog/src/brands/tulip.css` is the Space Grotesk `@import` (line 1) followed by Tulip's `customer-tokens.css` verbatim. Simon updated the customer file to match Figma (mono font Space Grotesk, heading line-height 1.1, radius-m 2, radius-l 2.666, no spacing overrides); ask him for the current file before changing the production brand. Keep the two in sync. Never sample colours from Figma frames into token files. Aeonik Pro is first in the font stacks but isn't loaded, so line breaks differ from Figma.

## 6. Shared parts

### 6.1 Built during this work

| Part | Path | Notes |
|---|---|---|
| Button | `src/controls/button/allentown` | Figma set `4700:58121`. `size` s / m / l; `secondary` = neutral-light fill, primary-ultra-dark text, accent-semi-dark icon in every theme; `clear` has no border |
| SectionIntro | `src/primitives/section-intro` | `accentStyle` defaults to `heading` (Figma Column accent: heading font 500, text-m, 0.05em, line-height 1) |
| Label | `src/atoms/label/allentown` | `size` s / m / l / xl; tint 8% on light themes, 15% on dark (inherited `--kinekt-label-tint`); border inside the padding |
| SubtitleFlightPath | `src/primitives/subtitle-flight-path` | Uppercase accent label + gradient line; `as` (p, h2–h6), `id`, opt-in `caps` |
| Callout (Call to Action Block) | `src/components/callout/allentown` | `size` large / medium, `actions` slot, column variables |
| CTA icons | `src/shared/cta-icons.ts` | Single source for paths, Payload options and validation |
| Disclosure group, tabs | `src/shared/interactions.ts` | `data-kinekt-disclosure-group` (single-open `<details>`), `[data-kinekt-tabs]` |
| result-item, spec-pair, output-card, checklist-item, form-embed | `src/components/<name>/allentown` | output-card renders both Battery Output Card variants (option-card points at it); checklist-item serves the four checklist/compliance sections |
| content-hero-media | `src/components/content-hero-media/allentown` | Image, uploaded video with play button, or external iframe |
| Section children | `src/components/…` | key-fact, event-card (`grid` / `featured`), accordion-item, product-detail-item, fact-card, facility-fact, next-step, intake-step, process-item, homepage-problem-item, homepage-solution-step, hd-cell-item, hd-engineering-topic, use-case-item (all `allentown`), step/stage |

### 6.2 Proposed, not built

- **Shared Font Awesome icon helper:** a Font Awesome lookup + bare SVG is copied in ten renderers.
- **Rich-text:** a shared `richTextToHtml` exists in `src/shared/rich-text.ts`, but five sections still carry their own `toHtml` (checklist-feature-list, compliance-detail, compliance-overview, faq-index, hd-cells-engineering). Switch them over.
- **Shared insight card** (stacked / split): insight-index, related-content, featured-page-header, featured-insights.
- **`faq-item`** extracted from faq-index's rows (with faq).
- **feature-pair** with `presentation="pair" | "check"`: product-hero and hero/todos-santos are two variants (Region=Ukraine / EU + US) of the same Figma set `4817:325224`.
- **feature-item** shared between checklist-feature-list and media-feature-list.
- **homepage-problem-item + homepage-solution-step** as one renderer with a `tone` option (they differ only in gap and icon colour).
- **Button `<button>` mode** for native buttons (support-contact submit, event-overview load more, hd-cells).
- **Form Embed:** `submit-align` and `legend-font-size` variables (product-finder-form), container-query rows instead of viewport rows (intake-form).
- **CtaIcon additions:** `download` (mapped to arrow-down today), `paper-plane`, `plus`, `calendar-plus`, `arrow-up-right`.
- **Filter pills / filter controls** (faq-index, insight-index), **breadcrumb primitive** (case/article headers), **Label `plain` variant** (insight-index).
- **Region-pattern decoration** (`decoration: tulipRegionPatternSharp`) for not-found-hero, action-contact, intake-form, support-contact, steps/trinity. Needs an SVG export from Figma.
- **next-step** align variable (it centres the number on wrapped mobile titles).

## 7. Open decisions

1. **Section vertical padding.** Figma uses 140 (`d-section-gutter`) almost everywhere; sections use `--section-space-l` (80). Options: keep, use `section-xxl` (125), or add a dedicated token. `--section-gutter` shrinks to 16 px on mobile, which is tight for sections that use it (media-feature-list).
2. **Media radius.** Figma `--radius-l`; sections `--radius-none`.
3. **Dark `muted`.** Our dark muted is primary-ultra-light; support-contact and featured-event frames use primary-light. Decide whether the role changes.
4. **Neutral `--error`.** It is primary-dark on main, invisible on dark canvases (Homepage Problem Solution). #11 changes it to primary-light.
5. **Form-field borders** are 1.2–1.9:1 against the 3:1 guideline in every brand (Figma's faint borders). Left as designed.
6. **Contrast as designed in Tulip:** accent-semi-dark text on light (2.8:1); faq-index inactive pills (3.15:1 Tulip, 1.41:1 Neutral); insight-index inactive pagination (about 2:1); product-hero check icons on dark.
7. **product-finder-form width 720** is a section-local `calc(var(--content-width) * 0.5)`. Needs a token or a snap to width-l / width-m.
8. **compliance-overview header** is 864 (Figma 780, no token).

## 8. Caveats per section

Only what you might trip over; everything else matches its frame within a few pixels.

- **Everywhere:** accent → heading gap is 10.24 (Figma 8.96, accepted). Canvas accent gradients and the region pattern aren't reproduced.
- **read-more:** Figma sets the description at 80% opacity (not reproduced). Its label and heading runtime prop are missing from its Payload factory and manifest.
- **media-metrics:** the preview is force-regenerated; edit `mediaMetricsPreview` in the generator.
- **compatibility-specifications:** a fixed `aria-labelledby` id duplicates with several instances on a page. Token migration `42272ac` mapped some Figma-exact values to the wrong tokens; other sections migrated in that commit may have the same problem.
- **battery-models:** Neutral spec dividers are invisible (line on canvas). Card titles are h3 (were h4).
- **product-options, support-contact:** fixed form heading ids (duplicate-id risk). Support-contact's "Add … +" toggles aren't built.
- **not-found-hero:** Figma's fixed 929 height isn't reproduced (`--kiw--not-found-hero-min-block-size` hook). The frame is misnamed "Hero Section - Certification & Compliance".
- **insight-index:** Pagefind loads at runtime through the shared `[data-kinekt-search-grid]` adapter, with a silent local fallback; subject filter values are sent as labels (confirm against how pages are indexed).
- **product-hero:** KinektMedia's mobile source switches at 767px while the layout stacks at 50rem.
- **homepage-problem-solution (#14):** the Tulip map ships in every brand; the infographic is always dark and uses palette values, not roles.
- **solution-list:** item CTAs sit 25 below the copy (Figma 31.25). **case-studies:** Figma's CTA is `secondary`, the section renders primary. **comparison-overview:** its intro clear CTA isn't in the frame.

## 9. Reference: sections and their frames

| Section | Figma node | Theme |
|---|---|---|
| battery-models | 5255:544549 | light |
| checklist-feature-list | 5240:415190 | semi-light |
| compatibility-specifications | 5255:538029 | light |
| compliance-detail | 5240:413470 | semi-light |
| compliance-overview | 5240:413425 | dark |
| compliance-text | 5240:413495 | light |
| event-overview | 5240:415963 | light |
| facilities-overview | 5255:543714 | semi-dark |
| faq | 4811:276546 (**invalid**) | – |
| faq-index | 5240:414308 | semi-light |
| featured-event | 5240:415942 | dark |
| featured-page-header | 5240:411660 | semi-light |
| hd-cells-engineering | 5240:412556 | dark |
| homepage-problem-solution | 5240:411370 | dark |
| insight-index | 5240:411675 | light |
| intake-form | 5240:416702 | light |
| media-accordion | 5240:412609 | semi-light |
| media-fact-grid | 5240:414436 | semi-light |
| media-feature-list | 5240:414365 | semi-dark |
| media-metrics | 5240:414386 | semi-light |
| not-found-hero | 5255:532807 | semi-light |
| output-card-grid | 5255:537962 | semi-light |
| process-story (allentown) | 4779:129512 (old 4817:416529 deleted) | light |
| product-details | 5240:411600 | light |
| product-finder-form | 5255:537977 | light |
| product-hero | 5255:538028 | dark |
| product-options | 5240:411550 | light |
| proof-metrics | 5240:412607 | semi-light |
| read-more | 5240:411426 | semi-light |
| steps/stage | 5240:414399 | light |
| support-contact | 5240:414267 | dark |
| thank-you-hero | 5240:425110 | semi-light |
| case-header | 5639:524477 | dark |
| article-header | 5639:526185 | semi-light |
| project-glance | 5639:525223 | – |
| editorial-content | 5639:526201 (article), 5639:525236 (case) | – |
| related-content | 5639:526230 | – |
| use-cases | 5255:544548 | – |
| tabs | 5255:538861 (**deleted**) | – |
| moq-lead-times | 4811:283011 (**deleted**) | – |
| action-contact | 4131:288 (not checked) | – |
