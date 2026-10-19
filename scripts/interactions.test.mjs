import assert from 'node:assert/strict'
import test from 'node:test'
import { Window } from 'happy-dom'
import { initializeKinektInteractions } from '../dist/shared/interactions.js'

function installDom(html) {
  const window = new Window()
  window.document.body.innerHTML = html
  Object.assign(globalThis, {
    document: window.document,
    HTMLElement: window.HTMLElement,
    HTMLButtonElement: window.HTMLButtonElement,
    HTMLDetailsElement: window.HTMLDetailsElement,
    HTMLInputElement: window.HTMLInputElement,
    HTMLSelectElement: window.HTMLSelectElement,
  })
  return window
}

test('single-open disclosures preserve native details semantics', { concurrency: false }, () => {
  const window = installDom(`
    <ul data-kinekt-disclosure-group>
      <li><details open data-kinekt-disclosure><summary>One</summary><p>First</p></details></li>
      <li><details data-kinekt-disclosure><summary>Two</summary><p>Second</p></details></li>
    </ul>
  `)
  initializeKinektInteractions()

  const disclosures = window.document.querySelectorAll('details')
  disclosures[1].open = true
  disclosures[1].dispatchEvent(new window.Event('toggle'))

  assert.equal(disclosures[0].open, false)
  assert.equal(disclosures[1].open, true)
})

test('tabs activate panels and support roving arrow-key navigation', { concurrency: false }, () => {
  const window = installDom(`
    <div data-kinekt-tabs>
      <div role="tablist">
        <button role="tab" aria-selected="true" aria-controls="one" tabindex="0">One</button>
        <button role="tab" aria-selected="false" aria-controls="two" tabindex="-1">Two</button>
      </div>
      <div id="one" role="tabpanel">First</div>
      <div id="two" role="tabpanel" hidden>Second</div>
    </div>
  `)
  initializeKinektInteractions()

  const tabs = window.document.querySelectorAll('[role="tab"]')
  const panels = window.document.querySelectorAll('[role="tabpanel"]')
  tabs[1].click()
  assert.equal(tabs[1].getAttribute('aria-selected'), 'true')
  assert.equal(panels[0].hidden, true)
  assert.equal(panels[1].hidden, false)

  tabs[1].dispatchEvent(new window.KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }))
  assert.equal(tabs[0].getAttribute('aria-selected'), 'true')
  assert.equal(panels[0].hidden, false)
})

test('search grid keeps a client-side fallback when Pagefind is unavailable', { concurrency: false }, () => {
  const window = installDom(`n    <div data-kinekt-search-grid data-kinekt-pagefind-url="/missing-pagefind.js">
      <form data-kinekt-search-form><input data-kinekt-search-query><select data-kinekt-search-facet="type"><option value="">All</option><option value="Case">Case</option></select></form>
      <p data-kinekt-search-status></p>
      <ul data-kinekt-search-results>
        <li data-kinekt-search-item data-kinekt-search-text="battery case study" data-kinekt-search-type="Case"></li>
        <li data-kinekt-search-item data-kinekt-search-text="drone article" data-kinekt-search-type="Article"></li>
      </ul>
    </div>
  `)
  initializeKinektInteractions()

  const query = window.document.querySelector('[data-kinekt-search-query]')
  query.value = 'drone'
  query.dispatchEvent(new window.Event('input', { bubbles: true }))

  const items = window.document.querySelectorAll('[data-kinekt-search-item]')
  assert.equal(items[0].hidden, true)
  assert.equal(items[1].hidden, false)
  assert.equal(window.document.querySelector('[data-kinekt-search-status]').textContent, '1 result')
})
