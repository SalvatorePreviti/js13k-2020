// Release version of debug.ts - façade to debug_debug.ts

export const debug_log = (..._args: any): void => {}

export const debug_exec = <T>(_fn: () => T) => {}

export const debug_updateInfo = () => {}
