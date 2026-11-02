import assert from 'node:assert/strict'
import test from 'node:test'
import { createProgressRoadmapAllentownBlock, progressRoadmapAllentownToProps } from '../dist/sections/progress-roadmap/allentown/progress-roadmap-allentown.payload.js'

const document = (overrides = {}) => ({
  theme: 'semi-light',
  intro: { heading: 'Compliance roadmap' },
  items: [{ title: 'Evidence review', status: 'todo' }],
  ...overrides,
})

test('Progress Roadmap defaults optional filter labels and omits invalid optional visuals', () => {
  const result = progressRoadmapAllentownToProps(document({
    items: [{ title: 'Evidence review', status: 'done', icon: 'not-an-icon' }],
  }))

  assert.deepEqual(result.filterLabels, {
    all: 'All',
    delayed: 'Delayed',
    done: 'Done',
    inProgress: 'In progress',
    todo: 'To do',
    custom: 'Custom',
    canceled: 'Canceled',
  })
  assert.deepEqual(result.items, [{ title: 'Evidence review', status: 'done' }])
})

test('Progress Roadmap preserves translated filter labels and normalizes facts', () => {
  const result = progressRoadmapAllentownToProps(document({
    filterLabels: { all: 'Alle', done: 'Afgerond' },
    items: [{
      title: 'Safety documentation',
      status: 'in-progress',
      facts: [{ label: 'Owner', value: 'Compliance team' }],
    }],
  }))

  assert.equal(result.filterLabels.all, 'Alle')
  assert.equal(result.filterLabels.done, 'Afgerond')
  assert.equal(result.filterLabels.todo, 'To do')
  assert.deepEqual(result.items[0].facts, [{ label: 'Owner', value: 'Compliance team' }])
})

test('Progress Roadmap preserves rich description lists and populated media', () => {
  const result = progressRoadmapAllentownToProps(document({
    items: [{
      title: 'Certification audit',
      status: 'custom',
      statusLabel: 'Scheduled',
      media: { url: '/media/audit.png', alt: 'Audit documentation', width: 640, height: 480 },
      description: {
        root: {
          type: 'root',
          children: [{ type: 'list', listType: 'bullet', children: [{ type: 'listitem', children: [{ type: 'text', text: 'Prepare evidence' }] }] }],
        },
      },
    }],
  }))

  assert.equal(result.items[0].media?.url, '/media/audit.png')
  assert.equal(result.items[0].description?.html, '<ul><li>Prepare evidence</li></ul>')
  assert.equal(result.items[0].statusLabel, 'Scheduled')
  assert.equal(result.items[0].customTone, 'neutral')
})

test('Progress Roadmap requires a custom status label in the CMS and adapter', () => {
  const block = createProgressRoadmapAllentownBlock()
  const items = block.fields.find((field) => field.name === 'items')
  const statusLabel = items.fields.find((field) => field.name === 'statusLabel')

  assert.match(statusLabel.validate('', { siblingData: { status: 'custom' } }), /visible status label/)
  assert.throws(() => progressRoadmapAllentownToProps(document({
    items: [{ title: 'Certification audit', status: 'custom' }],
  })), /statusLabel must be non-empty text/)
})
