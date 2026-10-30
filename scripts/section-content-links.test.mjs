import assert from 'node:assert/strict'
import test from 'node:test'
import { ctaGroupActions } from '../dist/shared/content.js'
import { betaBatteryModelsAllentownToProps } from '../dist/sections/battery-models/allentown/battery-models-allentown.payload.js'
import { betaStepsStageToProps } from '../dist/sections/steps/stage/steps-stage.payload.js'

const routes = new Map([['pages:contact', '/contact/'], ['articles:guide', '/guides/planning/']])
const options = { contentHref: (collection, id) => routes.get(`${collection}:${id}`) }
const contact = { label: 'Discuss your project', destinationType: 'content', page: { relationTo: 'pages', value: { id: 'contact' } }, style: 'primary' }

test('Battery Models retains the internal primary action alongside the URL secondary action', () => {
  const result = betaBatteryModelsAllentownToProps({
    theme: 'light',
    intro: { heading: 'Compare available configurations' },
    ctas: [contact, { label: 'Download specifications', destinationType: 'url', href: '/specifications.pdf', style: 'secondary' }],
    models: [],
  }, options)
  assert.deepEqual(ctaGroupActions(result.ctas), [
    { label: 'Discuss your project', href: '/contact/', style: 'primary' },
    { label: 'Download specifications', href: '/specifications.pdf', style: 'secondary' },
  ])
})

test('Steps Stage resolves intro, item and trailing actions independently', () => {
  const result = betaStepsStageToProps({
    theme: 'dark',
    intro: { heading: 'Plan a dependable delivery' },
    introCtaGroup: { buttons: [contact] },
    steps: [{ title: 'Define the scope', description: 'Agree on the acceptance criteria.', ctaGroup: { buttons: [{ label: 'Read the planning guide', destinationType: 'content', page: { relationTo: 'articles', value: 'guide' }, style: 'clear-base' }] } }],
    listCtaGroup: { buttons: [{ label: 'See our process', destinationType: 'url', href: '/process/', style: 'clear' }] },
  }, options)
  assert.equal(ctaGroupActions(result.introCtaGroup)[0].href, '/contact/')
  assert.deepEqual(ctaGroupActions(result.steps[0].ctaGroup), [{ label: 'Read the planning guide', href: '/guides/planning/', style: 'clear-base' }])
  assert.deepEqual(ctaGroupActions(result.listCtaGroup), [{ label: 'See our process', href: '/process/', style: 'clear' }])

  const empty = betaStepsStageToProps({ theme: 'light', intro: { heading: 'Plan a dependable delivery' }, steps: [], introCtaGroup: { buttons: [] } }, options)
  assert.deepEqual(ctaGroupActions(empty.introCtaGroup), [])
  assert.deepEqual(ctaGroupActions(empty.listCtaGroup), [])
})
