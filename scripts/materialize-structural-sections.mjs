import { readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const source = path.join(root, 'src')
const sections = path.join(source, 'sections')
const tulipOnlySlugs = new Set(['hd-cells-engineering-allentown', 'homepage-problem-solution-allentown'])

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
    'Engineering energy storage for demanding applications',
    'Designed around the constraints that matter',
    'Performance you can specify with confidence',
  ],
  accents: ['Battery systems', 'Built for the field', 'From cell to system'],
  descriptions: [
    'A representative introduction that shows how longer copy, links and lists will behave once a component is connected to real content.',
    'Use this space to explain the decision, the technical context and the next step without reducing the layout to placeholder labels.',
    'Every example uses realistic-length content so hierarchy, reading rhythm and responsive behaviour are visible before site-specific styling is applied.',
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

function exampleText(key, index = 0) {
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
  if (field.kind === 'text' || field.kind === 'textarea' || field.kind === 'richText') return exampleText(key, index)
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
      title: 'Example long-range mission',
      description: 'This placeholder case demonstrates how a technical application can combine performance targets, system integration and measurable outcomes.',
      results: [['Performance metric', 'Example result'], ['System metric', 'Example result']],
      quote: '“This placeholder quote demonstrates the intended quote, author and attribution structure.”',
      authorName: 'Example person 1',
      authorRole: 'Example role',
    },
    {
      title: 'Example product application',
      description: 'Representative copy used to inspect the card hierarchy, responsive media treatment and the relationship between supporting content.',
      results: [['Performance metric', 'Example result'], ['System metric', 'Example result']],
      quote: '“This placeholder quote is only here to show the component’s expected content structure.”',
      authorName: 'Example person 2',
      authorRole: 'Example role',
    },
    {
      title: 'Example system scenario',
      description: 'A neutral content sample for validating the carousel, result cards and quote attribution without client-specific claims.',
      results: [['Performance metric', 'Example result'], ['System metric', 'Example result']],
      quote: '“This example shows how the attribution remains grouped with its quote.”',
      authorName: 'Example person 3',
      authorRole: 'Example role',
    },
    {
      title: 'Example integration case',
      description: 'Neutral preview copy for testing the information hierarchy and layout across a complete carousel item.',
      results: [['Performance metric', 'Example result'], ['System metric', 'Example result']],
      quote: '“This placeholder completes the final preview slide without representing a customer or product.”',
      authorName: 'Example person 4',
      authorRole: 'Example role',
    },
  ]

  return {
    theme: 'light',
    intro: {
      accentHeading: '/ Proven performance',
      heading: 'Our client successes',
      description: 'Examples of high-density battery systems designed around the conditions, constraints and performance targets of each application.',
    },
    sectionLabel: 'Case study',
    carousel: {
      items: studies.map((study, index) => ({
        logo: { url: `https://placehold.co/180x48/png?text=Partner+${index + 1}`, alt: `Partner ${index + 1} logo`, width: 180, height: 48 },
        title: study.title,
        description: study.description,
        image: { url: 'catalogue-placeholder:case-study-observatory.webp', alt: 'Observatory dome used as a technical case-study placeholder', width: 680, height: 544 },
        results: study.results.map(([label, text]) => ({ label, value: { text } })),
        quote: {
          quote: study.quote,
          authorName: study.authorName,
          authorRole: study.authorRole,
          avatar: { url: `https://placehold.co/96x96/png?text=${index + 1}`, alt: `${study.authorName} portrait`, width: 96, height: 96 },
        },
        cta: { cta: { label: 'Read this case', href: '#' } },
      })),
    },
    cta: { cta: { label: 'View all cases', href: '#' } },
  }
}

