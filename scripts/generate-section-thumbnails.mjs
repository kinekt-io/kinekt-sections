import { createReadStream } from 'node:fs'
import { access, mkdir, readFile, stat } from 'node:fs/promises'
import http from 'node:http'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { chromium } from '@playwright/test'

const root = fileURLToPath(new URL('../', import.meta.url))
const catalogue = JSON.parse(await readFile(path.join(root, 'examples/catalog/src/generated/components.json'), 'utf8'))
const dist = path.join(root, 'examples/catalog/dist')
const publicRoot = path.join(root, 'examples/catalog/public')
const basePath = '/kinekt-sections/'
const viewport = { width: 1600, height: 1000 }
const chromePath = process.env.CHROME_PATH ?? (process.platform === 'darwin'
  ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  : undefined)

await access(dist)

const contentTypeFor = (filename) => ({
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
}[path.extname(filename)] ?? 'application/octet-stream')

const server = http.createServer(async (request, response) => {
  const requestPath = new URL(request.url ?? '/', 'http://127.0.0.1').pathname
  if (!requestPath.startsWith(basePath)) {
    response.writeHead(404).end()
    return
  }

  const relative = requestPath.slice(basePath.length)
  const candidate = path.resolve(dist, relative || '.')
  if (!candidate.startsWith(dist)) {
    response.writeHead(403).end()
    return
  }

  let filename = candidate
  try {
    if ((await stat(filename)).isDirectory()) filename = path.join(filename, 'index.html')
    response.writeHead(200, { 'content-type': contentTypeFor(filename) })
    createReadStream(filename).pipe(response)
  } catch {
    response.writeHead(404).end()
  }
})

await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
const address = server.address()
if (!address || typeof address === 'string') throw new Error('Unable to start the catalogue server.')
const origin = `http://127.0.0.1:${address.port}${basePath}`
const browser = await chromium.launch({ headless: true, ...(chromePath ? { executablePath: chromePath } : {}) })
const page = await browser.newPage({ viewport })
const sections = catalogue.filter((component) => component.category === 'sections' && component.previewSource && component.thumbnailURL)

try {
  for (const component of sections) {
    const thumbnailPath = new URL(component.thumbnailURL).pathname.replace(`${basePath.slice(0, -1)}/`, '')
    const output = path.join(publicRoot, thumbnailPath)
    await mkdir(path.dirname(output), { recursive: true })

    await page.goto(`${origin}components/embed/${component.id}/`, { waitUntil: 'networkidle' })
    await page.evaluate(() => document.fonts.ready)
    await page.screenshot({ path: output, type: 'jpeg', quality: 78, animations: 'disabled' })
    console.log(`Wrote ${path.relative(root, output)}`)
  }
} finally {
  await browser.close()
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()))
}
