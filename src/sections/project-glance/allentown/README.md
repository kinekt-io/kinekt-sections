# Project Glance Allentown

Implementation for "The project at a glance" ([Partners section 5639:525223](https://www.figma.com/design/7rHrxb3twyBvPo9QxkOBly/KSW-1-Tulip-Tech-Website?node-id=5639-525223)) in the Case Template — 261014 | Tulip - Europe - Desktop - Case Template.

- Uses a semantic `section` and unordered fact list; fact order does not express a sequence.
- Each item renders `Key Fact Allentown` (`src/components/key-fact/allentown`): a fact label and description.
- Grid layout on desktop (centred rows of up to three facts) and mobile stacking remain renderer-owned.
- It does not use `StructuralSection`.
