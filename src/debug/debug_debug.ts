import { updateGraph } from './debug-info'

/** Prints debug information. Call to debug_log will disappear in release mode. */
export const debug_log = console.info.bind(console)

debug_log('debug mode activated')

let _msTime = performance.now()
let _fpsFrames = 0
let _fpsTime = _msTime
let _msDisplayTime = _msTime
let _durationMs = 0

/**
 * Executes a function. This call and the called function will disappear in release mode.
 * @param fn The function to execute.
 */
function debug_exec(fn: () => void): void
function debug_exec(fn: () => Promise<any>): Promise<void>
function debug_exec(fn: () => void | Promise<any>): void | Promise<void> {
  return fn()
}

export { debug_exec }

/** Update graphs and the debug info. Call to this function will disappear in release mode. */
export function debug_updateInfo() {
  const time = performance.now()

  ++_fpsFrames

  if (time >= _fpsTime + 1000) {
    const fps = (_fpsFrames * 1000) / (time - _fpsTime)
    updateGraph(0, 65, fps, fps.toFixed(1))
    _fpsTime = time
    _fpsFrames = 0
  }

  if (time >= _msDisplayTime + 90) {
    _msDisplayTime = time
    updateGraph(1, 200, _durationMs, _durationMs.toFixed(2))
    _durationMs = 0
  }

  _durationMs = Math.max(_durationMs, time - _msTime)

  _msTime = time
}