function heroPreview(manifest) {
  const hero = {
    'hero-allentown': {
      theme: 'light',
      accentHeading: '/ Built for demanding systems',
      heading: 'Powering the next generation of electric mobility',
      description: 'A high-density battery platform for teams that need reliable performance, clear integration data and room to scale.',
      image: 'catalogue-placeholder:hero-allentown-buses.webp',
      alt: 'Electric buses used as a mobility placeholder',
    },
    'hero-todos-santos': {
      theme: 'light',
      accentHeading: '/ Configurable by design',
      heading: 'Energy storage, made application-ready',
      description: 'Start from proven modules and configure the system around your application, operating environment and delivery plan.',
      image: 'catalogue-placeholder:hero-todos-santos-towers.webp',
      alt: 'Urban towers used as an infrastructure placeholder',
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
      image: 'catalogue-placeholder:hero-trinity-street.webp',
      alt: 'Urban infrastructure used as a field-operations placeholder',
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

function sampleContent(manifest, depth = 0, index = 0) {
  const hero = depth === 0 && heroPreview(manifest)
  if (hero) return hero
  if (depth === 0 && manifest.slug === 'case-studies-allentown') return caseStudiesPreview()
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

async function materialize(filename, source) {
  try {
    const existing = await readFile(filename, 'utf8')
    if (!existing.includes('@generated structural section')) return
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error
  }
  await writeFile(filename, source)
}

for (const directory of await manifestDirectories(sections)) {
  const manifest = JSON.parse(await readFile(path.join(directory, 'manifest.json'), 'utf8'))
  if (tulipOnlySlugs.has(manifest.slug)) continue

  const relativeAstro = path.relative(directory, path.join(source, 'shared', 'structural-section.astro')).split(path.sep).join('/')
  const relativeAdapter = path.relative(directory, path.join(source, 'shared', 'manifest-block.js')).split(path.sep).join('/')
  const importAstro = relativeAstro.startsWith('.') ? relativeAstro : `./${relativeAstro}`
  const importAdapter = relativeAdapter.startsWith('.') ? relativeAdapter : `./${relativeAdapter}`
  const name = pascalCase(`beta-${manifest.slug}`)
  const base = manifest.slug
  const previewContent = sampleContent(manifest)
  const fields = previewFields(manifest)
  const previewIntro = previewContent.intro ?? { accentHeading: 'Beta section', heading: manifest.title, description: 'Representative catalogue content.' }
  const previewCtas = previewContent.ctas ?? previewContent.ctaGroup
  const previewMedia = previewContent.media

  await materialize(path.join(directory, `${base}.astro`), `---\n// @generated structural section — source manifest remains the contract.\nimport StructuralSection from '${importAstro}'\n\nconst props = Astro.props\nconst fields = ${JSON.stringify(fields, null, 2)}\n---\n<StructuralSection block=${JSON.stringify(`beta-${manifest.slug}`)} fields={fields} {...props} />\n`)
  await materialize(path.join(directory, `${base}.types.ts`), `// @generated structural section — source manifest remains the contract.\nexport type ${name}Content = Record<string, unknown>\nexport type Payload${name}Document = ${name}Content & { id?: string }\n`)
  await materialize(path.join(directory, `${base}.payload.ts`), `// @generated structural section — source manifest remains the contract.\nimport type { Block, CollectionSlug } from 'payload'\nimport { createManifestBlock, manifestToProps } from '${importAdapter}'\nimport type { ${name}Content, Payload${name}Document } from './${base}.types.js'\n\nconst manifest = ${JSON.stringify({ slug: manifest.slug, title: manifest.title, fields: manifest.fields }, null, 2)} as const\n\nexport interface Create${name}BlockOptions { mediaCollection?: CollectionSlug; formCollection?: CollectionSlug }\n\nexport function create${name}Block(options: Create${name}BlockOptions = {}): Block {\n  return createManifestBlock(manifest, options)\n}\n\nexport function ${name[0].toLowerCase() + name.slice(1)}ToProps(data: Payload${name}Document): ${name}Content {\n  return manifestToProps(data)\n}\n`)
  const previewSource = `---
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
  if (typeof record.url === 'string' && record.url.startsWith('catalogue-placeholder:')) {
    record.url = \`\${catalogueBase}placeholders/\${record.url.slice('catalogue-placeholder:'.length)}\`
  }
  return record
}

const resolvedContent = resolveCatalogueAssets(content) as Record<string, unknown>
---
<StructuralSection block=${JSON.stringify(`beta-${manifest.slug}`)} intro={intro} ctas={ctas} media={media} content={resolvedContent} fields={fields} />
`
  await materialize(path.join(directory, `${base}.preview.astro`), previewSource)
}
