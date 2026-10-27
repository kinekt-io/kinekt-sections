import { readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const source = path.join(root, 'src')
const sections = path.join(source, 'sections')

async function manifestDirectories(directory, result = []) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const filename = path.join(directory, entry.name)
    if (entry.isDirectory()) await manifestDirectories(filename, result)
    else if (entry.name === 'manifest.json') result.push(path.dirname(filename))
  }
  return result
}

function pascalCase(value) {
  return value.split('-').map((part) => part[0]?.toUpperCase() + part.slice(1)).join('')
}

function labelFor(key) {
  return key.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/[-_]/g, ' ').replace(/^./, (character) => character.toUpperCase())
}

const previewCopy = {
  headings: [
    'Energy systems built around real operating conditions',
    'Designed for the constraints that shape delivery',
    'Performance data teams can use with confidence',
  ],
  accents: ['System engineering', 'Built for the field', 'From cell to system'],
  descriptions: [
    'Clear technical information helps teams assess operating conditions, integration constraints and the next engineering decision.',
    'The system is configured around the duty cycle, environmental demands and evidence needed for a reliable release.',
    'Structured content keeps performance requirements, technical context and implementation choices easy to compare.',
  ],
  questions: [
    'Which operating conditions does this configuration support?',
    'How is the system validated before delivery?',
    'Can this solution be adapted to our application?',
  ],
  answers: [
    'The final specification is validated against the intended operating range, integration constraints and relevant safety requirements.',
    'Each build follows a documented test sequence with traceable measurements and an agreed acceptance threshold.',
    'Yes. The component contract supports configurable content while keeping the published markup and interaction model consistent.',
  ],
}

const sectionTokenRoles = [
  ['site-width', 'website-width'],
  ['content-width', 'content-width'],
  ['reading-width', 'width-m'],
  ['inline-space', 'section-gutter'],
  ['block-space', 'section-space-l'],
  ['gap', 'content-gap'],
  ['radius', 'radius-none'],
  ['border-width', 'border-width'],
  ['media-filter', 'media-filter'],
  ['intro-accent-gap', 'space-xxs'],
  ['intro-description-gap', 'space-m'],
  ['heading-1-size', 'h1'],
  ['heading-2-size', 'h2'],
  ['heading-3-size', 'h3'],
  ['heading-4-size', 'h4'],
  ['heading-5-size', 'h5'],
  ['heading-6-size', 'h6'],
  ['heading-font-family', 'heading-font-family'],
  ['heading-font-weight', 'heading-font-weight'],
  ['heading-line-height', 'heading-line-height'],
  ['heading-letter-spacing', 'heading-letter-spacing'],
  ['text-font-family', 'text-font-family'],
  ['text-font-weight', 'text-font-weight'],
  ['text-line-height', 'text-line-height'],
  ['text-letter-spacing', 'text-letter-spacing'],
  ['mono-font-family', 'mono-font-family'],
  ['text-xs-size', 'text-xs'],
  ['text-s-size', 'text-s'],
  ['text-m-size', 'text-m'],
  ['text-l-size', 'text-l'],
  ['text-xl-size', 'text-xl'],
  ['text-xxl-size', 'text-xxl'],
  ['carousel-gap', 'content-gap'],
  ['actions-gap', 'space-l'],
  ['actions-margin', 'section-space-xs'],
  ['button-height', 'input-height'],
  ['button-padding-block', 'space-s'],
  ['button-padding-inline', 'space-l'],
  ['button-radius', 'buttons-radius'],
  ['input-height', 'input-height'],
  ['editorial-gap', 'section-space-xxl'],
  ['card-padding', 'space-l'],
  ['header-to-content-gap', 'section-space-s'],
  ['table-offset', 'space-xl'],
]

const sectionColorRoles = ['canvas', 'surface', 'ink', 'muted', 'subtle', 'line', 'action', 'action-text', 'accent', 'action-icon']

function sectionTokenBridgeCss(block) {
  const tokenBlock = block.startsWith('beta-') ? block.slice(5) : block
  const declarations = [
    ...sectionTokenRoles.map(([role, token]) => `  --kiw--section-${role}: var(--kinekt-section-${role}, var(--kiw--${tokenBlock}-${role}, var(--${token})));`),
    ...sectionColorRoles.map((role) => `  --kiw--section-${role}: var(--kinekt-section-${role}, var(--kiw--${tokenBlock}-${role}));`),
  ].join('\n')

  return `<style is:global>\n.${block}[data-kinekt-section] {\n${declarations}\n}\n</style>`
}

