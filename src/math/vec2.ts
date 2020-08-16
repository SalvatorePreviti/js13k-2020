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
  clamp,
  almostZero,
  scalarEquals
} from './scalar'

export type Vec2 = { x: number; y: number }

export type Vec2Out = { x: number; y: number }

export type Vec2In = { readonly x: number; readonly y: number }

export const vec2New = (x: number, y: number): Vec2 => ({ x, y })

export const vec2NewValue = (value: number = 0): Vec2 => vec2New(value, value)

export const VEC2_ZERO: Vec2In = vec2NewValue(0)

export const VEC2_ONE: Vec2In = vec2NewValue(1)

export const VEC2_UNIT_X: Vec2In = vec2New(1, 0)

export const VEC2_UNIT_Y: Vec2In = vec2New(0, 1)

export const vec2Every = (a: Vec2In, fn: (value: number) => boolean) => fn(a.x) && fn(a.y)

export const vec2EveryVecVec = (a: Vec2In, b: Vec2In, fn: (a: number, b: number) => boolean) =>
  fn(a.x, b.x) && fn(a.y, b.y)

export const vec2Set = (out: Vec2Out, x: number, y: number) => {
  out.x = x
  out.y = y
  return out
}

export const vec2Copy = (out: Vec2Out, a: Vec2In) => vec2Set(out, a.x, a.y)

export const vec2Fill = (out: Vec2Out, value: number = 0) => vec2Set(out, value, value)

export const vec2SetZero: (out: Vec2Out) => void = vec2Fill

export const vec2SetUnitX = (out: Vec2) => vec2Set(out, 1, 0)

export const vec2SetUnitY = (out: Vec2) => vec2Set(out, 0, 1)

export const vec2SetEach = (out: Vec2Out, a: Vec2In, fn: (value: number) => number) => vec2Set(out, fn(a.x), fn(a.y))

export const vec2SetEachVecVec = (out: Vec2Out, a: Vec2In, b: Vec2In, fn: (a: number, b: number) => number) =>
  vec2Set(out, fn(a.x, b.x), fn(a.y, b.y))

export const vec2SetEachVecVecVec = (
  out: Vec2Out,
  a: Vec2In,
  b: Vec2In,
  c: Vec2In,
  fn: (a: number, b: number, c: number) => number
) => vec2Set(out, fn(a.x, b.x, c.x), fn(a.y, b.y, c.y))

export const vec2SetEachVecScalar = (out: Vec2Out, a: Vec2In, b: number, fn: (a: number, b: number) => number) =>
  vec2Set(out, fn(a.x, b), fn(a.y, b))

export const vec2SetEachVecVecScalar = (
  out: Vec2Out,
  a: Vec2In,
  b: Vec2In,
  c: number,
  fn: (a: number, b: number, c: number) => number
) => vec2Set(out, fn(a.x, b.x, c), fn(a.y, b.y, c))

export const vec2Equals = (a: Vec2In, b: Vec2In): boolean => vec2EveryVecVec(a, b, scalarEquals)

export const vec2AlmostEquals = (a: Vec2In, b: Vec2In, tolerance = TOLERANCE): boolean =>
  almostEquals(a.x, b.x, tolerance) && almostEquals(a.y, b.y, tolerance)

export const vec2IsFinite = (a: Vec2In): boolean => isFinite(a.x) && isFinite(a.y)

export const vec2IsZero = (a: Vec2In): boolean => a.x === 0 && a.y === 0

export const vec2AlmostZero = (a: Vec2In, tolerance = TOLERANCE): boolean =>
  almostZero(a.x, tolerance) && almostZero(a.y, tolerance)

export const vec2Dot = (a: Vec2In, b: Vec2In): number => a.x * b.x + a.y * b.y

export const vec2Sum = (a: Vec2In): number => a.x + a.y

export const vec2Product = (a: Vec2In): number => a.x * a.y

export const vec2LengthSquared = (a: Vec2In): number => a.x * a.x + a.y * a.y

export const vec2Length = (a: Vec2In): number => sqrt(vec2LengthSquared(a))

export const vec2DistanceSquared = (a: Vec2In, b: Vec2In): number => (b.x - a.x) ** 2 + (b.y - a.y) ** 2

