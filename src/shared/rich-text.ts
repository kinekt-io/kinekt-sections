import { isSafeWebUrl } from '../urls.js'

type Node = {
  type?: unknown
  text?: unknown
  tag?: unknown
  url?: unknown
  target?: unknown
  fields?: unknown
  listType?: unknown
  start?: unknown
  format?: unknown
  children?: unknown
}

const escapeHtml = (value: string): string => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;')

const childrenOf = (node: Node): Node[] =>
  Array.isArray(node.children)
    ? node.children.filter((child): child is Node => typeof child === 'object' && child !== null && !Array.isArray(child))
    : []

const renderChildren = (node: Node): string => childrenOf(node).map(renderNode).join('')

const textFormat = (value: string, format: unknown): string => {
  const flags = typeof format === 'number' ? format : 0
  let html = value
  if (flags & 16) html = `<code>${html}</code>`
  if (flags & 1) html = `<strong>${html}</strong>`
  if (flags & 2) html = `<em>${html}</em>`
  if (flags & 8) html = `<u>${html}</u>`
  if (flags & 4) html = `<s>${html}</s>`
  if (flags & 32) html = `<sub>${html}</sub>`
  if (flags & 64) html = `<sup>${html}</sup>`
  return html
}

const renderNode = (node: Node): string => {
  if (node.type === 'text') return typeof node.text === 'string' ? textFormat(escapeHtml(node.text), node.format) : ''
  if (node.type === 'linebreak') return '<br>'
  if (node.type === 'paragraph') return `<p>${renderChildren(node)}</p>`
  if (node.type === 'list') {
    const ordered = node.listType === 'number' || node.listType === 'ordered'
    const start = ordered && typeof node.start === 'number' && Number.isSafeInteger(node.start) && node.start > 1 ? ` start="${node.start}"` : ''
    const tag = ordered ? 'ol' : 'ul'
    return `<${tag}${start}>${renderChildren(node)}</${tag}>`
  }
  if (node.type === 'listitem') return `<li>${renderChildren(node)}</li>`
  if (node.type === 'quote') return `<blockquote>${renderChildren(node)}</blockquote>`
  if (node.type === 'heading') {
    const tag = typeof node.tag === 'string' && /^h[2-6]$/.test(node.tag) ? node.tag : 'h2'
    return `<${tag}>${renderChildren(node)}</${tag}>`
  }
  if (node.type === 'link' || node.type === 'autolink') {
    const fields = typeof node.fields === 'object' && node.fields !== null && !Array.isArray(node.fields)
      ? node.fields as Record<string, unknown>
      : undefined
    const url = fields ? fields.url : node.url
    const href = typeof url === 'string' && isSafeWebUrl(url) ? url : undefined
    const newTab = fields?.newTab === true || node.target === '_blank' ? ' target="_blank" rel="noopener noreferrer"' : ''
    return href ? `<a href="${escapeHtml(href)}"${newTab}>${renderChildren(node)}</a>` : renderChildren(node)
  }
  return renderChildren(node)
}

export function richTextToHtml(value: unknown, field: string): string {
  if (typeof value === 'string') return `<p>${escapeHtml(value)}</p>`
  if (typeof value !== 'object' || value === null || Array.isArray(value)) throw new Error(`${field} must be rich text.`)

  const root = 'root' in value ? value.root : value
  if (typeof root !== 'object' || root === null || Array.isArray(root)) throw new Error(`${field} must have a rich-text root.`)

  const html = renderNode(root as Node)
  if (!html) throw new Error(`${field} must not be empty.`)
  return html
}

export const renderRichText = (value: unknown, field: string): { html: string } => ({
  html: richTextToHtml(value, field),
})
