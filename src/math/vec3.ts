import {
  ceil,
  floor,
  round,
  sign,
  abs,
  min,
  max,
  sqrt,
  lerp,
  acos,
  TOLERANCE,
  almostEquals,
  isFinite,
  scalarSnap,
  inverseLerp,
  smoothStep,
  scalarNegate,
  scalarInvert,
  scalarAdd,
  scalarSubtract,
  scalarMultiply,
  scalarDivide,
  scalarModulus,
  scalarAddScale,
  clamp,
  scalarSquared,
  pow,
  almostZero,
  scalarEquals,
  isZero,
  cos,
  sin
} from './scalar'

export const vec3New = (x: number, y: number, z: number): Vec3 => ({ x, y, z })

export const vec3NewValue = (value: number = 0): Vec3 => ({ x: value, y: value, z: value })

export const vec3Temp0 = vec3NewValue()

export const vec3Temp1 = vec3NewValue()

export const vec3Temp2 = vec3NewValue()

export const vec3Temp3 = vec3NewValue()

export const VEC3_ZERO: Vec3In = vec3NewValue(0)

export const VEC3_ONE: Vec3In = vec3NewValue(1)

export const VEC3_UNIT_X: Vec3In = vec3New(1, 0, 0)

export const VEC3_UNIT_Y: Vec3In = vec3New(0, 1, 0)

export const VEC3_UNIT_Z: Vec3In = vec3New(0, 0, 1)

export const vec3Every = ({ x, y, z }: Vec3In, fn: (value: number) => boolean) => fn(x) && fn(y) && fn(z)

export const vec3EveryVecVec = ({ x, y, z }: Vec3In, b: Vec3In, fn: (a: number, b: number) => boolean) =>
  fn(x, b.x) && fn(y, b.y) && fn(z, b.z)

export const vec3Set = (out: Vec3Out, x: number, y: number, z: number) => {
  out.x = x
  out.y = y
  out.z = z
  return out
}

export const vec3SetEach = (out: Vec3Out, { x, y, z }: Vec3In, fn: (value: number) => number) =>
  vec3Set(out, fn(x), fn(y), fn(z))

export const vec3SetEachVecVec = (out: Vec3Out, { x, y, z }: Vec3In, b: Vec3In, fn: (a: number, b: number) => number) =>
  vec3Set(out, fn(x, b.x), fn(y, b.y), fn(z, b.z))

export const vec3SetEachVecVecVec = (
  out: Vec3Out,
  { x, y, z }: Vec3In,
  b: Vec3In,
  c: Vec3In,
  fn: (a: number, b: number, c: number) => number
) => vec3Set(out, fn(x, b.x, c.x), fn(y, b.y, c.y), fn(z, b.z, c.z))

export const vec3SetEachVecScalar = (
  out: Vec3Out,
  { x, y, z }: Vec3In,
  b: number,
  fn: (a: number, b: number) => number
) => vec3Set(out, fn(x, b), fn(y, b), fn(z, b))

export const vec3SetEachVecVecScalar = (
  out: Vec3Out,
  { x, y, z }: Vec3In,
  b: Vec3In,
  c: number,
  fn: (a: number, b: number, c: number) => number
) => vec3Set(out, fn(x, b.x, c), fn(y, b.y, c), fn(z, b.z, c))

export const vec3Copy = (out: Vec3Out, { x, y, z }: Vec3In) => vec3Set(out, x, y, z)

export const vec3Fill = (out: Vec3Out, value: number = 0) => vec3Set(out, value, value, value)

export const vec3SetZero: (out: Vec3Out) => void = vec3Fill

export const vec3SetUnitX = (out: Vec3) => vec3Set(out, 1, 0, 0)

export const vec3SetUnitY = (out: Vec3) => vec3Set(out, 0, 1, 0)

export const vec3SetUnitZ = (out: Vec3) => vec3Set(out, 0, 0, 1)

export const vec3Equals = (a: Vec3In, b: Vec3In): boolean => vec3EveryVecVec(a, b, scalarEquals)

export const vec3AlmostEquals = ({ x, y, z }: Vec3In, b: Vec3In, tolerance = TOLERANCE): boolean =>
  almostEquals(x, b.x, tolerance) && almostEquals(y, b.y, tolerance) && almostEquals(z, b.z, tolerance)

export const vec3IsFinite = (a: Vec3In): boolean => vec3Every(a, isFinite)

export const vec3IsZero = (a: Vec3In): boolean => vec3Every(a, isZero)

export const vec3AlmostZero = ({ x, y, z }: Vec3In, tolerance = TOLERANCE): boolean =>
  almostZero(x, tolerance) && almostZero(y, tolerance) && almostZero(z, tolerance)

export const vec3Dot = ({ x, y, z }: Vec3In, b: Vec3In): number => x * b.x + y * b.y + z * b.z

export const vec3Sum = ({ x, y, z }: Vec3In): number => x + y + z

export const vec3Product = ({ x, y, z }: Vec3In): number => x * y * z

export const vec3LengthSquared = ({ x, y, z }: Vec3In): number => x ** 2 + y ** 2 + z ** 2

