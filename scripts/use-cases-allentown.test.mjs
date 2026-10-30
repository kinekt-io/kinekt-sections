import assert from 'node:assert/strict'
import test from 'node:test'
import { betaUseCasesAllentownToProps } from '../dist/sections/use-cases/allentown/use-cases-allentown.payload.js'

const richText = (text) => ({
  root: {
    type: 'root', version: 1,
    children: [{
      type: 'paragraph', version: 1,
      children: [{ type: 'text', version: 1, text, format: 1, mode: 'normal', detail: 0, style: '' }],
    }],
  },
})

test('Use Cases converts editor rich text and resolves item content links without losing CTA styles', () => {
  const result = betaUseCasesAllentownToProps({
    theme: 'semi-light',
    intro: { heading: 'Built for daily operations', description: richText('Range & reliability') },
    advantageHeading: 'Operational benefits',
    items: [{
      title: 'Field inspections',
      description: richText('Inspect more sites safely'),
      ctaGroup: [
        { label: 'Explore inspections', destinationType: 'content', page: { relationTo: 'pages', value: 42 }, style: 'clear', icon: 'arrow-right' },
        { label: 'Request advice', destinationType: 'url', href: '/contact/', style: 'secondary' },
      ],
    }],
  }, { contentHref: (collection, id) => collection === 'pages' && id === '42' ? '/applications/inspections/' : undefined })

  assert.match(result.intro.description.html, /<strong>Range &amp; reliability<\/strong>/)
  assert.match(result.items[0].description.html, /<strong>Inspect more sites safely<\/strong>/)
  assert.deepEqual(result.items[0].ctaGroup.buttons.map(({ href, style }) => ({ href, style })), [
    { href: '/applications/inspections/', style: 'clear' },
    { href: '/contact/', style: 'secondary' },
  ])
})
