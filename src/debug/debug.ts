// Release version of debug.ts - façade to _debug_debug.ts when running in browser

export const debug_log = (..._args: any): void => {}

export const debug_exec = <T>(_fn: () => T) => {}

export const debug_updateInfo = () => {}
