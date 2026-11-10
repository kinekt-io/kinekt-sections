import assert from 'node:assert/strict'
import test from 'node:test'
import { manifestToProps } from '../dist/shared/manifest-block.js'
import { structuralSectionToProps } from '../dist/shared/structural-props.js'
import { ctaToProps } from '../dist/shared/payload.js'

test('tabs with no optional form retain their content while populated forms resolve', () => {
  const tabs = [{ heading: 'Contact', form: null }, { heading: 'Visit', form: '' }, { heading: 'Enquire', form: { embedCode: '<form></form>' } }]
  assert.deepEqual(manifestToProps({ tabs }).tabs, [
    { heading: 'Contact', form: undefined }, { heading: 'Visit', form: undefined }, { heading: 'Enquire', form: '<form></form>' },
  ])
  assert.equal(structuralSectionToProps({ theme: 'light', intro: { heading: 'Contact' }, form: null }).form, undefined)
  assert.throws(() => ctaToProps({ label: 'Download', destinationType: 'form', form: null }, 'cta'), /must be an object/)
})

test('structural video relationships become renderer embed code', () => {
  const props = structuralSectionToProps({
    theme: 'light',
    intro: { heading: 'Process' },
    videoEmbedHtml: { id: 'video', embedCode: '<iframe></iframe>' },
  })
  assert.equal(props.videoEmbedHtml, '<iframe></iframe>')
})
