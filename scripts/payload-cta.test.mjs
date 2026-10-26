import assert from 'node:assert/strict'
import test from 'node:test'
import { ctaGroupToProps, ctaToProps } from '../dist/shared/payload.js'
import { ctaFields } from '../dist/shared/payload-fields.js'

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

test('CTA validators reject partial publish values while allowing an omitted CTA', () => {
  const label = ctaField('label')
  const href = ctaField('href')
  const page = ctaField('page')
  assert.deepEqual(page.relationTo, ['pages', 'articles'])

  assert.equal(validate(label, undefined, { destinationType: 'url', icon: null }), true)
  assert.equal(validate(label, 'Browse products', { destinationType: 'url' }), 'Enter an absolute HTTP(S) URL or a site-root-relative path.')
  assert.equal(validate(label, undefined, { destinationType: 'url', href: '/products' }), 'Enter non-empty text.')
  assert.equal(validate(label, 'Read more', { destinationType: 'content', page: { relationTo: 'articles', value: 42 } }), true)
  assert.equal(validate(page, 42, { destinationType: 'content', label: 'Read more' }), true)
  assert.equal(validate(href, '/products', { destinationType: 'url', label: 'Browse products' }), true)

  assert.throws(
    () => ctaGroupToProps({ primary: { destinationType: 'url', href: '/products' } }, 'ctas'),
    /ctas\.primary\.label must be non-empty text/,
  )
  assert.throws(
    () => ctaGroupToProps({ secondary: { destinationType: 'content', label: 'Read more' } }, 'ctas'),
    /ctas\.secondary\.page must be an object/,
  )
})

test('CTA adapters reject malformed relationships and unsupported populated icons', () => {
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
    /cta\.icon must be arrow-right or arrow-down/,
  )
})