const generatedComponentRules = {
  'beta-action-contact-allentown': `:where(.beta-action-contact-allentown[data-kinekt-structural-section]) { --kinekt-section-reading-width: var(--width-m); --kinekt-section-gap: var(--section-space-xl); }`,
  'beta-support-contact-allentown': `:where(.beta-support-contact-allentown[data-kinekt-structural-section]) { --kinekt-section-reading-width: var(--width-m); --kinekt-section-gap: var(--section-space-xl); }`,
  'beta-solution-list-allentown': `:where(.beta-solution-list-allentown[data-kinekt-structural-section]) { --kinekt-section-reading-width: var(--width-m); --kinekt-section-gap: var(--section-space-l); }`,
  'beta-comparison-overview-allentown': `:where(.beta-comparison-overview-allentown[data-kinekt-structural-section]) { --kinekt-section-content-width: var(--content-width); --kinekt-section-reading-width: var(--width-l); --kinekt-section-gap: var(--section-space-l); }
:where(.beta-comparison-overview-allentown[data-kinekt-structural-section]) .beta-comparison-overview-allentown__header { text-align: center; }
:where(.beta-comparison-overview-allentown[data-kinekt-structural-section]) .beta-comparison-overview-allentown__header-content { margin-inline: auto; }
:where(.beta-comparison-overview-allentown[data-kinekt-structural-section]) [class$='__table'] { margin-top: var(--kinekt-section-table-offset, var(--kiw--section-table-offset, var(--space-xl))); font-size: var(--text-m); }`,
  'beta-density-comparison-allentown': `:where(.beta-density-comparison-allentown[data-kinekt-structural-section]) { --kinekt-section-content-width: var(--content-width); --kinekt-section-reading-width: var(--width-l); --kinekt-section-gap: var(--section-space-l); }
:where(.beta-density-comparison-allentown[data-kinekt-structural-section]) .beta-density-comparison-allentown__header { text-align: center; }
:where(.beta-density-comparison-allentown[data-kinekt-structural-section]) .beta-density-comparison-allentown__header-content { margin-inline: auto; }
:where(.beta-density-comparison-allentown[data-kinekt-structural-section]) [class$='__table'] { margin-top: var(--kinekt-section-table-offset, var(--kiw--section-table-offset, var(--space-xl))); font-size: var(--text-m); }`,
  'beta-faq-allentown': `:where(.beta-faq-allentown[data-kinekt-structural-section]) { --kinekt-section-reading-width: var(--width-l); --kinekt-section-gap: var(--section-space-l); }
:where(.beta-faq-allentown[data-kinekt-structural-section]) .beta-faq-allentown__header { text-align: center; }
:where(.beta-faq-allentown[data-kinekt-structural-section]) .beta-faq-allentown__header-content { margin-inline: auto; }`,
  'beta-media-metrics-allentown': `:where(.beta-media-metrics-allentown[data-kinekt-structural-section]) { --kinekt-section-media-ratio: 4 / 5; --kinekt-section-gap: var(--section-space-xl); }`,
  'beta-form-section-allentown': `:where(.beta-form-section-allentown[data-kinekt-structural-section]) { --kinekt-section-reading-width: var(--width-m); --kinekt-section-gap: var(--section-space-l); }`,
  'beta-tabs-allentown': `:where(.beta-tabs-allentown[data-kinekt-structural-section]) { --kinekt-section-reading-width: var(--width-l); --kinekt-section-gap: var(--section-space-l); }`,
  'beta-featured-insights-allentown': `:where(.beta-featured-insights-allentown[data-kinekt-structural-section]) { --kinekt-section-card-columns: 3; --kinekt-section-card-min-width: var(--width-s); --kinekt-section-card-media-ratio: 3 / 2; --kinekt-section-gap: var(--section-space-xl); }
:where(.beta-featured-insights-allentown[data-kinekt-structural-section]) .beta-featured-insights-allentown__insight-sources { display: grid; grid-template-columns: minmax(0, 1fr); gap: 0; background: transparent; }
:where(.beta-featured-insights-allentown[data-kinekt-structural-section]) .beta-featured-insights-allentown__insight-sources > li > article { padding: var(--section-space-s) 0; border-width: 0 0 var(--kinekt-component-border-width); background: transparent; }
:where(.beta-featured-insights-allentown[data-kinekt-structural-section]) .beta-featured-insights-allentown__insight-sources > li:first-child > article { padding-top: 0; }
@media (min-width: 50rem) {
  :where(.beta-featured-insights-allentown[data-kinekt-structural-section]) .beta-featured-insights-allentown__insight-sources { grid-template-columns: repeat(2, minmax(0, 1fr)); column-gap: var(--section-space-l); }
  :where(.beta-featured-insights-allentown[data-kinekt-structural-section]) .beta-featured-insights-allentown__insight-sources > li:first-child { grid-row: span 3; }
  :where(.beta-featured-insights-allentown[data-kinekt-structural-section]) .beta-featured-insights-allentown__insight-sources > li:first-child > article { gap: var(--space-xl); }
}`,
}

