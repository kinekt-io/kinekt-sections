import assert from 'node:assert/strict'
import test from 'node:test'
import { ctaGroupToProps, ctaToProps } from '../dist/shared/payload.js'
import { ctaFields, ctaStyleField } from '../dist/shared/payload-fields.js'
import { structuralSectionToProps } from '../dist/shared/structural-props.js'
import { betaProcessStoryAllentownToProps } from '../dist/sections/process-story/allentown/process-story-allentown.payload.js'
import { betaProductOptionsAllentownToProps } from '../dist/sections/product-options/allentown/product-options-allentown.payload.js'

function ctaField(name) {
  const field = ctaFields(['pages', 'articles']).find((candidate) => candidate.name === name)
  assert.ok(field)
  assert.equal(typeof field.validate, 'function')
  return field
}

function validate(field, value, siblingData) {
  return field.validate(value, { siblingData })
}

test('CTA groups omit empty primary and secondary values, including persisted defaults', () => {
  assert.equal(ctaGroupToProps(null, 'ctas'), undefined)
  assert.equal(ctaGroupToProps({
    primary: { destinationType: 'url', label: null, href: null, icon: null },
    secondary: { destinationType: 'url' },
  }, 'ctas'), undefined)
  assert.equal(ctaGroupToProps({
    primary: { destinationType: 'content', icon: 'arrow-right', label: null, page: null },
  }, 'ctas'), undefined)
})

test('CTA adapters retain complete URL and content destinations', () => {
  assert.deepEqual(
    ctaGroupToProps({ primary: { label: 'Browse products', destinationType: 'url', href: '/products', icon: null } }, 'ctas'),
    { primary: { label: 'Browse products', href: '/products' }, secondary: undefined },
  )

  const contentHrefCalls = []
  assert.deepEqual(
    ctaToProps(
      { label: 'Read the case study', destinationType: 'content', page: { relationTo: 'articles', value: 42 }, icon: null },
      'cta',
      { contentHref: (collection, id) => { contentHrefCalls.push([collection, id]); return `/articles/${id}` } },
    ),
    { label: 'Read the case study', href: '/articles/42' },
  )
  assert.deepEqual(contentHrefCalls, [['articles', '42']])
  assert.deepEqual(
    ctaToProps(
      { label: 'Read the page', destinationType: 'content', page: 42 },
      'cta',
      { contentHref: (collection, id) => `${collection}/${id}` },
    ),
    { label: 'Read the page', href: 'pages/42' },
  )
})

test('CTA adapters retain clear-base styles and the shared editor field exposes it', () => {
  assert.deepEqual(
    ctaToProps({ label: 'Read the technical guide', destinationType: 'url', href: '/guide', style: 'clear-base' }, 'cta'),
    { label: 'Read the technical guide', href: '/guide', style: 'clear-base' },
  )
  assert.deepEqual(
    ctaGroupToProps([{ label: 'Read the technical guide', destinationType: 'url', href: '/guide', style: 'clear-base' }], 'ctas'),
    { buttons: [{ label: 'Read the technical guide', href: '/guide', style: 'clear-base' }], primary: { label: 'Read the technical guide', href: '/guide', style: 'clear-base' }, secondary: undefined },
  )
  assert.ok(ctaStyleField().options.some(({ label, value }) => label === 'Clear base' && value === 'clear-base'))
})

