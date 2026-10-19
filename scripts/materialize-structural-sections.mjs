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

function exampleText(key, index = 0) {
  const label = labelFor(key)
  if (/(heading|title|name)/i.test(key)) return `${label} ${index + 1}`
  if (/(label|eyebrow|accent)/i.test(key)) return `Example ${label}`
  if (/(description|text|summary|body|quote)/i.test(key)) return `Representative ${label.toLowerCase()} that demonstrates the complete content contract for this section.`
  return `Example ${label} ${index + 1}`
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
  if (field.kind === 'media' || field.kind === 'video') return { url: `https://placehold.co/1600x900/png?text=${encodeURIComponent(labelFor(key))}`, alt: `Example ${labelFor(key).toLowerCase()}`, width: 1600, height: 900 }
  if (field.kind === 'mediaList') return Array.from({ length: Math.max(field.minItems ?? 1, 3) }, (_, itemIndex) => ({ url: `https://placehold.co/1200x800/png?text=${encodeURIComponent(`${labelFor(key)}+${itemIndex + 1}`)}`, alt: `Example ${labelFor(key).toLowerCase()} ${itemIndex + 1}`, width: 1200, height: 800 }))
  if (field.kind === 'cta') return { label: `Explore ${labelFor(key).toLowerCase()}`, href: '#' }
  if (field.kind === 'ctaGroup') return { primary: { label: 'Primary action', href: '#' }, secondary: { label: 'Secondary action', href: '#' } }
  if (field.kind === 'formReference') return { name: 'Example contact form', description: 'A centrally governed form reference with its own questions and validation.' }
  if (field.kind === 'insightSourceList') return Array.from({ length: Math.max(field.minItems ?? 1, 3) }, (_, itemIndex) => ({ title: `Example insight ${itemIndex + 1}`, href: '#' }))
  return Array.from({ length: Math.max(field.minItems ?? 1, 3) }, (_, itemIndex) => ({ title: `${labelFor(key)} ${itemIndex + 1}`, description: exampleText('description', itemIndex) }))
}

function sampleContent(manifest, depth = 0, index = 0) {
  return Object.fromEntries(Object.entries(manifest.fields).map(([key, field]) => [key, sampleField(field, key, depth, index)]))
}

function previewFields(manifest, depth = 0) {
  return Object.fromEntries(Object.entries(manifest.fields).map(([key, field]) => {
    const child = field.componentId ? manifests.get(field.componentId) : null
    return [key, {
      kind: field.kind,
      ...(child && depth < 4 ? { fields: previewFields(child, depth + 1) } : {}),
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
  const previewCtas = previewContent.ctas ?? previewContent.ctaGroup ?? (previewContent.cta ? { primary: previewContent.cta } : undefined)
  const previewMedia = previewContent.media ?? previewContent.image ?? previewContent.heroMedia

  await materialize(path.join(directory, `${base}.astro`), `---\n// @generated structural section — source manifest remains the contract.\nimport StructuralSection from '${importAstro}'\n\nconst props = Astro.props\n---\n<StructuralSection block=${JSON.stringify(`beta-${manifest.slug}`)} {...props} />\n`)
  await materialize(path.join(directory, `${base}.types.ts`), `// @generated structural section — source manifest remains the contract.\nexport type ${name}Content = Record<string, unknown>\nexport type Payload${name}Document = ${name}Content & { id?: string }\n`)
  await materialize(path.join(directory, `${base}.payload.ts`), `// @generated structural section — source manifest remains the contract.\nimport type { Block, CollectionSlug } from 'payload'\nimport { createManifestBlock, manifestToProps } from '${importAdapter}'\nimport type { ${name}Content, Payload${name}Document } from './${base}.types.js'\n\nconst manifest = ${JSON.stringify({ slug: manifest.slug, title: manifest.title, fields: manifest.fields }, null, 2)} as const\n\nexport interface Create${name}BlockOptions { mediaCollection?: CollectionSlug; formCollection?: CollectionSlug }\n\nexport function create${name}Block(options: Create${name}BlockOptions = {}): Block {\n  return createManifestBlock(manifest, options)\n}\n\nexport function ${name[0].toLowerCase() + name.slice(1)}ToProps(data: Payload${name}Document): ${name}Content {\n  return manifestToProps(data)\n}\n`)
  await materialize(path.join(directory, `${base}.preview.astro`), `---\n// @generated structural section preview.\nimport StructuralSection from '${importAstro}'\n\nconst content = ${JSON.stringify(previewContent, null, 2)}\nconst fields = ${JSON.stringify(fields, null, 2)}\nconst intro = ${JSON.stringify(previewIntro, null, 2)}\nconst ctas = ${JSON.stringify(previewCtas, null, 2)}\nconst media = ${JSON.stringify(previewMedia, null, 2)}\n---\n<StructuralSection block=${JSON.stringify(`beta-${manifest.slug}`)} intro={intro} ctas={ctas} media={media} content={content} fields={fields} />\n`)
}