function generatedComponentStyle(block) {
  const rules = generatedComponentRules[block]
  return rules ? `<style is:global>\n${rules}\n</style>` : ''
}

function from(values, index) {
  return values[index % values.length]
}

function previewText(key, index = 0) {
  if (/question/i.test(key)) return from(previewCopy.questions, index)
  if (/answer/i.test(key)) return from(previewCopy.answers, index)
  if (/(heading|title|name)/i.test(key)) return from(previewCopy.headings, index)
  if (/(label|eyebrow|accent)/i.test(key)) return from(previewCopy.accents, index)
  if (/quote/i.test(key)) return '“Clear interfaces and honest constraints make complex technical work easier to act on.”'
  if (/(description|text|summary|body)/i.test(key)) return from(previewCopy.descriptions, index)
  return from(previewCopy.descriptions, index)
}

const manifestDirectoriesList = await manifestDirectories(source)
const manifests = new Map(await Promise.all(manifestDirectoriesList.map(async (directory) => {
  const manifest = JSON.parse(await readFile(path.join(directory, 'manifest.json'), 'utf8'))
  return [manifest.id, manifest]
})))

function expandComponentFields(fields, ancestors = []) {
  return Object.fromEntries(Object.entries(fields).map(([key, field]) => {
    if (!field.componentId) return [key, field]
    if (ancestors.includes(field.componentId)) throw new Error(`Circular component manifest reference: ${[...ancestors, field.componentId].join(' -> ')}`)
    const component = manifests.get(field.componentId)
    if (!component) throw new Error(`Missing reusable component manifest: ${field.componentId}`)
    return [key, {
      ...field,
      fields: expandComponentFields(component.fields, [...ancestors, field.componentId]),
    }]
  }))
}

function sampleField(field, key, depth = 0, index = 0) {
  const child = field.componentId ? manifests.get(field.componentId) : null
  if (field.kind === 'component' && child && depth < 4) return sampleContent(child, depth + 1, index)
  if (field.kind === 'componentList' && child && depth < 4) return Array.from({ length: Math.max(field.minItems ?? 1, 3) }, (_, itemIndex) => sampleContent(child, depth + 1, itemIndex))
  if (field.kind === 'text' || field.kind === 'textarea' || field.kind === 'richText') return previewText(key, index)
  if (field.kind === 'select' || field.kind === 'theme') return field.options?.[0] ?? 'light'
  if (field.kind === 'media' || field.kind === 'video') return { url: `catalogue-asset:placeholder-1600x900.svg`, alt: 'Battery module and electrical interface', width: 1600, height: 900 }
  if (field.kind === 'mediaList') return Array.from({ length: Math.max(field.minItems ?? 1, 3) }, (_, itemIndex) => ({ url: `catalogue-asset:placeholder-1200x800.svg`, alt: from(['Battery enclosure on a workbench', 'Cell assembly detail', 'System integration test'], itemIndex), width: 1200, height: 800 }))
  if (field.kind === 'cta') return { label: 'Explore the specification', href: '#' }
  if (field.kind === 'ctaGroup') return { primary: { label: 'Talk to an expert', href: '#' }, secondary: { label: 'View technical details', href: '#' } }
  if (field.kind === 'formEmbed') return '<script src="https://js.hsforms.net/forms/embed/v2.js"></script>'
  if (field.kind === 'formReference') return { name: 'Project enquiry', description: 'A governed form reference for product, engineering and partnership enquiries.' }
  if (field.kind === 'infoItems' || field.kind === 'featureItems') return Array.from({ length: Math.max(field.minItems ?? 1, 3) }, (_, itemIndex) => from(['Validated operating range', 'Traceable test data', 'Integration-ready documentation'], itemIndex))
  if (field.kind === 'insightSourceList') return Array.from({ length: Math.max(field.minItems ?? 1, 3) }, (_, itemIndex) => ({ title: from(['How system constraints shape battery design', 'Making validation data useful for integration teams', 'A practical guide to energy-storage specifications'], itemIndex), excerpt: from(previewCopy.descriptions, itemIndex), href: '#', publishedAt: `2026-10-${String(itemIndex + 1).padStart(2, '0')}`, image: { url: `catalogue-asset:placeholder-1200x800.svg`, alt: from(['Engineering team reviewing test data', 'Battery system integration', 'Technical documentation review'], itemIndex), width: 1200, height: 800 } }))
  if (field.kind === 'contentReferenceList') return Array.from({ length: Math.max(field.minItems ?? 1, 3) }, (_, itemIndex) => ({ title: from(['How system constraints shape battery design', 'Making validation data useful for integration teams', 'A practical guide to energy-storage specifications'], itemIndex), excerpt: from(previewCopy.descriptions, itemIndex), href: '#', featured: itemIndex === 0, image: { url: `catalogue-asset:placeholder-1200x800.svg`, alt: from(['Engineering team reviewing test data', 'Battery system integration', 'Technical documentation review'], itemIndex), width: 1200, height: 800 } }))
  return Array.from({ length: Math.max(field.minItems ?? 1, 3) }, (_, itemIndex) => ({ title: from(previewCopy.headings, itemIndex), description: from(previewCopy.descriptions, itemIndex) }))
}

