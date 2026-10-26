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
    carousel: {
      items: [{
        destinationType: 'url',
        href: '/case-study',
        title: 'Example case study',
        image: media,
        cta: { label: 'Read more' },
      }],
    },
    ...overrides,
  }
}

function slideWith(overrides = {}) {
  return documentWith({
    carousel: {
      items: [{
        destinationType: 'url',
        href: '/case-study',
        title: 'Example case study',
        image: media,
        cta: { label: 'Read more' },
        ...overrides,
      }],
    },
  })
}

function toProps(document) {
  return caseStudiesAllentownToProps(document, { contentHref: () => '/content' })
}

function quoteValidators() {
  const block = createCaseStudiesAllentownBlock()
  const carousel = block.fields.find((field) => field.name === 'carousel')
  const items = carousel.fields.find((field) => field.name === 'items')
  const quote = items.fields.find((field) => field.name === 'quote')
  return quote.fields.map((field) => field.validate)
}

function resultsValidator() {
  const block = createCaseStudiesAllentownBlock()
  const carousel = block.fields.find((field) => field.name === 'carousel')
  const items = carousel.fields.find((field) => field.name === 'items')
  return items.fields.find((field) => field.name === 'results').validate
}

test('omits absent results and strictly adapts populated result rows', () => {
  for (const results of [undefined, null, []]) {
    assert.equal('results' in toProps(slideWith({ results })).carousel.items[0], false)
  }

  assert.deepEqual(toProps(slideWith({
    results: [{ label: 'Runtime', value: { text: '8 hours', icon: 'clock' } }],
  })).carousel.items[0].results, [{ label: 'Runtime', value: { text: '8 hours', icon: 'clock' } }])

  assert.throws(() => toProps(slideWith({ results: {} })), /results must contain at least one item/)
  assert.throws(() => toProps(slideWith({ results: [{ label: '', value: { text: '8 hours' } }] })), /results\[0\]\.label must be non-empty text/)
  assert.throws(() => toProps(slideWith({ results: [{ label: 'Runtime', value: {} }] })), /results\[0\]\.value\.text must be non-empty text/)
})

test('quote adapter accepts anonymous quotes and rejects incomplete attribution', () => {
  assert.equal('quote' in toProps(slideWith({ quote: {} })).carousel.items[0], false)
  assert.deepEqual(toProps(slideWith({ quote: { quote: 'Anonymous feedback' } })).carousel.items[0].quote, {
    quote: 'Anonymous feedback',
  })
  assert.deepEqual(toProps(slideWith({ quote: { quote: 'Named feedback', authorName: 'Morgan' } })).carousel.items[0].quote, {
    quote: 'Named feedback',
    authorName: 'Morgan',
  })
  assert.deepEqual(toProps(slideWith({ quote: { quote: 'Full attribution', authorName: 'Morgan', authorRole: 'Engineer', avatar: media } })).carousel.items[0].quote, {
    quote: 'Full attribution',
    authorName: 'Morgan',
    authorRole: 'Engineer',
    avatar: media,
  })

  for (const quote of [
    { authorName: 'Morgan' },
    { authorRole: 'Engineer' },
    { avatar: media },
    { quote: 'Feedback', authorRole: 'Engineer' },
    { quote: 'Feedback', avatar: media },
  ]) {
    assert.throws(() => toProps(slideWith({ quote })), /author details require a quote|author role and portrait require an author name/)
  }
})

test('quote sibling validation enforces publish dependencies but bypasses drafts', () => {
  const validators = quoteValidators()
  const publish = { _status: 'published' }
  const draft = { _status: 'draft' }
  const valid = [
    {},
    { quote: 'Anonymous feedback' },
    { quote: 'Named feedback', authorName: 'Morgan' },
    { quote: 'Full attribution', authorName: 'Morgan', authorRole: 'Engineer', avatar: 'media-id' },
  ]

  const invalid = [
    { authorName: 'Morgan' },
    { authorRole: 'Engineer' },
    { avatar: 'media-id' },
    { quote: 'Feedback', authorRole: 'Engineer' },
    { quote: 'Feedback', avatar: 'media-id' },
  ]

  for (const siblingData of valid) {
    for (const validate of validators) assert.equal(validate(undefined, { data: publish, siblingData }), true)
  }
  for (const siblingData of invalid) {
    for (const validate of validators) assert.notEqual(validate(undefined, { data: publish, siblingData }), true)
    for (const validate of validators) assert.equal(validate(undefined, { data: draft, siblingData }), true)
  }
})

test('header CTA omits an empty group but rejects a destination without a label', () => {
  assert.equal('cta' in toProps(documentWith({ cta: {} })), false)
  assert.deepEqual(toProps(documentWith({ cta: { label: 'Browse reports', destinationType: 'url', href: '/reports' } })).cta, {
    label: 'Browse reports',
    href: '/reports',
  })
  assert.throws(
    () => toProps(documentWith({ cta: { destinationType: 'url', href: '/reports' } })),
    Error,
  )
})

test('results validation allows empty optional state and drafts but rejects non-arrays on publish', () => {
  const validate = resultsValidator()
  for (const value of [undefined, null, []]) assert.equal(validate(value, { data: { _status: 'published' } }), true)
  assert.notEqual(validate({}, { data: { _status: 'published' } }), true)
  assert.equal(validate({}, { data: { _status: 'draft' } }), true)
})
