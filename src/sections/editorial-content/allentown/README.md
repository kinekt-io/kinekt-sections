# Editorial Content Allentown

Implementation for the [Article Template — 261014 | Tulip - Europe - Desktop - Article Template](https://www.figma.com/design/7rHrxb3twyBvPo9QxkOBly/KSW-1-Tulip-Tech-Website?node-id=5639-526183&t=OtYEVTRRdAJJYQ0v-11). The Case Template reuses this section.

The section renders editor-owned Payload Lexical rich text inside a readable semantic `section`; it does not use `StructuralSection`.

The Payload editor configuration must permit standard text and controlled inline blocks only:

- `Intro Allentown`
- `Quote Allentown`
- `Editorial Media Allentown`
- `Editorial Columns Allentown`

It must not accept arbitrary HTML, customer-specific block definitions, or unconstrained embeds.

## Styled markup

The renderer accepts Payload Lexical (`{ root }`, converted with the shared `richTextToHtml`), pre-rendered `{ html }` or a plain string. It is styled to the Article ["Section - Content"](https://www.figma.com/design/7rHrxb3twyBvPo9QxkOBly/KSW-1-Tulip-Tech-Website?node-id=5639-526201) and the [Case Template body](https://www.figma.com/design/7rHrxb3twyBvPo9QxkOBly/KSW-1-Tulip-Tech-Website?node-id=5639-525236) through semantic markup, which the inline block converters should emit:

- headings `h2`–`h6` (an `h2` is sized as Figma's D H3 and the paragraph after it is the text-xl lead), paragraphs, lists, links, and `hr` (the flight-path divider)
- Editorial Media: `figure` with an image and an optional `figcaption`
- Quote: `blockquote` (CSS adds the quote marks), optionally inside a `figure` whose `figcaption` holds a `strong` name and a `span` role
- Intro: `hgroup` (accent `p` + heading) followed by its description `p`
- Editorial Columns: an element with `data-kinekt-editorial-columns` and two column children; a `figure` column gets the Case Template's 5 : 4 media layout