test('CTA validators reject partial publish values while allowing an omitted CTA', () => {
  const label = ctaField('label')
  const href = ctaField('href')
  const page = ctaField('page')
  const icon = ctaField('icon')
  assert.deepEqual(page.relationTo, ['pages', 'articles'])

  assert.equal(validate(label, undefined, { destinationType: 'url', icon: null }), true)
  assert.equal(validate(label, 'Browse products', { destinationType: 'url' }), 'Enter an absolute HTTP(S) URL or a site-root-relative path.')
  assert.equal(validate(label, undefined, { destinationType: 'url', href: '/products' }), 'Enter non-empty text.')
  assert.equal(validate(label, 'Read more', { destinationType: 'content', page: { relationTo: 'articles', value: 42 } }), true)
  assert.equal(validate(page, 42, { destinationType: 'content', label: 'Read more' }), true)
  assert.equal(validate(href, '/products', { destinationType: 'url', label: 'Browse products' }), true)
  assert.equal(validate(icon, 'bolt'), true)
  assert.equal(validate(icon, 'shield-halved'), true)
  assert.equal(validate(icon, 'shield_halved'), 'Enter a Font Awesome 7 Sharp Solid icon name in kebab-case.')
})

test('optional CTA groups omit incomplete buttons without discarding their complete sibling', () => {
  const complete = { label: 'Browse services', href: '/services' }
  for (const partial of [
    { label: null, destinationType: null, href: '/contact' },
    { label: ' ', destinationType: 'url', href: '/contact' },
    { label: 'Contact us', destinationType: 'url', href: null },
    { label: 'Read more', destinationType: 'content', page: null },
    { label: 'Read more', destinationType: 'page', page: '' },
  ]) {
    assert.deepEqual(ctaGroupToProps({ primary: complete, secondary: partial }, 'ctas'), {
      primary: complete,
      secondary: undefined,
    })
    assert.deepEqual(ctaGroupToProps({ primary: partial, secondary: complete }, 'ctas'), {
      primary: undefined,
      secondary: complete,
    })
    assert.equal(ctaGroupToProps({ primary: partial, secondary: partial }, 'ctas'), undefined)
  }
})

test('recursive section conversion preserves content around incomplete nested CTAs', () => {
  const result = structuralSectionToProps({
    theme: 'light',
    intro: { heading: 'Compare service plans' },
    callout: {
      heading: 'Talk to a specialist',
      ctaGroup: {
        primaryButton: { label: 'Book a call', href: '/contact' },
        secondaryButton: { label: '', destinationType: null, href: '/services' },
      },
    },
    items: [
      { heading: 'Plan together', ctaGroup: { secondaryButton: { label: 'Read more', destinationType: 'page', page: null } } },
      { heading: 'Build together', ctaGroup: { secondaryButton: { destinationType: 'page' } } },
    ],
  })
  assert.equal(result.intro.heading, 'Compare service plans')
  assert.equal(result.callout.heading, 'Talk to a specialist')
  assert.deepEqual(result.callout.ctaGroup.primaryButton, { label: 'Book a call', href: '/contact' })
  assert.equal(result.callout.ctaGroup.secondaryButton, undefined)
  assert.equal(result.items[0].heading, 'Plan together')
  assert.equal(result.items[0].ctaGroup.secondaryButton, undefined)
  assert.equal(result.items[1].heading, 'Build together')
  assert.equal(result.items[1].ctaGroup.secondaryButton, undefined)
})