function caseStudiesPreview() {
  const studies = [
    {
      title: 'Remote inspection platform',
      description: 'A compact battery system was configured for repeated field deployment, reliable charging windows and straightforward service access.',
      results: [['Mission duration', '6.5 hours'], ['Charge cycles', '1,200+']],
      quote: '“The system data gave our engineering team a practical basis for planning each operating window.”',
      authorName: 'Mara Linden',
      authorRole: 'Programme lead',
    },
    {
      title: 'Autonomous material handling',
      description: 'The integration balanced peak power demand, thermal conditions and a mechanical envelope that could be serviced on site.',
      results: [['Peak output', '42 kW'], ['Operating range', '−10 to 45 °C']],
      quote: '“The technical choices were clear from the first review through to the final integration checks.”',
      authorName: 'Jonas Vermeer',
      authorRole: 'Engineering lead',
    },
    {
      title: 'Mobile energy unit',
      description: 'A modular pack combined predictable energy delivery with traceable test evidence for a changing operating profile.',
      results: [['System voltage', '400 V'], ['Available energy', '86 kWh']],
      quote: '“We could assess the trade-offs quickly because the specifications connected directly to the application.”',
      authorName: 'Ari Dijkstra',
      authorRole: 'Integration lead',
    },
    {
      title: 'Coastal monitoring network',
      description: 'The energy system was adapted for extended unattended operation, variable ambient temperatures and a tight maintenance cycle.',
      results: [['Service interval', '12 months'], ['Deployment sites', '18']],
      quote: '“The final configuration translates complex requirements into a system our operations team can maintain with confidence.”',
      authorName: 'Elena Vos',
      authorRole: 'Operations lead',
    },
  ]
  const avatars = [
    'case-study-quote-mara.webp',
    'case-study-quote-jonas.webp',
    'case-study-quote-ari.webp',
    'case-study-quote-elena.webp',
  ]
  const images = [
    { url: 'catalogue-asset:case-study-observatory.webp', alt: 'Observatory dome supporting a field energy system' },
    { url: 'catalogue-asset:case-study-towers.webp', alt: 'High-rise buildings in a dense urban district' },
    { url: 'catalogue-asset:case-study-buses.webp', alt: 'City buses parked in a depot' },
    { url: 'catalogue-asset:case-study-motorcycle.webp', alt: 'Motorcycle parked beside street signage' },
  ]



  return {
    theme: 'light',
    intro: {
      accentHeading: '/ Applied engineering',
      heading: 'Systems shaped by the work they do',
      description: 'A collection of fictional engineering scenarios showing how duty cycles, integration constraints and measurable outcomes inform the system design.',
    },
    sectionLabel: 'Field report',
    carousel: {
      items: studies.map((study, index) => ({
        logo: { url: `catalogue-asset:placeholder-180x48.svg`, alt: `Organisation ${index + 1} mark`, width: 180, height: 48 },
        title: study.title,
        description: study.description,
        image: { ...images[index], width: 680, height: 544 },
        results: study.results.map(([label, text]) => ({ label, value: { text } })),
        quote: {
          quote: study.quote,
          authorName: study.authorName,
          authorRole: study.authorRole,
          avatar: { url: `catalogue-asset:${avatars[index]}`, alt: 'Black-and-white placeholder portrait', width: 96, height: 96 },
        },
        cta: { cta: { label: 'Read the system brief', href: '#' } },
      })),
    },
    cta: { cta: { label: 'Browse field reports', href: '#' } },
  }
}

