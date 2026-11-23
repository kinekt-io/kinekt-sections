import assert from 'node:assert/strict'
import test from 'node:test'

import {
  betaRelatedContentAllentownToProps,
  createBetaRelatedContentAllentownBlock,
} from '../dist/sections/related-content/allentown/related-content-allentown.contract.js'

function documentWith(overrides = {}) {
  return {
    theme: 'semi-light',
    intro: { heading: 'Related insights' },
    ...overrides,
  }
}

test('requires a selection only in manual mode and shows its picker only there', () => {
  const fields = new Map(createBetaRelatedContentAllentownBlock({
    contentCollections: ['articles', 'pages', 'documents'],
  }).fields.map(field => [field.name, field]))
  const sources = fields.get('contentSources')
  const manual = { siblingData: { selectionMode: 'manual' } }
  const automatic = { siblingData: { selectionMode: 'automatic' } }

  assert.equal(typeof sources.validate([], manual), 'string')
  assert.equal(sources.validate([{ content: { relationTo: 'pages', value: 'page-a' } }], manual), true)
  assert.equal(sources.validate([], automatic), true)
  assert.equal(sources.admin.condition(undefined, { selectionMode: 'manual' }), true)
  assert.equal(sources.admin.condition(undefined, { selectionMode: 'automatic' }), false)
})

test('adapts an empty hydrated automatic selection without a phantom card', () => {
  const props = betaRelatedContentAllentownToProps(documentWith())

  assert.deepEqual(props.contentSources, [])
})

