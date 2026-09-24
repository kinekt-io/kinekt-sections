import { execFileSync } from 'node:child_process'
import { access, mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

if (!process.argv[2]) throw new Error('Usage: node scripts/verify-package.mjs <fresh-consumer-directory>')
const consumer = path.resolve(process.argv[2])
const expected = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'))
const installedRoot = path.join(consumer, 'node_modules', expected.name)
const installed = JSON.parse(await readFile(path.join(installedRoot, 'package.json'), 'utf8'))
if (installed.version !== expected.version || JSON.stringify(installed.exports) !== JSON.stringify(expected.exports)) {
  throw new Error('Installed package version or exports differ from the release manifest.')
}

const astroImports = []
const payloadImports = []
const typeImports = []
for (const [key, target] of Object.entries(installed.exports)) {
  const specifier = `${installed.name}${key.slice(1)}`
  for (const file of typeof target === 'string' ? [target] : Object.values(target)) {
    await access(path.join(installedRoot, file))
  }
  if (key.endsWith('.astro')) astroImports.push(specifier)
  else if (key.endsWith('.payload')) payloadImports.push(specifier)
  else if (key.endsWith('.types')) typeImports.push(specifier)
  else throw new Error(`Unexpected generated export: ${key}`)
}

// Run inside the consumer so these are real package imports, not source-tree imports.
execFileSync(process.execPath, ['--input-type=module', '-e', `
  for (const name of ${JSON.stringify([...payloadImports, ...typeImports])}) {
    await import(name)
    console.log('Imported', name)
  }
  for (const name of ${JSON.stringify(astroImports)}) {
    console.log('Resolved', import.meta.resolve(name))
  }
`], { cwd: consumer, stdio: 'inherit' })

const page = path.join(consumer, 'src/pages/index.astro')
await mkdir(path.dirname(page), { recursive: true })
const imports = astroImports.map((name, index) => `import Component${index} from ${JSON.stringify(name)}`).join('\n')
const components = astroImports.map((_, index) => `Component${index}`).join(', ')
// Props belong in component examples. Here every installed Astro entrypoint is compiled.
await writeFile(page, `---\n${imports}\nconst components = [${components}]\n---\n<p>Verified {components.length} Astro component imports</p>\n`, { flag: 'wx' })
const astroCli = fileURLToPath(new URL('../node_modules/astro/bin/astro.mjs', import.meta.url))
execFileSync(process.execPath, [astroCli, 'build', '--root', consumer], { cwd: consumer, stdio: 'inherit' })
const html = await readFile(path.join(consumer, 'dist/index.html'), 'utf8')
if (!html.includes(`Verified ${astroImports.length} Astro component imports`)) throw new Error('Consumer build output is missing.')
console.log(`Verified ${astroImports.length} Astro, ${payloadImports.length} Payload and ${typeImports.length} type entrypoints from the installed package.`)
