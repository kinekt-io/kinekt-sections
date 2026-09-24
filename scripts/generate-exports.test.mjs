import assert from 'node:assert/strict'
import { execFileSync, spawnSync } from 'node:child_process'
import { copyFile, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { test } from 'node:test'

async function fixture(t) {
  const root = await mkdtemp(path.join(tmpdir(), 'kinekt-exports-'))
  t.after(() => rm(root, { recursive: true, force: true }))
  await mkdir(path.join(root, 'scripts'))
  await copyFile(new URL('./generate-exports.mjs', import.meta.url), path.join(root, 'scripts/generate-exports.mjs'))
  await writeFile(path.join(root, 'package.json'), JSON.stringify({ name: '@test/components', exports: { './removed': './old.js' } }))
  return {
    root,
    async add(name, content = '') {
      const file = path.join(root, 'src', name)
      await mkdir(path.dirname(file), { recursive: true })
      await writeFile(file, content)
    },
    run() { execFileSync(process.execPath, [path.join(root, 'scripts/generate-exports.mjs')]) },
    async exports() { return JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8')).exports },
    async catalogue() { return JSON.parse(await readFile(path.join(root, 'examples/catalog/src/generated/components.json'), 'utf8')) },
  }
}

test('discovers nested paired sections and standalone components without exporting helpers', async (t) => {
  const f = await fixture(t)
  await f.add('sections/hero/allentown/hero-allentown.astro')
  await f.add('sections/hero/allentown/hero-allentown.payload.ts')
  await f.add('sections/hero/allentown/hero-allentown.types.ts')
  await f.add('sections/hero/allentown/hero-allentown.preview.astro')
  await f.add('sections/hero/allentown/README.md', '# Hero Allentown\n\nA documented hero variant.\n')
  await f.add('sections/hero/allentown/helpers.ts')
  await f.add('controls/button/button.astro')
  f.run()
  assert.deepEqual(await f.exports(), {
    './controls/button.astro': './src/controls/button/button.astro',
    './sections/hero-allentown.astro': './src/sections/hero/allentown/hero-allentown.astro',
    './sections/hero-allentown.payload': {
      types: './dist/sections/hero/allentown/hero-allentown.payload.d.ts',
      import: './dist/sections/hero/allentown/hero-allentown.payload.js',
    },
    './sections/hero-allentown.types': {
      types: './dist/sections/hero/allentown/hero-allentown.types.d.ts',
      import: './dist/sections/hero/allentown/hero-allentown.types.js',
    },
  })
  assert.deepEqual(await f.catalogue(), [
    {
      id: 'controls/button',
      category: 'controls',
      role: 'button',
      variation: null,
      title: 'button',
      description: 'No component README.md yet.',
      previewSource: null,
      entries: { astro: '@test/components/controls/button.astro' },
    },
    {
      id: 'sections/hero/allentown',
      category: 'sections',
      role: 'hero',
      variation: 'allentown',
      title: 'Hero Allentown',
      description: 'A documented hero variant.',
      previewSource: 'sections/hero/allentown/hero-allentown.preview.astro',
      entries: {
        astro: '@test/components/sections/hero-allentown.astro',
        payload: '@test/components/sections/hero-allentown.payload',
        types: '@test/components/sections/hero-allentown.types',
      },
    },
  ])
  await rm(path.join(f.root, 'src/controls'), { recursive: true })
  f.run()
  assert.equal('./controls/button.astro' in await f.exports(), false)
})

test('rejects duplicate public names without overwriting the manifest', async (t) => {
  const f = await fixture(t)
  await f.add('sections/a/hero.astro')
  await f.add('sections/b/hero.astro')
  const before = await readFile(path.join(f.root, 'package.json'), 'utf8')
  const result = spawnSync(process.execPath, [path.join(f.root, 'scripts/generate-exports.mjs')], { encoding: 'utf8' })
  assert.notEqual(result.status, 0)
  assert.match(result.stderr, /Duplicate export \.\/sections\/hero\.astro/)
  assert.equal(await readFile(path.join(f.root, 'package.json'), 'utf8'), before)
})
