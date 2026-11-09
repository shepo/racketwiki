import test from 'node:test'
import assert from 'node:assert/strict'
import {listingRel} from './listingRel.mjs'

test('listingRel: sponsored always wins', () => {
  assert.equal(listingRel({sponsored: true}), 'sponsored noopener')
  assert.equal(listingRel({sponsored: true, submitted: true, vouched: true}), 'sponsored noopener')
})

test('listingRel: submitted is ugc until vouched for', () => {
  assert.equal(listingRel({submitted: true}), 'ugc noopener')
  assert.equal(listingRel({submitted: true, vouched: true}), 'noopener')
})

test('listingRel: our own listings are followed', () => {
  assert.equal(listingRel({}), 'noopener')
})
