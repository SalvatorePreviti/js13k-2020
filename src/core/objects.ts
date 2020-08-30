export const functionBind = /*@__PURE__*/ <F extends Function>(self: any, f: F): F => /*@__PURE__*/ f.bind(self)

export const {
  assign: objectAssign,
  getOwnPropertyDescriptor: objectGetOwnPropertyDescriptor,
  getOwnPropertyDescriptors: objectGetOwnPropertyDescriptors,
  getOwnPropertyNames: objectGetOwnPropertyNames,
  getOwnPropertySymbols: objectGetOwnPropertySymbols,
  is: objectIs,
  preventExtensions: objectPreventExtensions,
  seal: objectSeal,
  create: objectCreate,
  defineProperties: objectDefineProperties,
  defineProperty: objectDefineProperty,
  freeze: objectFreeze,
  getPrototypeOf: objectGetPrototypeOf,
  setPrototypeOf: objectSetPrototypeOf,
  isExtensible: objectIsExtensible,
  isFrozen: objectIsFrozen,
  isSealed: objectIsSealed,
  keys: objectKeys,
  entries: objectEntries,
  fromEntries: objectFromEntries,
  values: objectValues
} = Object

export const {
  defineProperty: reflectDefineProperty,
  deleteProperty: reflectDeleteProperty,
  apply: reflectApply,
  construct: reflectConstruct,
  get: reflectGet,
  getOwnPropertyDescriptor: reflectGetOwnPropertyDescriptor,
  getPrototypeOf: reflectGetPrototypeOf,
  has: reflectHas,
  isExtensible: reflectIsExtensible,
  ownKeys: reflectOwnKeys,
  preventExtensions: reflectPreventExtensions,
  set: reflectSet,
  setPrototypeOf: reflectSetPrototypeOf
} = Reflect

export const newProxyGetter = <R, T extends object>(
  getter: (name: string) => R,
  target: T = {} as any
): T & Record<string, R> => new Proxy(target, { get: (_, name) => getter(name as string) }) as any

export const newProxyBinder = <T extends object>(instance: T) =>
  newProxyGetter((name) => functionBind(instance, instance[name]), instance)
