import assert from 'node:assert/strict'
import test from 'node:test'
import { createProgressListAllentownBlock, progressListAllentownToProps } from '../dist/sections/progress-list/allentown/progress-list-allentown.payload.js'

const document = (overrides = {}) => ({
  theme: 'light',
  intro: { heading: 'Delivery overview' },
  itemHeading: 'Item',
  statusHeading: 'Status',
  items: [{ title: 'Launch checklist', status: 'todo' }],
  ...overrides,
})

test('Progress List keeps visible status overrides and applies custom defaults', () => {
  const result = progressListAllentownToProps(document({
    items: [
      { title: 'Review schedule', status: 'done', statusLabel: 'Verified' },
      { title: 'Legal review', status: 'custom', statusLabel: 'Waiting on counsel', customTone: 'not-a-tone', customIcon: 'not-an-icon' },
      { title: 'Release notes' },
    ],
  }))

  assert.deepEqual(result.items, [
    { title: 'Review schedule', status: 'done', statusLabel: 'Verified' },
    { title: 'Legal review', status: 'custom', statusLabel: 'Waiting on counsel', customTone: 'neutral' },
    { title: 'Release notes', status: 'todo' },
  ])
})

test('Progress List requires a label only for custom statuses', () => {
  const block = createProgressListAllentownBlock()
  const items = block.fields.find((field) => field.name === 'items')
  const statusLabel = items.fields.find((field) => field.name === 'statusLabel')

  assert.equal(statusLabel.validate('', { siblingData: { status: 'todo' } }), true)
  assert.match(statusLabel.validate('', { siblingData: { status: 'custom' } }), /visible status label/)
  assert.equal(statusLabel.validate('Awaiting review', { siblingData: { status: 'custom' } }), true)
})

test('Progress List drops stale custom values for standard statuses', () => {
  const result = progressListAllentownToProps(document({
    items: [{ title: 'Evidence archive', status: 'in-progress', statusLabel: 'Under review', customIcon: 'bolt', customTone: 'error' }],
  }))

  assert.deepEqual(result.items[0], { title: 'Evidence archive', status: 'in-progress', statusLabel: 'Under review' })
})

test('Progress List retains complete CTA content when a sibling CTA is partial', () => {
  const result = progressListAllentownToProps(document({
    ctaGroup: [
      { label: 'View details', destinationType: 'url', href: '/details/', style: 'clear' },
      { label: 'Missing destination', destinationType: 'url', style: 'secondary' },
    ],
  }))

  assert.deepEqual(result.ctaGroup, {
    buttons: [{ label: 'View details', href: '/details/', style: 'clear' }],
    primary: { label: 'View details', href: '/details/', style: 'clear' },
    secondary: undefined,
  })
})
