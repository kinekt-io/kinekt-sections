import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const source = path.join(root, 'src')
const entries = new Map()
const components = new Map()

function componentFor(relative) {
  const directory = path.dirname(relative)
  const component = components.get(directory) ?? { directory, entries: {} }
  components.set(directory, component)
  return component
}

async function discover(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const filename = path.join(directory, entry.name)
    if (entry.isSymbolicLink()) throw new Error(`Source symlinks are not supported: ${filename}`)
    if (entry.isDirectory()) {
      await discover(filename)
      continue
    }

    const relative = path.relative(source, filename).split(path.sep).join('/')
    const parts = relative.split('/')

    if (parts[0] === 'shared') continue

    if (entry.name.endsWith('.preview.astro')) {
      if (parts.length < 2) throw new Error(`Place ${relative} in a category folder inside src/.`)
      const component = componentFor(relative)
      if (component.previewSource) throw new Error(`Multiple previews in ${component.directory}. Use one preview per component folder.`)
      component.previewSource = relative
      continue
    }

    const kind = entry.name.endsWith('.astro') ? 'astro'
      : entry.name.endsWith('.payload.ts') ? 'payload'
      : entry.name.endsWith('.types.ts') ? 'types'
      : null
    if (!kind) continue
    if (parts.length < 2) throw new Error(`Place ${relative} in a category folder inside src/.`)

    const publicName = kind === 'astro' ? entry.name : entry.name.slice(0, -3)
    const key = `./${parts[0]}/${publicName}`
    if (entries.has(key)) throw new Error(`Duplicate export ${key}: ${entries.get(key).source} and ${relative}`)

    const component = componentFor(relative)
    if (component.entries[kind]) throw new Error(`Multiple ${kind} entrypoints in ${component.directory}. Use one component per folder.`)

    const target = kind === 'astro' ? `./src/${relative}` : {
      default: `./dist/${relative.slice(0, -3)}.js`,
      import: `./dist/${relative.slice(0, -3)}.js`,
      types: `./dist/${relative.slice(0, -3)}.d.ts`,
    }
    entries.set(key, { source: relative, target })
    component.entries[kind] = { importPath: key.slice(2), source: relative }
  }
}

function requireString(value, field, manifestPath) {
  if (typeof value !== 'string' || !value) throw new Error(`${manifestPath} requires a non-empty ${field}.`)
  return value
}

async function componentManifest(directory) {
  const manifestPath = path.join(source, directory, 'manifest.json')
  let metadata
  try {
    metadata = JSON.parse(await readFile(manifestPath, 'utf8'))
  } catch (error) {
    if (error?.code === 'ENOENT') throw new Error(`Missing component manifest: ${manifestPath}`)
    throw error
  }

  if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) {
    throw new Error(`${manifestPath} must contain a JSON object.`)
  }
  if (metadata.$schema !== 'https://kinekt.io/schemas/component-manifest.schema.json') {
    throw new Error(`${manifestPath} must declare the component manifest schema.`)
  }
  if (metadata.schemaVersion !== 1) throw new Error(`${manifestPath} must declare schemaVersion 1.`)

  const parts = directory.split('/')
  const expected = {
    id: directory,
    category: parts[0],
    role: parts[1] ?? null,
    variation: parts.slice(2).join('-') || null,
  }
  for (const [field, value] of Object.entries(expected)) {
    if (metadata[field] !== value) throw new Error(`${manifestPath} ${field} must equal ${JSON.stringify(value)}.`)
  }
  requireString(metadata.slug, 'slug', manifestPath)
  requireString(metadata.title, 'title', manifestPath)
  requireString(metadata.description, 'description', manifestPath)
  if (!['planned', 'released', 'deprecated'].includes(metadata.status)) {
    throw new Error(`${manifestPath} status must be planned, released, or deprecated.`)
  }
  if (!metadata.figma || typeof metadata.figma !== 'object' || !/^https:\/\/(?:www\.)?figma\.com\//.test(metadata.figma.url)) {
    throw new Error(`${manifestPath} requires a Figma URL.`)
  }
  if (!metadata.fields || typeof metadata.fields !== 'object' || Array.isArray(metadata.fields)) {
    throw new Error(`${manifestPath} requires a fields object.`)
  }
  return metadata
}

await discover(source)
if (!entries.size) throw new Error('No component entrypoints found inside src/.')

const manifestPath = path.join(root, 'package.json')
const original = await readFile(manifestPath, 'utf8')
const manifest = JSON.parse(original)
manifest.exports = Object.fromEntries([...entries].sort(([a], [b]) => a.localeCompare(b)).map(([key, value]) => [key, value.target]))
const updated = JSON.stringify(manifest, null, 2) + '\n'
if (updated !== original) await writeFile(manifestPath, updated)

const catalogue = []
for (const component of [...components.values()].sort((a, b) => a.directory.localeCompare(b.directory))) {
  if (!Object.keys(component.entries).length) continue
  const metadata = await componentManifest(component.directory)
  catalogue.push({
    id: metadata.id,
    slug: metadata.slug,
    category: metadata.category,
    role: metadata.role,
    variation: metadata.variation,
    title: metadata.title,
    description: metadata.description,
    status: metadata.status,
    figmaUrl: metadata.figma.url,
    variants: metadata.variants ?? {},
    fields: metadata.fields,
    runtimeProps: metadata.runtimeProps ?? {},
    previewSource: component.previewSource ?? null,
    entries: Object.fromEntries(Object.entries(component.entries).map(([kind, entry]) => [kind, `${manifest.name}/${entry.importPath}`])),
  })
}

const cataloguePath = path.join(root, 'examples', 'catalog', 'src', 'generated', 'components.json')
await mkdir(path.dirname(cataloguePath), { recursive: true })
await writeFile(cataloguePath, JSON.stringify(catalogue, null, 2) + '\n')
console.log(`Generated ${entries.size} exports and ${catalogue.length} catalogue entries from src/.`)
