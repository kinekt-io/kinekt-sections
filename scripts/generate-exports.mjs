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

    const kind = entry.name.endsWith('.astro') ? 'astro'
      : entry.name.endsWith('.payload.ts') ? 'payload'
      : entry.name.endsWith('.types.ts') ? 'types'
      : null
    if (!kind) continue

    const relative = path.relative(source, filename).split(path.sep).join('/')
    const parts = relative.split('/')
    if (parts.length < 2) throw new Error(`Place ${relative} in a category folder inside src/.`)

    const publicName = kind === 'astro' ? entry.name : entry.name.slice(0, -3)
    const key = `./${parts[0]}/${publicName}`
    if (entries.has(key)) throw new Error(`Duplicate export ${key}: ${entries.get(key).source} and ${relative}`)

    const component = componentFor(relative)
    if (component.entries[kind]) throw new Error(`Multiple ${kind} entrypoints in ${component.directory}. Use one component per folder.`)

    const target = kind === 'astro' ? `./src/${relative}` : {
      types: `./dist/${relative.slice(0, -3)}.d.ts`,
      import: `./dist/${relative.slice(0, -3)}.js`,
    }
    entries.set(key, { source: relative, target })
    component.entries[kind] = { importPath: key.slice(2), source: relative }
  }
}

async function componentDescription(directory) {
  try {
    const markdown = await readFile(path.join(source, directory, 'README.md'), 'utf8')
    const lines = markdown.split(/\r?\n/).map((line) => line.trim())
    const title = lines.find((line) => /^#\s+/.test(line))?.replace(/^#\s+/, '')
    const description = lines.slice(lines.findIndex((line) => /^#\s+/.test(line)) + 1).find(
      (line) => line && !line.startsWith('#') && !line.startsWith('```'),
    )
    return { title, description }
  } catch (error) {
    if (error?.code === 'ENOENT') return {}
    throw error
  }
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
  const parts = component.directory.split('/')
  const metadata = await componentDescription(component.directory)
  catalogue.push({
    id: component.directory,
    category: parts[0],
    role: parts[1] ?? null,
    variation: parts.slice(2).join('-') || null,
    title: metadata.title ?? component.directory.split('/').at(-1),
    description: metadata.description ?? 'No component README.md yet.',
    entries: Object.fromEntries(Object.entries(component.entries).map(([kind, entry]) => [kind, `${manifest.name}/${entry.importPath}`])),
  })
}

const cataloguePath = path.join(root, 'examples', 'catalog', 'src', 'generated', 'components.json')
await mkdir(path.dirname(cataloguePath), { recursive: true })
await writeFile(cataloguePath, JSON.stringify(catalogue, null, 2) + '\n')
console.log(`Generated ${entries.size} exports and ${catalogue.length} catalogue entries from src/.`)
