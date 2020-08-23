type int = number
type byte = number
type float = number

interface Vec2 {
  x: float
  y: float
}

type Vec2In = Readonly<Vec2>
type Vec2Out = Vec2

interface Vec3 {
  x: float
  y: float
  z: float
}

type Vec3In = Readonly<Vec3>
type Vec3Out = Vec3

interface Vec4 {
  x: float
  y: float
  z: float
  w: float
}

type Vec4In = Readonly<Vec3>
type Vec4Out = Vec4

type Mat3 = Float32Array
type Mat3In = Float32Array
type Mat3Out = Float32Array

type Mat4 = Float32Array
type Mat4In = Float32Array
type Mat4Out = Float32Array

type OmitFirstArg<F> = F extends (x: any, ...args: infer P) => infer R ? (...args: P) => R : never