export const vec3Length = (a: Vec3In): number => sqrt(vec3LengthSquared(a))

export const vec3DistanceSquared = ({ x, y, z }: Vec3In, b: Vec3In): number =>
  (b.x - x) ** 2 + (b.y - y) ** 2 + (b.z - z) ** 2

export const vec3Distance = (a: Vec3In, b: Vec3In): number => sqrt(vec3DistanceSquared(a, b))

export const vec3Angle = (a: Vec3In, b: Vec3In): number => {
  const mag = vec3Length(a) * vec3Length(b)
  return acos(min(max(mag && vec3Dot(a, b) / mag, -1), 1))
}

export const vec3Negate = (out: Vec3Out, a: Vec3In = out) => vec3SetEach(out, a, scalarNegate)

export const vec3Invert = (out: Vec3Out, a: Vec3In = out) => vec3SetEach(out, a, scalarInvert)

export const vec3Add = (out: Vec3Out, a: Vec3In, b: Vec3In = out) => vec3SetEachVecVec(out, a, b, scalarAdd)

export const vec3ScalarAdd = (out: Vec3Out, scalar: number, a: Vec3In = out) =>
  vec3SetEachVecScalar(out, a, scalar, scalarAdd)

export const vec3AddScale = (out: Vec3Out, a: Vec3In, b: Vec3In, scale: number) =>
  vec3SetEachVecVecScalar(out, a, b, scale, scalarAddScale)

export const vec3Subtract = (out: Vec3Out, a: Vec3In, b: Vec3In) => vec3SetEachVecVec(out, a, b, scalarSubtract)

export const vec3SubtractScalar = (out: Vec3Out, a: Vec3In, b: number) =>
  vec3SetEachVecScalar(out, a, b, scalarSubtract)

export const vec3ScalarSubtract = (out: Vec3Out, a: number, b: Vec3In = out) => vec3SetEach(out, b, (v) => a - v)

export const vec3Multiply = (out: Vec3Out, a: Vec3In, b: Vec3In = out) => vec3SetEachVecVec(out, a, b, scalarMultiply)

export const vec3ScalarMultiply = (out: Vec3Out, b: number, a: Vec3In = out) =>
  vec3SetEachVecScalar(out, a, b, scalarMultiply)

export const vec3Pow = (out: Vec3Out, a: Vec3In, b: Vec3In) => vec3SetEachVecVec(out, a, b, pow)

export const vec3PowScalar = (out: Vec3Out, a: Vec3In, b: number) => vec3SetEachVecScalar(out, a, b, pow)

export const vec3ScalarPow = (out: Vec3Out, a: number, b: Vec3In) => vec3SetEach(out, b, (v) => a ** v)

export const vec3Divide = (out: Vec3Out, a: Vec3In, b: Vec3In) => vec3SetEachVecVec(out, a, b, scalarDivide)

export const vec3DivideScalar = (out: Vec3Out, a: Vec3In, b: number) => vec3SetEachVecScalar(out, a, b, scalarDivide)

export const vec3ScalarDivide = (out: Vec3Out, a: number, b: Vec3In = out) => vec3SetEach(out, b, (v) => a / v)

export const vec3Modulus = (out: Vec3Out, a: Vec3In, b: Vec3In) => vec3SetEachVecVec(out, a, b, scalarModulus)

export const vec3ModulusScalar = (out: Vec3Out, a: Vec3In, b: number) => vec3SetEachVecScalar(out, a, b, scalarModulus)

export const vec3ScalarModulus = (out: Vec3Out, a: number, b: Vec3In = out) => vec3SetEach(out, b, (v) => a % v)

export const vec3Normalize = (out: Vec3Out, a: Vec3In = out) => vec3DivideScalar(out, a, vec3Length(a))

export const vec3Squared = (out: Vec3Out, a: Vec3In = out) => vec3SetEach(out, a, scalarSquared)

export const vec3Ceil = (out: Vec3Out, a: Vec3In = out) => vec3SetEach(out, a, ceil)

export const vec3Floor = (out: Vec3Out, a: Vec3In = out) => vec3SetEach(out, a, floor)

export const vec3Round = (out: Vec3Out, a: Vec3In = out) => vec3SetEach(out, a, round)

export const vec3Sign = (out: Vec3Out, a: Vec3In = out) => vec3SetEach(out, a, sign)

export const vec3Abs = (out: Vec3Out, a: Vec3In = out) => vec3SetEach(out, a, abs)

export const vec3Sqrt = (out: Vec3Out, a: Vec3In = out) => vec3SetEach(out, a, sqrt)

export const vec3Min = (out: Vec3Out, b: Vec3In, a: Vec3In = out) => vec3SetEachVecVec(out, a, b, min)

export const vec3MinScalar = (out: Vec3Out, scalar: number, a: Vec3In = out) =>
  vec3SetEachVecScalar(out, a, scalar, min)

export const vec3Max = (out: Vec3Out, b: Vec3In, a: Vec3In = out) => vec3SetEachVecVec(out, a, b, max)

export const vec3MaxScalar = (out: Vec3Out, scalar: number, a: Vec3In = out) =>
  vec3SetEachVecScalar(out, a, scalar, max)

