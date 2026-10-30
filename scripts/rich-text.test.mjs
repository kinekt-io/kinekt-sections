import assert from 'node:assert/strict'
import test from 'node:test'
import { Window } from 'happy-dom'
import { richTextToHtml } from '../dist/shared/rich-text.js'

const text = (value, format = 0) => ({ type: 'text', text: value, format })

test('Payload descriptions preserve marks, lists and link fields without rendering unsafe URLs or HTML', () => {
  const window = new Window()
  const container = window.document.createElement('div')
  container.innerHTML = richTextToHtml({ root: { type: 'root', children: [
    { type: 'paragraph', children: [text('<img src=x onerror=alert(1)>', 3)] },
    { type: 'list', listType: 'number', start: 3, children: [{ type: 'listitem', children: [text('Review the specification')] }] },
    { type: 'paragraph', children: [
      { type: 'link', fields: { linkType: 'custom', url: 'https://example.com/specs?a=1&b=2', newTab: true }, children: [text('Specification')] },
      { type: 'autolink', fields: { linkType: 'custom', url: 'javascript:alert(1)', newTab: true }, children: [text('Unsafe target')] },
    ] },
  ] } }, 'description')

  assert.equal(container.querySelector('strong')?.textContent, '<img src=x onerror=alert(1)>')
  assert.ok(container.querySelector('em strong'))
  assert.equal(container.querySelector('img'), null)
  assert.equal(container.querySelector('ol')?.getAttribute('start'), '3')
  assert.equal(container.querySelector('li')?.textContent, 'Review the specification')
  const links = container.querySelectorAll('a')
  assert.equal(links.length, 1)
  assert.equal(links[0].getAttribute('href'), 'https://example.com/specs?a=1&b=2')
  assert.equal(links[0].getAttribute('target'), '_blank')
  assert.ok(links[0].relList.contains('noopener'))
  assert.ok(container.textContent.includes('Unsafe target'))
})