function heroPreview(manifest) {
  const hero = {
    'hero-allentown': {
      theme: 'dark',
      accentHeading: '/ Built for demanding systems',
      heading: 'Powering the next generation of electric mobility',
      description: 'A high-density battery platform for teams that need reliable performance, clear integration data and room to scale.',
      image: 'catalogue-asset:hero-allentown-buses.webp',
      alt: 'Electric buses in an urban mobility depot',
    },
    'hero-todos-santos': {
      theme: 'light',
      accentHeading: '/ Configurable by design',
      heading: 'Energy storage, made application-ready',
      description: 'Start from proven modules and configure the system around your application, operating environment and delivery plan.',
      image: 'catalogue-asset:hero-todos-santos-towers.webp',
      alt: 'Urban towers supplied by an integrated energy system',
      featureHeading: 'Designed for real-world operation',
      features: [
        { label: 'Voltage range', value: '24–800 V' },
        { label: 'Operating temperature', value: '−20 to 55 °C' },
        { label: 'Integration support', value: 'From prototype to production' },
      ],
    },
    'hero-trinity': {
      theme: 'dark',
      accentHeading: '/ High-density energy',
      heading: 'Engineered to keep critical systems moving',
      description: 'Battery systems for applications where performance, robustness and traceable engineering decisions are non-negotiable.',
      image: 'catalogue-asset:hero-trinity-street.webp',
      alt: 'Urban infrastructure operating in a field environment',
    },
  }[manifest.slug]

  if (!hero) return null
  const media = { url: hero.image, alt: hero.alt, width: 1600, height: 900 }
  return {
    theme: hero.theme,
    intro: { accentHeading: hero.accentHeading, heading: hero.heading, description: hero.description },
    ctas: { primary: { label: 'Talk to an expert', href: '#' }, secondary: { label: 'Explore the platform', href: '#' } },
    image: media,
    ...(manifest.slug !== 'hero-todos-santos' && { mobileImage: media }),
    ...('featureHeading' in hero && { featureHeading: hero.featureHeading, features: hero.features }),
  }
}

function proofMetricsPreview() {
  return {
    theme: 'light',
    intro: {
      accentHeading: 'Proof in practice',
      heading: 'Evidence that supports confident technical decisions',
      description: 'Use measurable proof points to connect the work, its operating context and its outcome.',
    },
    metrics: [
      { label: 'Validated process', value: { text: 'Documented from review through release.' } },
      { label: 'Clear inputs', value: { text: 'Requirements visible to every stakeholder.' } },
      { label: 'Measured outcomes', value: { text: 'Evidence ready for practical comparison.' } },
      { label: 'Direct support', value: { text: 'Expert guidance at each decision point.' } },
    ],
    media: {
      url: 'catalogue-asset:placeholder-1296x406.svg',
      alt: 'Abstract grayscale placeholder for proof media',
      width: 1296,
      height: 406,
    },
    callout: {
      label: 'Next step',
      intro: {
        heading: 'Turn evidence into a clear next decision',
        description: 'Review the relevant details with the people responsible for the next stage.',
      },
      cta: { cta: { label: 'Start a conversation', href: '#' } },
    },
  }
}

function sampleContent(manifest, depth = 0, index = 0) {
  const hero = depth === 0 && heroPreview(manifest)
  if (hero) return hero
  if (depth === 0 && manifest.slug === 'case-studies-allentown') return caseStudiesPreview()
  if (depth === 0 && manifest.slug === 'proof-metrics-allentown') return proofMetricsPreview()
  return Object.fromEntries(Object.entries(manifest.fields).map(([key, field]) => [key, sampleField(field, key, depth, index)]))
}

function previewFields(manifest, depth = 0) {
  return Object.fromEntries(Object.entries(manifest.fields).map(([key, field]) => {
    const child = field.componentId ? manifests.get(field.componentId) : null
    return [key, {
      kind: field.kind,
      ...(child && {
        id: child.id,
        role: child.role,
        ...(depth < 4 ? { fields: previewFields(child, depth + 1) } : {}),
      }),
    }]
  }))
}
async function materialize(filename, source, force = false) {
  try {
    const existing = await readFile(filename, 'utf8')
    const generatedStructuralPayload = filename.endsWith('.payload.ts') && source.includes('structuralSectionToProps')
    if (!force && !generatedStructuralPayload && !existing.includes('@generated structural section')) return
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error
  }
  await writeFile(filename, source)
}