test('Process Story Allentown resolves CTA targets, styles and icons while dropping incomplete groups', () => {
  const contentHrefCalls = []
  const result = betaProcessStoryAllentownToProps({
    theme: 'light',
    intro: { heading: 'A controlled process' },
    introCtaGroup: [
      {
        label: 'Discuss your requirements',
        destinationType: 'content',
        page: { relationTo: 'pages', value: 7 },
        style: 'primary',
        icon: 'arrow-right',
      },
    ],
    items: [
      {
        label: 'Select',
        title: 'Choose the right cell technology',
        description: 'Reliable components support a repeatable battery platform.',
        ctaGroup: [
          { label: 'View selection criteria', destinationType: 'url', href: '/technology', style: 'secondary', icon: 'bolt' },
          { label: '', destinationType: 'url', href: '/contact', style: 'clear' },
        ],
      },
      {
        label: 'Validate',
        title: 'Test before deployment',
        description: 'Validation evidence confirms the battery will perform in the field.',
        ctaGroup: [{ label: '', destinationType: 'url', href: '/contact', style: 'primary' }],
      },
    ],
    listCtaGroup: [
      {
        label: 'Start an engineering conversation',
        destinationType: 'content',
        page: { relationTo: 'articles', value: 42 },
        style: 'clear',
        icon: 'arrow-right',
      },
      { label: '', destinationType: 'url', href: '/contact', style: 'primary' },
    ],
  }, {
    contentHref: (collection, id) => {
      contentHrefCalls.push([collection, id])
      return `/${collection}/${id}`
    },
  })

  assert.deepEqual(result.introCtaGroup, [{ label: 'Discuss your requirements', href: '/pages/7', style: 'primary', icon: 'arrow-right' }])
  assert.deepEqual(result.items[0].ctaGroup, [{ label: 'View selection criteria', href: '/technology', style: 'secondary', icon: 'bolt' }])
  assert.deepEqual(result.items[1].ctaGroup, [])
  assert.deepEqual(result.listCtaGroup, [{ label: 'Start an engineering conversation', href: '/articles/42', style: 'clear', icon: 'arrow-right' }])
  assert.deepEqual(contentHrefCalls, [['pages', '7'], ['articles', '42']])
})

test('optional CTA handling does not weaken required CTA or URL safety validation', () => {
  assert.throws(
    () => ctaToProps({ label: '', href: '/services' }, 'required'),
    /required\.label must be non-empty text/,
  )
  assert.throws(
    () => ctaGroupToProps({ primary: { label: 'Contact', href: 'javascript:alert(1)' } }, 'ctas'),
    /ctas\.primary\.href must be an HTTP\(S\) or root-relative URL/,
  )
})

test('CTA adapters accept Sharp Solid icon names and reject invalid populated names', () => {
  assert.deepEqual(
    ctaToProps({ label: 'Browse products', destinationType: 'url', href: '/products', icon: 'shield-halved' }, 'cta'),
    { label: 'Browse products', href: '/products', icon: 'shield-halved' },
  )
  assert.throws(
    () => ctaToProps({ label: 'Read more', destinationType: 'content', page: { relationTo: 'articles', value: { id: null } } }, 'cta'),
    /cta\.page\.value\.id must reference content/,
  )
  assert.throws(
    () => ctaToProps({ label: 'Read more', destinationType: 'content', page: { relationTo: '', value: 42 } }, 'cta'),
    /cta\.page\.relationTo must name a content collection/,
  )
  assert.throws(
    () => ctaToProps({ label: 'Browse products', destinationType: 'url', href: '/products', icon: 'external' }, 'cta'),
    /cta\.icon must name a Font Awesome 7 Sharp Solid icon/,
  )
})

test('Product Options retains published content links without dropping the section', () => {
  const publishedRoutes = new Map([['pages:intake', '/intake/']])
  const options = { contentHref: (collection, id) => publishedRoutes.get(`${collection}:${id}`) }
  const document = {
    theme: 'light',
    intro: { heading: 'Configure your system' },
    ctas: [
      { label: 'Book a call', destinationType: 'content', page: { relationTo: 'pages', value: { id: 'intake' } }, style: 'primary' },
      { label: 'Download specs', destinationType: 'url', href: '/specifications.pdf', style: 'clear' },
    ],
    options: [{
      title: 'Compact configuration',
      description: 'A smaller footprint for constrained installations.',
      image: { url: '/configuration.webp', alt: 'Compact configuration', width: 800, height: 600 },
    }],
  }

  const result = betaProductOptionsAllentownToProps(document, options)
  assert.deepEqual(result.ctas.buttons, [
    { label: 'Book a call', href: '/intake/', style: 'primary' },
    { label: 'Download specs', href: '/specifications.pdf', style: 'clear' },
  ])
  assert.throws(
    () => betaProductOptionsAllentownToProps(document, { contentHref: () => undefined }),
    /page is not available in this static build/,
  )
})
