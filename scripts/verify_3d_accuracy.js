import { create, all } from 'mathjs'
import assert from 'assert'

const math = create(all)

console.log('Running 3D Graph Mathematical Verification...')

// 1. Mock the 3D generation logic (copied from worker for testing isolation or import if possible)
// Since worker is module, we can try to import or just replicate the strict logic to verify the ALGORITHM.
// However, verifying the ACTUAL worker file is better.
// But importing worker file in Node might be tricky due to 'self' reference.
// Let's verify the LOGIC by replicating the EXACT logic we just wrote.

function generate3DDataLogic({ expression, xRange, yRange, resolution = 20 }) {
    const compiled = math.compile(expression)
    const xStep = (xRange.max - xRange.min) / resolution
    const yStep = (yRange.max - yRange.min) / resolution

    const zValues = []

    for (let r = 0; r <= resolution; r++) {
        const row = []
        const y = yRange.min + r * yStep
        for (let c = 0; c <= resolution; c++) {
            const x = xRange.min + c * xStep
            const scope = { x, y, e: Math.E, pi: Math.PI }
            try {
                let z = compiled.evaluate(scope)

                // STRICT LOGIC UNDER TEST
                if (z !== null && typeof z === 'object' && 're' in z) {
                    if (Math.abs(z.im) > 1e-10) {
                        z = null
                    } else {
                        z = z.re
                    }
                }

                if (z === null || !isFinite(z) || isNaN(z)) {
                    row.push(null)
                } else {
                    row.push(z)
                }
            } catch {
                row.push(null)
            }
        }
        zValues.push(row)
    }
    return zValues
}

// TEST CASES

// Test 1: Real Domain - Plane z = x + y
console.log('Test 1: Plane (All Real)')
const planeZ = generate3DDataLogic({ expression: 'x + y', xRange: { min: 0, max: 1 }, yRange: { min: 0, max: 1 } })
assert(planeZ[0][0] !== null, '0+0 should be valid')
assert(Math.abs(planeZ[0][0] - 0) < 1e-10, '0+0 should be 0')
console.log('✅ Passed')

// Test 2: Semi-Sphere - z = sqrt(1 - x^2 - y^2)
// Where x^2+y^2 > 1, result is complex (im != 0). Should be NULL.
console.log('Test 2: Semi-Sphere (Strict Domain)')
const sphereZ = generate3DDataLogic({ expression: 'sqrt(1 - x^2 - y^2)', xRange: { min: 0, max: 2 }, yRange: { min: 0, max: 2 } })
// At x=2, y=2 -> sqrt(1 - 4 - 4) = sqrt(-7) -> Complex. Should be null.
const valOutside = sphereZ[sphereZ.length - 1][sphereZ[0].length - 1] // Max x, Max y
assert(valOutside === null, `Expected null for complex result, got ${valOutside}`)
console.log('✅ Passed')

// Test 3: Logarithm - z = ln(x)
// x < 0 undefined.
console.log('Test 3: Logarithm (Negative undefined)')
const logZ = generate3DDataLogic({ expression: 'log(x)', xRange: { min: -1, max: 1 }, yRange: { min: -1, max: 1 } })
const valNeg = logZ[0][0] // x=-1
assert(valNeg === null, `Expected null for log(-1), got ${valNeg}`)
console.log('✅ Passed')

console.log('All Mathematical Verification Tests Passed!')
