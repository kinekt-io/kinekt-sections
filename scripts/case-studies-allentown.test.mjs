import assert from 'node:assert/strict'
import test from 'node:test'

import {
  caseStudiesAllentownToProps,
  createCaseStudiesAllentownBlock,
} from '../dist/sections/case-studies/allentown/case-studies-allentown.contract.js'

const media = {
  url: 'https://example.test/image.jpg',
  alt: 'Example image',
  width: 640,
  height: 480,
}

function documentWith(overrides = {}) {
  return {
    theme: 'light',
    intro: { heading: 'Case studies' },
    carousel: { items: [] },
    ...overrides,
  }
}

function toProps(document) {
  return caseStudiesAllentownToProps(document, { contentHref: () => '/content' })
}

test('switching selection modes requires articles only for manual mode and a content type only for automatic mode', () => {
  const fields = new Map(createCaseStudiesAllentownBlock().fields.map(field => [field.name, field]))
  const manual = { siblingData: { selectionMode: 'manual' } }
  const automatic = { siblingData: { selectionMode: 'automatic' } }
  const sources = fields.get('caseSources').validate
  const contentType = fields.get('contentType').validate

  assert.equal(typeof sources([], manual), 'string')
  assert.equal(sources([{ content: { relationTo: 'articles', value: 'article-a' } }], manual), true)
  assert.equal(sources([], automatic), true)
  assert.equal(typeof contentType(undefined, automatic), 'string')
  assert.equal(contentType('articles', automatic), true)
  assert.equal(contentType(undefined, manual), true)
})

test('adapts an empty hydrated automatic selection without a phantom card', () => {
  assert.deepEqual(toProps(documentWith()).carousel.items, [])
})

test('preserves the CMS-provided canonical article CTA in the renderer projection', () => {
  const props = toProps(documentWith({
    carousel: {
      items: [{
        title: 'Example case study',
        image: media,
        cta: { href: '/cases/example-case-study/' },
      }],
    },
  }))

  assert.deepEqual(props.carousel.items[0].cta, {
    label: 'Read more',
    href: '/cases/example-case-study/',
  })
})

test('missing hydration is rejected rather than silently hiding selected articles', () => {
  assert.throws(() => toProps(documentWith({ carousel: undefined })))
  assert.throws(() => toProps(documentWith({ carousel: {} })))
})
