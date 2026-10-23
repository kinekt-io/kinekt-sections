# Changelog

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