for (const directory of await manifestDirectories(sections)) {
  const manifest = JSON.parse(await readFile(path.join(directory, 'manifest.json'), 'utf8'))

  manifest.fields = expandComponentFields(manifest.fields)
  const relativeAstro = path.relative(directory, path.join(source, 'shared', 'structural-section.astro')).split(path.sep).join('/')
  const relativeAdapter = path.relative(directory, path.join(source, 'shared', 'manifest-block.js')).split(path.sep).join('/')
  const importAstro = relativeAstro.startsWith('.') ? relativeAstro : `./${relativeAstro}`
  const importAdapter = relativeAdapter.startsWith('.') ? relativeAdapter : `./${relativeAdapter}`
  const importStructuralAdapter = importAdapter.replace('manifest-block.js', 'structural-props.js')
  const prefix = manifest.status === 'released' ? '' : 'beta-'
  const name = pascalCase(`${prefix}${manifest.slug}`)
  const base = manifest.slug
  const structuralAdapter = new Set([
    'solution-list-allentown',
    'process-story-trinity',
    'comparison-overview-allentown',
    'density-comparison-allentown',
    'featured-insights-allentown',
  ]).has(manifest.slug)
  const caseStudiesContract = manifest.slug === 'case-studies-allentown'
  const solutionListContract = manifest.slug === 'solution-list-allentown'
  const formSectionContract = manifest.slug === 'form-section-allentown'
  const block = `${prefix}${manifest.slug}`
  const previewContent = sampleContent(manifest)
  const fields = previewFields(manifest)
  const previewIntro = previewContent.intro ?? { accentHeading: 'Section overview', heading: manifest.title, description: 'A reusable content structure for technical decisions.' }
  const mediaMetricsTypes = `import type { Media, SectionIntro } from '../../../shared/content.js'
import type { BetaTheme } from '../../../shared/payload.js'

export interface MediaMetric {
  label: string
  value: { text: string; icon?: string }
}

export interface MediaMetricsAllentownContent {
  theme: BetaTheme
  intro: SectionIntro
  metrics: MediaMetric[]
  media?: Media | null
}

type DraftFields<T> = { [Field in keyof T]?: T[Field] | null }
type PayloadID = string | number

export interface PayloadMediaMetricsAllentownDocument extends DraftFields<Omit<MediaMetricsAllentownContent, 'intro' | 'metrics' | 'media'>> {
  blockType?: string
  intro?: { accentHeading?: string | null; heading?: string | null; description?: unknown } | null
  metrics?: Array<{ label?: string | null; value?: { text?: string | null; icon?: string | null } | null }> | null
  media?: (DraftFields<Media> & { id?: PayloadID }) | PayloadID | null
}
`
  const mediaMetricsPayload = `import type { Block, CollectionSlug } from 'payload'
import { createManifestBlock } from '../../../shared/manifest-block.js'
import { richTextToHtml } from '../../../shared/rich-text.js'
import { mediaToProps, optionalText, requireArray, requireObject, requireText, requireTheme, type PayloadAdapterOptions } from '../../../shared/payload.js'
import type { MediaMetricsAllentownContent, PayloadMediaMetricsAllentownDocument } from './${base}.types.js'

const manifest = ${JSON.stringify({ slug: manifest.slug, title: manifest.title, status: manifest.status, fields: manifest.fields }, null, 2)} as const

export interface CreateMediaMetricsAllentownBlockOptions { mediaCollection?: CollectionSlug; formCollection?: CollectionSlug }

export function createMediaMetricsAllentownBlock(options: CreateMediaMetricsAllentownBlockOptions = {}): Block {
  return createManifestBlock(manifest, options)
}

export function mediaMetricsAllentownToProps(data: PayloadMediaMetricsAllentownDocument, options: PayloadAdapterOptions = {}): MediaMetricsAllentownContent {
  const intro = requireObject(data.intro, 'intro')
  const media = data.media

  return {
    theme: requireTheme(data.theme),
    intro: {
      accentHeading: optionalText(intro.accentHeading, 'intro.accentHeading'),
      heading: requireText(intro.heading, 'intro.heading'),
      ...(intro.description ? { description: { html: richTextToHtml(intro.description, 'intro.description') } } : {}),
    },
    metrics: requireArray(data.metrics, 'metrics').map((item, index) => {
      const metric = requireObject(item, 'metrics[' + index + ']')
      const value = requireObject(metric.value, 'metrics[' + index + '].value')
      const icon = optionalText(value.icon, 'metrics[' + index + '].value.icon')

      return {
        label: requireText(metric.label, 'metrics[' + index + '].label'),
        value: {
          text: requireText(value.text, 'metrics[' + index + '].value.text'),
          ...(icon ? { icon } : {}),
        },
      }
    }),
    ...(media === undefined ? {} : { media: media === null ? null : mediaToProps(media, 'media', options) }),
  }
}
`
  const catalogueAssetResolver = `const catalogueBase = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : \`\${import.meta.env.BASE_URL}/\`

function resolveCatalogueAssets(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(resolveCatalogueAssets)
  if (!value || typeof value !== 'object') return value
  const record = Object.fromEntries(Object.entries(value).map(([key, item]) => [key, resolveCatalogueAssets(item)]))
  if (typeof record.url === 'string' && record.url.startsWith('catalogue-asset:')) {
    record.url = \`\${catalogueBase}placeholders/\${record.url.slice('catalogue-asset:'.length)}\`
  }
  return record
}`
  const mediaMetricsPreview = `---
import MediaMetricsAllentown from './${base}.astro'

const rawContent = {
  intro: {
    accentHeading: '/ Production base',
    heading: 'Built to scale from the Netherlands',
    description: 'Tulip’s production facilities in the Netherlands are set up to turn validated battery designs into repeatable, scalable production. From controlled assembly and testing to traceable production records, the focus is on delivering consistent quality as customer programs grow.'
  },
  metrics: [
    { label: 'Units / month capacity', value: { text: 'XX,000+' } },
    { label: 'Packs / year potential', value: { text: 'XX M' } },
    { label: 'Individual pack testing', value: { text: '100%' } },
    { label: 'Qualified suppliers', value: { text: 'XXX+' } }
  ],
  media: {
    url: 'catalogue-asset:placeholder-688x406.svg',
    alt: 'Battery pack production line in the Netherlands',
    width: 688,
    height: 406
  }
}
${catalogueAssetResolver}

const content = resolveCatalogueAssets(rawContent) as typeof rawContent
---
<MediaMetricsAllentown theme="semi-light" {...content} />
`
  const previewCtas = previewContent.ctas ?? previewContent.ctaGroup
  const previewMedia = previewContent.media
  const caseStudiesTypes = `// Case Studies contract type entrypoint.\nexport type { CaseStudiesAllentownContent, CaseStudyCtaIcon, CaseStudyResult, CaseStudySlide, PayloadCaseStudiesAllentownDocument } from './case-studies-allentown.contract.js'\n`
  const caseStudiesPayload = `// Case Studies contract entrypoint.\nexport { caseStudiesAllentownToProps, createCaseStudiesAllentownBlock } from './case-studies-allentown.contract.js'\nexport type { CaseStudiesAllentownAdapterOptions, CreateCaseStudiesAllentownBlockOptions } from './case-studies-allentown.contract.js'\n`
  const solutionListTypes = `// Solution List native Payload contract type entrypoint.\nexport type { PayloadSolutionListAllentownDocument, SolutionListAllentownContent, SolutionListAllentownItem } from './solution-list-allentown.contract.js'\n`
  const solutionListPayload = `// Solution List native Payload contract entrypoint.\nexport { createSolutionListAllentownBlock, solutionListAllentownToProps } from './solution-list-allentown.contract.js'\nexport type { CreateSolutionListAllentownBlockOptions, PayloadSolutionListAllentownDocument, SolutionListAllentownAdapterOptions, SolutionListAllentownContent, SolutionListAllentownItem } from './solution-list-allentown.contract.js'\n`
  const formSectionTypes = `// Form Section native Payload contract type entrypoint.\nexport type { BetaFormSectionAllentownContent, ContactMethod, ContactMethodIcon, FormSectionImagePosition, PayloadBetaFormSectionAllentownDocument } from './form-section-allentown.contract.js'\n`

  await materialize(path.join(directory, `${base}.astro`), `---\n// @generated structural section — source manifest remains the contract.\nimport StructuralSection from '${importAstro}'\n\nconst props = Astro.props\nconst fields = ${JSON.stringify(fields, null, 2)}\n---\n<StructuralSection block=${JSON.stringify(block)} fields={fields} {...props} />\n${sectionTokenBridgeCss(block)}\n${generatedComponentStyle(block)}\n`)
  await materialize(path.join(directory, `${base}.types.ts`), manifest.slug === 'media-metrics-allentown'
    ? mediaMetricsTypes
    : caseStudiesContract
      ? caseStudiesTypes
      : solutionListContract
        ? solutionListTypes
        : formSectionContract
          ? formSectionTypes
          : `// @generated structural section — source manifest remains the contract.\nexport type ${name}Content = Record<string, unknown>\nexport type Payload${name}Document = ${name}Content & { id?: string }\n`, manifest.slug === 'media-metrics-allentown' || solutionListContract || formSectionContract)
  await materialize(path.join(directory, `${base}.payload.ts`), manifest.slug === 'media-metrics-allentown'
    ? mediaMetricsPayload
    : caseStudiesContract
      ? caseStudiesPayload
      : solutionListContract
        ? solutionListPayload
        : structuralAdapter
          ? `import type { Block, CollectionSlug } from 'payload'\nimport { createManifestBlock } from '${importAdapter}'\nimport { structuralSectionToProps } from '${importStructuralAdapter}'\nimport type { PayloadAdapterOptions } from '../../../shared/payload.js'\nimport type { ${name}Content, Payload${name}Document } from './${base}.types.js'\n\nconst manifest = ${JSON.stringify({ slug: manifest.slug, title: manifest.title, status: manifest.status, fields: manifest.fields }, null, 2)} as const\n\nexport interface Create${name}BlockOptions { mediaCollection?: CollectionSlug; formCollection?: CollectionSlug; targetCollections?: CollectionSlug[] }\n\nexport function create${name}Block(options: Create${name}BlockOptions = {}): Block {\n  return createManifestBlock(manifest, options)\n}\n\nexport function ${name[0].toLowerCase() + name.slice(1)}ToProps(data: Payload${name}Document, options: PayloadAdapterOptions = {}): ${name}Content {\n  return structuralSectionToProps(data, options)\n}\n`
          : `// @generated structural section — source manifest remains the contract.\nimport type { Block, CollectionSlug } from 'payload'\nimport { createManifestBlock, manifestToProps } from '${importAdapter}'\nimport type { ${name}Content, Payload${name}Document } from './${base}.types.js'\n\nconst manifest = ${JSON.stringify({ slug: manifest.slug, title: manifest.title, status: manifest.status, fields: manifest.fields }, null, 2)} as const\n\nexport interface Create${name}BlockOptions { mediaCollection?: CollectionSlug; formCollection?: CollectionSlug; targetCollections?: CollectionSlug[] }\n\nexport function create${name}Block(options: Create${name}BlockOptions = {}): Block {\n  return createManifestBlock(manifest, options)\n}\n\nexport function ${name[0].toLowerCase() + name.slice(1)}ToProps(data: Payload${name}Document): ${name}Content {\n  return manifestToProps(data)\n}\n`, manifest.slug === 'media-metrics-allentown' || solutionListContract)
  const previewSource = manifest.slug === 'media-metrics-allentown'
    ? mediaMetricsPreview
    : manifest.slug === 'proof-metrics-allentown'
      ? `---
import ProofMetricsAllentown from './${base}.astro'

const rawContent = ${JSON.stringify(previewContent, null, 2)}
${catalogueAssetResolver}

const content = resolveCatalogueAssets(rawContent) as typeof rawContent
---
<ProofMetricsAllentown {...content} />
`
    : `---
// @generated structural section preview.
import StructuralSection from '${importAstro}'

const content = ${JSON.stringify(previewContent, null, 2)}
const fields = ${JSON.stringify(fields, null, 2)}
const intro = ${JSON.stringify(previewIntro, null, 2)}
const ctas = ${JSON.stringify(previewCtas, null, 2)}
const media = ${JSON.stringify(previewMedia, null, 2)}
${catalogueAssetResolver}

const resolvedContent = resolveCatalogueAssets(content) as Record<string, unknown>
const resolvedMedia = resolveCatalogueAssets(media) as typeof media
---
<StructuralSection block=${JSON.stringify(block)} intro={intro} ctas={ctas} media={resolvedMedia} content={resolvedContent} fields={fields} />
${sectionTokenBridgeCss(block)}
${generatedComponentStyle(block)}
`
  await materialize(path.join(directory, `${base}.preview.astro`), previewSource, manifest.slug === 'media-metrics-allentown')
}