export const vec2Distance = (a: Vec2In, b: Vec2In): number => sqrt(vec2DistanceSquared(a, b))

export const vec2Angle = (a: Vec2In, b: Vec2In): number => {
  const mag = vec2Length(a) * vec2Length(b)
  return acos(min(max(mag && vec2Dot(a, b) / mag, -1), 1))
}

export const vec2Negate = (out: Vec2Out, a: Vec2In = out) => vec2Set(out, -a.x, -a.y)

export const vec2Invert = (out: Vec2Out, a: Vec2In = out) => vec2Set(out, 1 / a.x, 1 / a.y)

export const vec2Add = (out: Vec2Out, a: Vec2In, b: Vec2In = out) => vec2Set(out, a.x + b.x, a.y + b.y)

export const vec2ScalarAdd = (out: Vec2Out, scalar: number, b: Vec2In = out) => vec2Set(out, scalar + b.x, scalar + b.y)

export const vec2AddScale = (out: Vec2Out, a: Vec2In, b: Vec2In, scale: number) =>
  vec2Set(out, a.x + b.x * scale, a.y + b.y * scale)

export const vec2Subtract = (out: Vec2Out, a: Vec2In, b: Vec2In) => vec2Set(out, a.x - b.x, a.y - b.y)

export const vec2SubtractScalar = (out: Vec2Out, a: Vec2In, b: number) => vec2Set(out, a.x - b, a.y - b)

export const vec2ScalarSubtract = (out: Vec2Out, a: number, b: Vec2In = out) => vec2Set(out, a - b.x, a - b.y)

export const vec2Multiply = (out: Vec2Out, a: Vec2In, b: Vec2In = out) => vec2Set(out, a.x * b.x, a.y * b.y)

export const vec2ScalarMultiply = (out: Vec2Out, a: number, b: Vec2In = out) => vec2Set(out, b.x * a, b.y * a)

export const vec2Pow = (out: Vec2Out, a: Vec2In, b: Vec2In) => vec2Set(out, a.x ** b.x, a.y ** b.y)

export const vec2PowScalar = (out: Vec2Out, a: Vec2In, b: number) => vec2Set(out, a.x ** b, a.y ** b)

export const vec2ScalarPow = (out: Vec2Out, a: number, b: Vec2In) => vec2Set(out, a ** b.x, a ** b.y)

export const vec2Divide = (out: Vec2Out, a: Vec2In, b: Vec2In) => vec2Set(out, a.x / b.x, a.y / b.y)

export const vec2DivideScalar = (out: Vec2Out, a: Vec2In, b: number) => vec2Set(out, a.x / b, a.y / b)

export const vec2ScalarDivide = (out: Vec2Out, a: number, b: Vec2In = out) => vec2Set(out, a / b.x, a / b.y)

export const vec2Modulus = (out: Vec2Out, a: Vec2In, b: Vec2In) => vec2Set(out, a.x % b.x, a.y % b.y)

export const vec2ModulusScalar = (out: Vec2Out, a: Vec2In, b: number) => vec2Set(out, a.x % b, a.y % b)

export const vec2ScalarModulus = (out: Vec2Out, a: number, b: Vec2In = out) => vec2Set(out, a % b.x, a % b.y)

export const vec2Normalize = (out: Vec2Out, a: Vec2In = out) => vec2DivideScalar(out, a, vec2Length(a))

export const vec2Squared = (out: Vec2Out, { x, y }: Vec2In = out) => vec2Set(out, x * x, y * y)

export const vec2Ceil = (out: Vec2Out, a: Vec2In = out) => vec2SetEach(out, a, ceil)

export const vec2Floor = (out: Vec2Out, a: Vec2In = out) => vec2SetEach(out, a, floor)

export const vec2Round = (out: Vec2Out, a: Vec2In = out) => vec2SetEach(out, a, round)

export const vec2Sign = (out: Vec2Out, a: Vec2In = out) => vec2SetEach(out, a, sign)

export const vec2Abs = (out: Vec2Out, a: Vec2In = out) => vec2SetEach(out, a, abs)

export const vec2Sqrt = (out: Vec2Out, a: Vec2In = out) => vec2SetEach(out, a, sqrt)

export const vec2Min = (out: Vec2Out, b: Vec2In, a: Vec2In = out) => vec2Set(out, min(a.x, b.x), min(a.y, b.y))

