import {
  updateGraph,
  updateGraphInfo,
  updateCameraPosition,
  updateCameraDirection,
  updateCameraEulerAngles
} from './_debug-info'
import { max } from '../math/scalar'

export {
  debug_reportClear,
  debug_report,
  debug_trycatch,
  debug_trycatch_wrap,
  debug_checkShaderCompileStatus,
  debug_checkShaderProgramLinkStatus
} from './_debug-report'

/** Prints debug information. Call to debug_log will disappear in release mode. */
export const debug_log = console.log.bind(console)

/** Console.time, only for development mode */
export const debug_time = (f: string | Function) => {
  console.time(typeof f === 'function' ? f.name : f)
}

/** Console.timeEnd, only for development mode */
export const debug_timeEnd = (f: string | Function) => {
  console.timeEnd(typeof f === 'function' ? f.name : f)
}

debug_log('debug mode activated')

let _msTime = performance.now()
let _fpsFrames = 0
let _fpsTime = _msTime
let _msDisplayTime = _msTime
let _durationMs = 0
let _renderTimeStart = 0
let _renderTimeMs = 0

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
export function debug_beginTime() {
  const time = performance.now()
  _renderTimeStart = time

  ++_fpsFrames
}

export function debug_endTime(timeInSeconds?: number) {
  const time = performance.now()
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
    updateGraph(2, 30, _renderTimeMs, _renderTimeMs.toFixed(2))
    _renderTimeMs = 0
  }

  updateGraphInfo(timeInSeconds)

  _durationMs = max(_durationMs, time - _msTime)
  _renderTimeMs = max(_renderTimeMs, time - _renderTimeStart)
  _msTime = time
}

export const debug_updateCameraPosition = updateCameraPosition

export const debug_updateCameraDirection = updateCameraDirection

export const debug_updateCameraEulerAngles = updateCameraEulerAngles
