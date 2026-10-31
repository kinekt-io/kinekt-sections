import assert from 'node:assert/strict'
import test from 'node:test'
import { normalizeSectionContentWidth } from '../dist/shared/section-width.js'

test('unsupported content widths cannot pass through inherited object properties or numeric coercion', () => {
  for (const value of ['toString', 'constructor', '__proto__', '50', '100%', 80, 0.7, false, {}, []]) {
    assert.throws(() => normalizeSectionContentWidth(value), /contentWidth must be one of standard, 80, or 70/)
  }
})
