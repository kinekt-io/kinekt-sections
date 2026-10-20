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

function sampleField(field, key, depth = 0, index = 0) {
  const child = field.componentId ? manifests.get(field.componentId) : null
  if (field.kind === 'component' && child && depth < 4) return sampleContent(child, depth + 1, index)
  if (field.kind === 'componentList' && child && depth < 4) return Array.from({ length: Math.max(field.minItems ?? 1, 3) }, (_, itemIndex) => sampleContent(child, depth + 1, itemIndex))
  if (field.kind === 'text' || field.kind === 'textarea' || field.kind === 'richText') return previewText(key, index)
  if (field.kind === 'select' || field.kind === 'theme') return field.options?.[0] ?? 'light'
  if (field.kind === 'media' || field.kind === 'video') return { url: `https://placehold.co/1600x900/png?text=${encodeURIComponent(labelFor(key))}`, alt: 'Battery module and electrical interface', width: 1600, height: 900 }
  if (field.kind === 'mediaList') return Array.from({ length: Math.max(field.minItems ?? 1, 3) }, (_, itemIndex) => ({ url: `https://placehold.co/1200x800/png?text=${encodeURIComponent(`${labelFor(key)}+${itemIndex + 1}`)}`, alt: from(['Battery enclosure on a workbench', 'Cell assembly detail', 'System integration test'], itemIndex), width: 1200, height: 800 }))
  if (field.kind === 'cta') return { label: 'Explore the specification', href: '#' }
  if (field.kind === 'ctaGroup') return { primary: { label: 'Talk to an expert', href: '#' }, secondary: { label: 'View technical details', href: '#' } }
  if (field.kind === 'formReference') return { name: 'Project enquiry', description: 'A governed form reference for product, engineering and partnership enquiries.' }
  if (field.kind === 'infoItems' || field.kind === 'featureItems') return Array.from({ length: Math.max(field.minItems ?? 1, 3) }, (_, itemIndex) => from(['Validated operating range', 'Traceable test data', 'Integration-ready documentation'], itemIndex))
  if (field.kind === 'insightSourceList') return Array.from({ length: Math.max(field.minItems ?? 1, 3) }, (_, itemIndex) => ({ title: from(['How system constraints shape battery design', 'Making validation data useful for integration teams', 'A practical guide to energy-storage specifications'], itemIndex), excerpt: from(previewCopy.descriptions, itemIndex), href: '#', publishedAt: `2026-10-${String(itemIndex + 1).padStart(2, '0')}`, image: { url: `https://placehold.co/1200x800/png?text=Insight+${itemIndex + 1}`, alt: from(['Engineering team reviewing test data', 'Battery system integration', 'Technical documentation review'], itemIndex), width: 1200, height: 800 } }))
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
        logo: { url: `https://placehold.co/180x48/png?text=Organisation+${index + 1}`, alt: `Organisation ${index + 1} mark`, width: 180, height: 48 },
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
      url: 'https://placehold.co/1296x406/png?text=Proof+media',
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
    if (!force && !existing.includes('@generated structural section')) return
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error
  }
  await writeFile(filename, source)
}