export const vec3Clamp = (out: Vec3Out, a: Vec3In, minimum: Vec3In, maximum: Vec3In) =>
  vec3SetEachVecVecVec(out, a, minimum, maximum, clamp)

export const vec3ClampScalar = (out: Vec3Out, a: Vec3In, minimum: number, maximum: number) =>
  vec3SetEach(out, a, (v) => clamp(v, minimum, maximum))

export const vec3Reflect = (out: Vec3Out, direction: Vec3In, normal: Vec3In) =>
  vec3AddScale(out, direction, normal, -vec3Dot(direction, normal) * 2)

export const vec3Project = (out: Vec3Out, a: Vec3In, b: Vec3In) =>
  vec3ScalarMultiply(out, vec3Dot(a, b) / vec3Length(b), a)

export const vec3Direction = (out: Vec3Out, a: Vec3In, b: Vec3In) => vec3Normalize(vec3Subtract(out, b, a))

export const vec3Slide = (out: Vec3Out, a: Vec3In, normal: Vec3In) => vec3AddScale(out, a, normal, -vec3Dot(a, normal))

export const vec3Lerp = (out: Vec3Out, a: Vec3In, b: Vec3In, t: number) => vec3SetEachVecVecScalar(out, a, b, t, lerp)

export const vec3SmoothStep = (out: Vec3Out, a: Vec3In, b: Vec3In, t: number) =>
  vec3SetEachVecVecScalar(out, a, b, t, smoothStep)

export const vec3InverseLerp = (out: Vec3Out, a: Vec3In, b: Vec3In, t: number) =>
  vec3SetEachVecVecScalar(out, a, b, t, inverseLerp)

export const vec3Snap = (out: Vec3Out, a: Vec3In, step: Vec3In) => vec3SetEachVecVec(out, a, step, scalarSnap)

export const vec3SnapScalar = (out: Vec3Out, a: Vec3In, step: number) => vec3SetEachVecScalar(out, a, step, scalarSnap)

export const vec3Hermite = (out: Vec3Out, a: Vec3In, b: Vec3In, c: Vec3In, d: Vec3In, t: number) => {
  const t2 = t * t
  const factor1 = t2 * (2 * t - 3) + 1
  const factor2 = t2 * (t - 2) + t
  const factor3 = t2 * (t - 1)
  const factor4 = t2 * (3 - 2 * t)
  vec3Set(
    out,
    a.x * factor1 + b.x * factor2 + c.x * factor3 + d.x * factor4,
    a.y * factor1 + b.y * factor2 + c.y * factor3 + d.y * factor4,
    a.z * factor1 + b.z * factor2 + c.z * factor3 + d.z * factor4
  )
}

export const vec3Bezier = (out: Vec3Out, a: Vec3In, b: Vec3In, c: Vec3In, d: Vec3In, t: number) => {
  const inverseFactor = 1 - t
  const inverseFactorTimesTwo = inverseFactor * inverseFactor
  const factorTimes2 = t * t
  const factor1 = inverseFactorTimesTwo * inverseFactor
  const factor2 = 3 * t * inverseFactorTimesTwo
  const factor3 = 3 * factorTimes2 * inverseFactor
  const factor4 = factorTimes2 * t
  vec3Set(
    out,
    a.x * factor1 + b.x * factor2 + c.x * factor3 + d.x * factor4,
    a.y * factor1 + b.y * factor2 + c.y * factor3 + d.y * factor4,
    a.z * factor1 + b.z * factor2 + c.z * factor3 + d.z * factor4
  )
}

export const vec3Cross = (out: Vec3Out, { x, y, z }: Vec3In, { x: bx, y: by, z: bz }: Vec3In) =>
  vec3Set(out, y * bz - z * by, z * bx - x * bz, x * by - y * bx)

export function rotateX(
  out: Vec3Out,
  angleInRadians: number,
  { x, y, z }: Vec3 = out,
  { y: originY, z: originZ }: Vec3 = VEC3_ZERO
) {
  const c = cos(angleInRadians)
  const s = sin(angleInRadians)
  const py = y - originY
  const pz = z - originZ
  vec3Set(out, x, py * c - pz * s, py * s + pz * x)
}

export const rotateY = (
  out: Vec3Out,
  angleInRadians: number,
  { x, y, z }: Vec3 = out,
  { x: originX, z: originZ }: Vec3 = VEC3_ZERO
) => {
  const c = cos(angleInRadians)
  const s = sin(angleInRadians)
  const p0 = x - originX
  const p2 = z - originZ
  vec3Set(out, p2 * s + p0 * c + originX, y, p2 * c - p0 * s + originZ)
}

export const rotateZ = (
  out: Vec3Out,
  angleInRadians: number,
  { x, y, z }: Vec3 = out,
  { x: originX, y: originY }: Vec3 = VEC3_ZERO
) => {
  const s = sin(angleInRadians)
  const c = cos(angleInRadians)
  const p0 = x - originX
  const p1 = y - originY
  vec3Set(out, p0 * c - p1 * s + originX, p0 * s + p1 * c + originY, z)
}
