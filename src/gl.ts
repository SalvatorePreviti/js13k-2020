import { canvasElement } from './canvas'
import { debug_checkShaderProgramLinkStatus, debug_reportClear, debug_checkShaderCompileStatus } from './debug'

export const gl = canvasElement.getContext('webgl2', {
  /** Boolean that indicates if the canvas contains an alpha buffer. */
  alpha: false,
  /** Boolean that hints the user agent to reduce the latency by desynchronizing the canvas paint cycle from the event loop */
  desynchronized: true,
  /** Boolean that indicates whether or not to perform anti-aliasing. */
  antialias: false,
  /** Boolean that indicates that the drawing buffer has a depth buffer of at least 16 bits. */
  depth: false,
  /** Boolean that indicates if a context will be created if the system performance is low or if no hardware GPU is available. */
  failIfMajorPerformanceCaveat: false,
  /** A hint to the user agent indicating what configuration of GPU is suitable for the WebGL context. */
  powerPreference: 'high-performance',
  /** If the value is true the buffers will not be cleared and will preserve their values until cleared or overwritten. */
  preserveDrawingBuffer: false,
  /** Boolean that indicates that the drawing buffer has a stencil buffer of at least 8 bits. */
  stencil: false
})

export const glDrawFullScreenTriangle = () => {
  gl.drawArrays(gl.TRIANGLES, 0, 3)
}

export const loadShaderCode = (program: WebGLProgram, type: number, sourceCode: string, name: string) => {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, sourceCode)
  gl.compileShader(shader)

  debug_checkShaderCompileStatus(gl, shader, {
    title: type === gl.VERTEX_SHADER ? 'vertex shader' : 'fragment shader',
    context: `compile-shader-${name}`,
    file: import.meta.url
  })

  gl.attachShader(program, shader)
  return shader
}

export const loadShaderProgram = (vertexSourceCode: string, fragmentSourceCode: string, name: string): WebGLProgram => {
  // A new program

  const result = gl.createProgram()

  debug_reportClear(`compile-shader-${name}`, import.meta.url)

  // Compile vertex and pixel shader

  const vertexShader = loadShaderCode(result, gl.VERTEX_SHADER, vertexSourceCode, name)
  const fragmentShader = loadShaderCode(result, gl.FRAGMENT_SHADER, fragmentSourceCode, name)

  // Link them together

  gl.linkProgram(result)

  debug_checkShaderProgramLinkStatus(gl, result, {
    title: 'shader program',
    context: `compile-shader-${name}`,
    file: import.meta.url
  })

  // Activate the program

  gl.useProgram(result)

  // We don't need the shaders anymore, let's free some memory

  gl.deleteShader(vertexShader)
  gl.deleteShader(fragmentShader)

  return result
}
