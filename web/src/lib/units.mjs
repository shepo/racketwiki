// Metric is canonical. Imperial is derived here, at build, and never stored.
// Plain JS (not TS) so `node --test` can run the tests without a build step.

const TO_MM = {mm: 1, cm: 10, m: 1000}
const TO_G = {g: 1, kg: 1000}
const MM_PER_IN = 25.4
const G_PER_OZ = 28.349523125

/** Trim trailing zeros: 20.0 -> "20", 45.50 -> "45.5". Uses en-GB grouping. */
export function num(n, dp = 2) {
  const fixed = Number(n.toFixed(dp))
  return fixed.toLocaleString('en-GB', {maximumFractionDigits: dp})
}

/** 6096 mm -> "20 ft", 6095 mm -> "19 ft 11.9 in" style is avoided: inches are rounded to whole numbers above 1 m. */
export function imperialLength(mm) {
  const inches = mm / MM_PER_IN
  if (mm < 1000) {
    // Two decimals under 10 in, so close figures stay distinct: a squash ball is 1.56–1.59 in, not 1.6–1.6 in.
    const dp = inches < 10 ? 2 : 1
    return `${num(inches, dp)} in`
  }
  let ft = Math.floor(inches / 12)
  let rem = Math.round(inches - ft * 12)
  if (rem === 12) {
    ft += 1
    rem = 0
  }
  return rem === 0 ? `${ft} ft` : `${ft} ft ${rem} in`
}

export function imperialMass(g) {
  const oz = g / G_PER_OZ
  if (oz >= 16) {
    const lb = Math.floor(oz / 16)
    const rem = oz - lb * 16
    return rem < 0.05 ? `${lb} lb` : `${lb} lb ${num(rem, 1)} oz`
  }
  return `${num(oz, oz < 1 ? 3 : 2)} oz`
}

export function isLength(unit) {
  return unit in TO_MM
}

export function isMass(unit) {
  return unit in TO_G
}

/** Metric value in canonical base: mm for lengths, g for mass. */
export function toBase(value, unit) {
  if (isLength(unit)) return value * TO_MM[unit]
  if (isMass(unit)) return value * TO_G[unit]
  throw new Error(`Unknown unit "${unit}"`)
}

export function toMetres(m) {
  return toBase(m.value, m.unit) / 1000
}

function imperialOf(value, unit) {
  const base = toBase(value, unit)
  return isLength(unit) ? imperialLength(base) : imperialMass(base)
}

function stripUnit(s) {
  return s.replace(/\s*(in|ft|oz|lb)$/, '')
}

/**
 * Format a measurement for display, metric first and imperial in brackets.
 * { value: 20, unit: 'm' } -> { metric: '20 m', imperial: '65 ft 7 in', text: '20 m (65 ft 7 in)' }
 * qualifier: exact | max | min | range | approx
 */
/**
 * Decimal places for the metric figure. 10 m and over: 2 (13.4112 m converted from 44 ft reads
 * 13.41 m). Everything else keeps up to 3, so stated precision such as 1.525 m is never rounded.
 */
function dpFor(value, unit) {
  return unit === 'm' && Math.abs(value) >= 10 ? 2 : 3
}

export function formatMeasurement(m, qualifier = 'exact') {
  if (!m || typeof m.value !== 'number') return null
  const {value, valueTo, unit} = m
  let metric
  let imperial
  if (qualifier === 'range' && typeof valueTo === 'number') {
    metric = `${num(value, dpFor(value, unit))}–${num(valueTo, dpFor(valueTo, unit))} ${unit}`
    const a = imperialOf(value, unit)
    const b = imperialOf(valueTo, unit)
    // "2.5–2.63 in" when both share a simple unit; otherwise spell both out.
    const sameSimple = /^[\d.,]+ (in|oz)$/.test(a) && a.split(' ')[1] === b.split(' ')[1]
    imperial = sameSimple ? `${stripUnit(a)}–${b}` : `${a} to ${b}`
  } else {
    metric = `${num(value, dpFor(value, unit))} ${unit}`
    imperial = imperialOf(value, unit)
  }
  const prefix = qualifier === 'approx' ? 'about ' : ''
  const suffix = qualifier === 'max' ? ' maximum' : qualifier === 'min' ? ' minimum' : ''
  return {metric, imperial, text: `${prefix}${metric} (${imperial})${suffix}`}
}

/** "20 m × 10 m (65 ft 7 in × 32 ft 10 in)" */
export function formatDimensions(length, width) {
  const l = formatMeasurement(length)
  const w = formatMeasurement(width)
  if (!l || !w) return null
  return {
    metric: `${l.metric} × ${w.metric}`,
    imperial: `${l.imperial} × ${w.imperial}`,
    text: `${l.metric} × ${w.metric} (${l.imperial} × ${w.imperial})`,
  }
}