export const vec2MinScalar = (out: Vec2Out, scalar: number, b: Vec2In = out) =>
  vec2Set(out, min(scalar, b.x), min(scalar, b.y))

export const vec2Max = (out: Vec2Out, b: Vec2In, a: Vec2In = out) => vec2Set(out, max(a.x, b.x), max(a.y, b.y))

export const vec2MaxScalar = (out: Vec2Out, scalar: number, a: Vec2In = out) =>
  vec2Set(out, max(scalar, a.x), max(scalar, a.y))

export const vec2Clamp = (out: Vec2Out, a: Vec2In, minimum: Vec2In, maximum: Vec2In) =>
  vec2Set(out, clamp(a.x, minimum.x, maximum.x), clamp(a.y, minimum.y, maximum.y))

export const vec2ClampScalar = (out: Vec2Out, a: Vec2In, minimum: number, maximum: number) =>
  vec2Set(out, clamp(a.x, minimum, maximum), clamp(a.y, minimum, maximum))

export const vec2Reflect = (out: Vec2Out, direction: Vec2In, normal: Vec2In) =>
  vec2AddScale(out, direction, normal, -vec2Dot(direction, normal) * 2)

export const vec2Project = (out: Vec2Out, a: Vec2In, b: Vec2In) =>
  vec2ScalarMultiply(out, vec2Dot(a, b) / vec2Length(b), a)

export const vec2Direction = (out: Vec2Out, a: Vec2In, b: Vec2In) => vec2Normalize(vec2Subtract(out, b, a))

export const vec2Slide = (out: Vec2Out, a: Vec2In, normal: Vec2In) => vec2AddScale(out, a, normal, -vec2Dot(a, normal))

export const vec2Lerp = (out: Vec2Out, a: Vec2In, b: Vec2In, t: number) =>
  vec2Set(out, lerp(a.x, b.x, t), lerp(a.y, b.y, t))

export const vec2SmoothStep = (out: Vec2Out, a: Vec2In, b: Vec2In, t: number) =>
  vec2Set(out, smoothStep(a.x, b.x, t), smoothStep(a.y, b.y, t))

export const vec2InverseLerp = (out: Vec2Out, a: Vec2In, b: Vec2In, t: number) =>
  vec2Set(out, inverseLerp(a.x, b.x, t), inverseLerp(a.y, b.y, t))

export const vec2Snap = (out: Vec2Out, a: Vec2In, step: Vec2In) =>
  vec2Set(out, scalarSnap(a.x, step.x), scalarSnap(a.y, step.y))

export const vec2SnapScalar = (out: Vec2Out, a: Vec2In, step: number) =>
  vec2Set(out, scalarSnap(a.x, step), scalarSnap(a.y, step))

export const vec2Hermite = (out: Vec2Out, a: Vec2In, b: Vec2In, c: Vec2In, d: Vec2In, t: number) => {
  const t2 = t * t
  const factor1 = t2 * (2 * t - 3) + 1
  const factor2 = t2 * (t - 2) + t
  const factor3 = t2 * (t - 1)
  const factor4 = t2 * (3 - 2 * t)
  vec2Set(
    out,
    a.x * factor1 + b.x * factor2 + c.x * factor3 + d.x * factor4,
    a.y * factor1 + b.y * factor2 + c.y * factor3 + d.y * factor4
  )
}

export const vec2Bezier = (out: Vec2Out, a: Vec2In, b: Vec2In, c: Vec2In, d: Vec2In, t: number) => {
  const inverseFactor = 1 - t
  const inverseFactorTimesTwo = inverseFactor * inverseFactor
  const factorTimes2 = t * t
  const factor1 = inverseFactorTimesTwo * inverseFactor
  const factor2 = 3 * t * inverseFactorTimesTwo
  const factor3 = 3 * factorTimes2 * inverseFactor
  const factor4 = factorTimes2 * t
  vec2Set(
    out,
    a.x * factor1 + b.x * factor2 + c.x * factor3 + d.x * factor4,
    a.y * factor1 + b.y * factor2 + c.y * factor3 + d.y * factor4
  )
}

export const vec2Cross = (a: Vec2In, b: Vec2In): number => a.x * b.y - a.y * b.x
