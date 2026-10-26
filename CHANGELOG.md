# Changelog

## Unreleased

### Fixed

- Render configured arrow-right and arrow-down icons for Case Studies Allentown header and slide CTAs, retaining the current content-target contract and component-owned styles.

## 26.10.2-beta.25 — 2026-10-23

### Changed

- Replace Form Section Allentown's generic JSON fields with native localized Payload controls for theme, Intro Block, media, image position, HubSpot embed code and repeatable contact methods.
- Preserve the existing prerelease block slug while validating and adapting the native fields into the Astro renderer contract.
- Materialize reusable component manifests as nested native Payload groups and arrays instead of generic JSON controls.
- Localize every editor-owned manifest field, including themes, media choices and display options.
- Standardize section buttons on a shared Content-or-URL destination contract that can target Pages and every configured content collection.

## 26.10.2-beta.24 — 2026-10-23

### Changed

- Allow every CTA Group to omit its primary button, secondary button, or both.
- Render a single Case Studies item as static content without Embla hooks, controls, or pagination.

### Fixed

- Keep Label Allentown intrinsically sized for short text while wrapping oversized text inside its available container width.

## 26.10.2-beta.23 — 2026-10-23

### Fixed

- Normalize migrated Callout CTA records with a valid URL and no content relationship back to URL mode during Payload reads.

## 26.10.2-beta.22 — 2026-10-23

### Fixed

- Default Callout CTA Group links to URL so existing URL-backed CTA records remain valid when the polymorphic content selector is introduced.

## 26.10.2-beta.21 — 2026-10-23

### Changed

- Solution List item links and Callout CTA links can now target any configured routeable Payload content collection or an external URL.

## 26.10.2-beta.20 — 2026-10-23

### Changed

- Replaced Solution List Allentown's generic JSON Payload fields with native localized Intro, repeatable Item, Page-or-URL destination, and standardized Callout/CTA Group fields.
- Updated Callout Allentown to consume the reusable CTA Group contract.

## 26.10.2-beta.19 — 2026-10-22

### Fixed

- Restored the page-backed Case Studies Payload contract and protected its explicit adapter entrypoints from structural renderer generation.

## 26.10.2-beta.18 — 2026-10-22

### Fixed

- Form Section falls back to a governed JSON form reference when a consumer has no registered `forms` collection, preventing Payload configuration failure while the HubSpot integration remains external.

## 26.10.2-beta.17 — 2026-10-22

### Added

- Added prerelease Payload blocks and adapted renderer props for Solution List Allentown, Process Story Trinity, Form Section Allentown, Comparison Overview Allentown, Density Comparison Allentown, and Featured Insights Allentown.

### Changed

- Classified prerelease block labels as `PRERELEASE` in Payload.
- Preserved the reusable neutral wireframe styling, live catalogue routes, fictional preview content, and component-local label and section styles.

## 26.10.2-beta.15 — 2026-10-22

### Changed

- Added the `Solution List / Allentown` renderer, reusable Callout and Label integrations, responsive TOC, and wireframe-themed label treatment.

## 26.10.2-beta.14 — 2025-08-11

### Added

- Progressive-enhancement interactions for manifest-backed accordions, tabs, case-study carousels and the Insight Index.
- Embla Carousel runtime with accessible controls and a no-JavaScript card-list fallback.
- Pagefind adapter contract with local card-grid fallback for unavailable search indexes.

### Changed

- Generated Astro renderers now embed their manifest field maps and accept adapted component props directly.

## 26.9.26 — 2026-09-28

### Added

- A `prepare` build for consumers installing the package directly from the pinned public GitHub repository.

## 26.9.25 — 2026-09-28

### Added

- Default export conditions for generated Payload and type entrypoints, so Next.js/Turbopack consumers can resolve paired section modules.

### Changed

- Aligned the component package's Payload development dependencies with Payload 3.88.0.
