export const { isArray, from: arrayFrom, of: arrayOf } = Array

export type TypedArray =
  | Uint8Array
  | Int8Array
  | Uint16Array
  | Int16Array
  | Uint32Array
  | Int32Array
  | Float32Array
  | Float64Array
  | Uint8ClampedArray

export const typedArraySet = (array: TypedArray, ...values: number[]) => array.set(values)