for (const directory of await manifestDirectories(sections)) {
  const manifest = JSON.parse(await readFile(path.join(directory, 'manifest.json'), 'utf8'))

  const relativeAstro = path.relative(directory, path.join(source, 'shared', 'structural-section.astro')).split(path.sep).join('/')
  const relativeAdapter = path.relative(directory, path.join(source, 'shared', 'manifest-block.js')).split(path.sep).join('/')
  const importAstro = relativeAstro.startsWith('.') ? relativeAstro : `./${relativeAstro}`
  const importAdapter = relativeAdapter.startsWith('.') ? relativeAdapter : `./${relativeAdapter}`
  const prefix = manifest.status === 'released' ? '' : 'beta-'
  const name = pascalCase(`${prefix}${manifest.slug}`)
  const base = manifest.slug
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
import { createManifestBlock, manifestToProps } from '../../../shared/manifest-block.js'
import type { MediaMetricsAllentownContent, PayloadMediaMetricsAllentownDocument } from './${base}.types.js'

const manifest = ${JSON.stringify({ slug: manifest.slug, title: manifest.title, status: manifest.status, fields: manifest.fields }, null, 2)} as const

export interface CreateMediaMetricsAllentownBlockOptions { mediaCollection?: CollectionSlug; formCollection?: CollectionSlug }

export function createMediaMetricsAllentownBlock(options: CreateMediaMetricsAllentownBlockOptions = {}): Block {
  return createManifestBlock(manifest, options)
}

export function mediaMetricsAllentownToProps(data: PayloadMediaMetricsAllentownDocument): MediaMetricsAllentownContent {
  return manifestToProps(data) as MediaMetricsAllentownContent
}
`
  const mediaMetricsPreview = `---
import MediaMetricsAllentown from './${base}.astro'

const content = {
  theme: 'light',
  intro: {
    accentHeading: 'Operational proof points',
    heading: 'The figures that support the next technical decision',
    description: 'A concise view of measurable outcomes, engineering context and the system evidence teams need to compare options.'
  },
  metrics: [
    { label: 'Validated test plans', value: { text: '24' } },
    { label: 'Configured systems', value: { text: '180+' } },
    { label: 'Operating range', value: { text: '−20 to 55 °C' } },
    { label: 'Engineering support', value: { text: 'From concept to release' } }
  ],
  media: {
    url: 'https://placehold.co/688x406/png?text=Supporting+media',
    alt: 'Abstract grayscale placeholder for supporting media',
    width: 688,
    height: 406
  }
}
---
<MediaMetricsAllentown {...content} />
`
  const previewCtas = previewContent.ctas ?? previewContent.ctaGroup
  const previewMedia = previewContent.media

  await materialize(path.join(directory, `${base}.astro`), `---\n// @generated structural section — source manifest remains the contract.\nimport StructuralSection from '${importAstro}'\n\nconst props = Astro.props\nconst fields = ${JSON.stringify(fields, null, 2)}\n---\n<StructuralSection block=${JSON.stringify(block)} fields={fields} {...props} />\n`)
  await materialize(path.join(directory, `${base}.types.ts`), manifest.slug === 'media-metrics-allentown'
    ? mediaMetricsTypes
    : `// @generated structural section — source manifest remains the contract.\nexport type ${name}Content = Record<string, unknown>\nexport type Payload${name}Document = ${name}Content & { id?: string }\n`, manifest.slug === 'media-metrics-allentown')
  await materialize(path.join(directory, `${base}.payload.ts`), manifest.slug === 'media-metrics-allentown'
    ? mediaMetricsPayload
    : `// @generated structural section — source manifest remains the contract.\nimport type { Block, CollectionSlug } from 'payload'\nimport { createManifestBlock, manifestToProps } from '${importAdapter}'\nimport type { ${name}Content, Payload${name}Document } from './${base}.types.js'\n\nconst manifest = ${JSON.stringify({ slug: manifest.slug, title: manifest.title, status: manifest.status, fields: manifest.fields }, null, 2)} as const\n\nexport interface Create${name}BlockOptions { mediaCollection?: CollectionSlug; formCollection?: CollectionSlug }\n\nexport function create${name}Block(options: Create${name}BlockOptions = {}): Block {\n  return createManifestBlock(manifest, options)\n}\n\nexport function ${name[0].toLowerCase() + name.slice(1)}ToProps(data: Payload${name}Document): ${name}Content {\n  return manifestToProps(data)\n}\n`, manifest.slug === 'media-metrics-allentown')
  const previewSource = manifest.slug === 'media-metrics-allentown'
    ? mediaMetricsPreview
    : manifest.slug === 'proof-metrics-allentown'
      ? `---
import ProofMetricsAllentown from './${base}.astro'

const content = ${JSON.stringify(previewContent, null, 2)}
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
const catalogueBase = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : \`\${import.meta.env.BASE_URL}/\`

function resolveCatalogueAssets(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(resolveCatalogueAssets)
  if (!value || typeof value !== 'object') return value
  const record = Object.fromEntries(Object.entries(value).map(([key, item]) => [key, resolveCatalogueAssets(item)]))
  if (typeof record.url === 'string' && record.url.startsWith('catalogue-asset:')) {
    record.url = \`\${catalogueBase}placeholders/\${record.url.slice('catalogue-asset:'.length)}\`
  }
  return record
}

const resolvedContent = resolveCatalogueAssets(content) as Record<string, unknown>
---
<StructuralSection block=${JSON.stringify(block)} intro={intro} ctas={ctas} media={media} content={resolvedContent} fields={fields} />
`
  await materialize(path.join(directory, `${base}.preview.astro`), previewSource, manifest.slug === 'media-metrics-allentown')
}
