import { readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const sections = path.join(root, 'src', 'sections')
const tulipOnlySlugs = new Set([
  'hd-cells-engineering-allentown',
  'homepage-problem-solution-allentown',
])

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

async function materialize(filename, source) {
  try {
    const existing = await readFile(filename, 'utf8')
    if (!existing.includes('@generated structural section') && !existing.includes('import StructuralSection')) return
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error
  }
  await writeFile(filename, source)
}

for (const directory of await manifestDirectories(sections)) {
  const manifest = JSON.parse(await readFile(path.join(directory, 'manifest.json'), 'utf8'))
  if (tulipOnlySlugs.has(manifest.slug)) continue

  const relativeAstro = path.relative(directory, path.join(root, 'src', 'shared', 'structural-section.astro')).split(path.sep).join('/')
  const relativeAdapter = path.relative(directory, path.join(root, 'src', 'shared', 'manifest-block.js')).split(path.sep).join('/')
  const importAstro = relativeAstro.startsWith('.') ? relativeAstro : `./${relativeAstro}`
  const importAdapter = relativeAdapter.startsWith('.') ? relativeAdapter : `./${relativeAdapter}`
  const name = pascalCase(`beta-${manifest.slug}`)
  const base = manifest.slug

  await materialize(path.join(directory, `${base}.astro`), `---\n// @generated structural section — source manifest remains the contract.\nimport StructuralSection from '${importAstro}'\n\nconst props = Astro.props\n---\n<StructuralSection block=${JSON.stringify(`beta-${manifest.slug}`)} {...props} />\n`)
  await materialize(path.join(directory, `${base}.types.ts`), `// @generated structural section — source manifest remains the contract.\nexport type ${name}Content = Record<string, unknown>\nexport type Payload${name}Document = ${name}Content & { id?: string }\n`)
  await materialize(path.join(directory, `${base}.payload.ts`), `// @generated structural section — source manifest remains the contract.\nimport type { Block, CollectionSlug } from 'payload'\nimport { createManifestBlock, manifestToProps } from '${importAdapter}'\nimport type { ${name}Content, Payload${name}Document } from './${base}.types.js'\n\nconst manifest = ${JSON.stringify({ slug: manifest.slug, title: manifest.title, fields: manifest.fields }, null, 2)} as const\n\nexport interface Create${name}BlockOptions { mediaCollection?: CollectionSlug; formCollection?: CollectionSlug }\n\nexport function create${name}Block(options: Create${name}BlockOptions = {}): Block {\n  return createManifestBlock(manifest, options)\n}\n\nexport function ${name[0].toLowerCase() + name.slice(1)}ToProps(data: Payload${name}Document): ${name}Content {\n  return manifestToProps(data)\n}\n`)
  await materialize(path.join(directory, `${base}.preview.astro`), `---
// @generated structural section preview.
import StructuralSection from '${importAstro}'

const intro = {
  accentHeading: 'Beta section',
  heading: ${JSON.stringify(manifest.title)},
  description: ${JSON.stringify('Representative catalogue content. The manifest remains the authoritative editor contract.')},
}
const ctas = {
  primary: { label: 'Primary action', href: '#' },
  secondary: { label: 'Secondary action', href: '#' },
}
---
<StructuralSection block=${JSON.stringify(`beta-${manifest.slug}`)} intro={intro} ctas={ctas} />
`)
}
