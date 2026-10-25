import {test} from 'node:test'
import assert from 'node:assert/strict'
import {formatMeasurement, formatDimensions, imperialLength, imperialMass} from './units.mjs'

test('brief example: padel court', () => {
  assert.equal(
    formatDimensions({value: 20, unit: 'm'}, {value: 10, unit: 'm'}).text,
    '20 m × 10 m (65 ft 7 in × 32 ft 10 in)',
  )
})

test('tennis court 23.77 m rounds up to 78 ft, 10.97 m to 36 ft', () => {
  assert.equal(imperialLength(23770), '78 ft')
  assert.equal(imperialLength(10970), '36 ft')
})

test('pickleball 44 ft stored as 13.4112 m converts back exactly', () => {
  assert.equal(imperialLength(13411.2), '44 ft')
  assert.equal(imperialLength(6096), '20 ft')
})

test('short lengths in inches', () => {
  assert.equal(formatMeasurement({value: 45.5, unit: 'cm'}, 'max').text, '45.5 cm (17.9 in) maximum')
  assert.equal(formatMeasurement({value: 38, unit: 'mm'}, 'max').imperial, '1.5 in')
  assert.equal(imperialLength(736.6), '29 in')
})

test('mass', () => {
  assert.equal(imperialMass(56), '1.98 oz')
  assert.equal(imperialMass(2.7), '0.095 oz')
  assert.equal(imperialMass(453.6), '1 lb')
})

test('ranges', () => {
  assert.equal(formatMeasurement({value: 56, valueTo: 59.4, unit: 'g'}, 'range').text, '56–59.4 g (1.98–2.1 oz)')
  assert.equal(formatMeasurement({value: 6.54, valueTo: 6.86, unit: 'cm'}, 'range').imperial, '2.57–2.7 in')
})

test('approx and min', () => {
  assert.equal(formatMeasurement({value: 3, unit: 'm'}, 'approx').text, 'about 3 m (9 ft 10 in)')
  assert.equal(formatMeasurement({value: 1, unit: 'kg'}, 'min').text, '1 kg (2 lb 3.3 oz) minimum')
})

test('long metre conversions round to 2 dp; stated precision is kept', () => {
  assert.equal(formatMeasurement({value: 13.4112, unit: 'm'}).text, '13.41 m (44 ft)')
  assert.equal(formatMeasurement({value: 1.525, unit: 'm'}).metric, '1.525 m')
  assert.equal(formatMeasurement({value: 23.77, unit: 'm'}).metric, '23.77 m')
})
