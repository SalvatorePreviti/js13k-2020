// Magic debug file, will be used during build mode.
// Most of this code will be optimized away in any case by magic release build steps.
// In developmen mode, _debug/_debug.ts will be used instead.

export interface DebugReportInfo {
  context?: string
  file?: string
  rethrow?: boolean
  title?: string
}

/** Oh well, console.log, only for development mode */
export const debug_log = (..._args: any): void => undefined

/** Executes a piece of code only when running in development mode in the browser */
export const debug_exec = <T>(_fn: () => T): void => undefined

/** Updates the debug info HUD, must be called every frame */
export const debug_updateInfo = (_timeInSeconds?: number): void => undefined

/** Shows a message on screen */
export const debug_report = (
  _kind: 'error' | 'warn' | 'warning' | 'info',
  _message: string | Error,
  _info?: DebugReportInfo | string
): void => undefined

/** Clears all the previous messages reported on screen */
export const debug_reportClear = (_context?: string, _file?: string): void => undefined

/** Executes a block in a try catch, eat the error and report it to screen. Exception will be eaten if rethrow is false (default). */
export const debug_trycatch = <T>(fn: () => T, _info?: DebugReportInfo | string): T => fn()

/** Wraps a function with a debug_trycatch. Exception will be eaten. */
export const debug_trycatch_wrap = <F extends Function>(fn: F, _info?: DebugReportInfo | string): F => fn

export const debug_checkShaderCompileStatus = (
  _gl: WebGL2RenderingContext,
  _shader: WebGLShader,
  _info: DebugReportInfo
): void => undefined

export const debug_checkShaderProgramLinkStatus = (
  _gl: WebGL2RenderingContext,
  _shaderProgram: WebGLProgram,
  _info: DebugReportInfo
): void => undefined

export const debug_updateCameraPosition = (_position: Readonly<Vec3>) => {}

export const debug_updateCameraDirection = (_direction: Readonly<Vec3>) => {}

export const debug_updateCameraEulerAngles = (_eulerAngles: Readonly<Vec2>) => {}
