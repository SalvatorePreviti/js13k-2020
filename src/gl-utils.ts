import { debug_checkShaderProgramLinkStatus, debug_reportClear, debug_checkShaderCompileStatus } from './debug'
import {
  GL_TRIANGLES,
  GL_VERTEX_SHADER,
  GL_FRAGMENT_SHADER,
  GL_TEXTURE_2D,
  GL_CLAMP_TO_EDGE,
  GL_LINEAR,
  GL_TEXTURE_MAG_FILTER,
  GL_TEXTURE_MIN_FILTER,
  GL_TEXTURE_WRAP_T,
  GL_TEXTURE_WRAP_S
} from './core/gl-constants'
import {
  gl_drawArrays,
  gl_createShader,
  gl_shaderSource,
  gl_compileShader,
  gl_attachShader,
  gl_createProgram,
  gl_linkProgram,
  gl_useProgram,
  gl_deleteShader,
  gl_texParameteri,
  gl_context,
  gl_getUniformLocation
} from './gl_context'

import { newProxyGetter } from './core/objects'

export const glDrawFullScreenTriangle = () => {
  gl_drawArrays(GL_TRIANGLES, 0, 3)
}

export const loadShaderCode = (program: WebGLProgram, type: number, sourceCode: string, name: string) => {
  const shader = gl_createShader(type)
  gl_shaderSource(shader, sourceCode)
  gl_compileShader(shader)

  debug_checkShaderCompileStatus(gl_context, shader, {
    title: type === GL_VERTEX_SHADER ? 'vertex shader' : 'fragment shader',
    context: `compile-shader-${name}`,
    file: import.meta.url
  })

  gl_attachShader(program, shader)
  return shader
}

export const loadShaderProgram = (vertexSourceCode: string, fragmentSourceCode: string, name: string): WebGLProgram => {
  // A new program

  const result = gl_createProgram()

  debug_reportClear(`compile-shader-${name}`, import.meta.url)

  // Compile vertex and pixel shader

  const vertexShader = loadShaderCode(result, GL_VERTEX_SHADER, vertexSourceCode, name)
  const fragmentShader = loadShaderCode(result, GL_FRAGMENT_SHADER, fragmentSourceCode, name)

  // Link them together

  gl_linkProgram(result)

  debug_checkShaderProgramLinkStatus(gl_context, result, {
    title: 'shader program',
    context: `compile-shader-${name}`,
    file: import.meta.url
  })

  // Activate the program

  gl_useProgram(result)

  // We don't need the shaders anymore, let's free some memory

  gl_deleteShader(vertexShader)
  gl_deleteShader(fragmentShader)

  return result
}

export const glSetTextureLinearSampling = (target = GL_TEXTURE_2D) => {
  gl_texParameteri(target, GL_TEXTURE_WRAP_S, GL_CLAMP_TO_EDGE)
  gl_texParameteri(target, GL_TEXTURE_WRAP_T, GL_CLAMP_TO_EDGE)
  gl_texParameteri(target, GL_TEXTURE_MIN_FILTER, GL_LINEAR)
  gl_texParameteri(target, GL_TEXTURE_MAG_FILTER, GL_LINEAR)
}

export const glNewUniformLocationGetter = (program: WebGLProgram) =>
  newProxyGetter((name) => gl_getUniformLocation(program, name))

/*export const glUniformWriter = <F extends GLUniformFunction>(
  program: WebGLProgram,
  name: string,
  type: F
): OmitFirstArg<F> => {
  const loation = gl_getUniformLocation(program, name)
  return ()
}*/

//

//export const glUniformWriter_1f = (shader: )

/*
uniform1f(location: WebGLUniformLocation | null, x: GLfloat): void;
uniform1i(location: WebGLUniformLocation | null, x: GLint): void;
uniform2f(location: WebGLUniformLocation | null, x: GLfloat, y: GLfloat): void;
uniform2i(location: WebGLUniformLocation | null, x: GLint, y: GLint): void;
uniform3f(location: WebGLUniformLocation | null, x: GLfloat, y: GLfloat, z: GLfloat): void;
uniform3i(location: WebGLUniformLocation | null, x: GLint, y: GLint, z: GLint): void;
uniform4f(location: WebGLUniformLocation | null, x: GLfloat, y: GLfloat, z: GLfloat, w: GLfloat): void;
uniform4i(location: WebGLUniformLocation | null, x: GLint, y: GLint, z: GLint, w: GLint): void;
uniform1fv(location: WebGLUniformLocation | null, data: Float32List, srcOffset?: GLuint, srcLength?: GLuint): void;
uniform1iv(location: WebGLUniformLocation | null, data: Int32List, srcOffset?: GLuint, srcLength?: GLuint): void;
uniform2fv(location: WebGLUniformLocation | null, data: Float32List, srcOffset?: GLuint, srcLength?: GLuint): void;
uniform2iv(location: WebGLUniformLocation | null, data: Int32List, srcOffset?: GLuint, srcLength?: GLuint): void;
uniform3fv(location: WebGLUniformLocation | null, data: Float32List, srcOffset?: GLuint, srcLength?: GLuint): void;
uniform3iv(location: WebGLUniformLocation | null, data: Int32List, srcOffset?: GLuint, srcLength?: GLuint): void;
uniform4fv(location: WebGLUniformLocation | null, data: Float32List, srcOffset?: GLuint, srcLength?: GLuint): void;
uniform4iv(location: WebGLUniformLocation | null, data: Int32List, srcOffset?: GLuint, srcLength?: GLuint): void;
uniformMatrix2fv(location: WebGLUniformLocation | null, transpose: GLboolean, data: Float32List, srcOffset?: GLuint, srcLength?: GLuint): void;
uniformMatrix3fv(location: WebGLUniformLocation | null, transpose: GLboolean, data: Float32List, srcOffset?: GLuint, srcLength?: GLuint): void;
uniformMatrix4fv(location: WebGLUniformLocation | null, transpose: GLboolean, data: Float32List, srcOffset?: GLuint, srcLength?: GLuint): void;
uniform1ui(location: WebGLUniformLocation | null, v0: GLuint): void;
uniform1uiv(location: WebGLUniformLocation | null, data: Uint32List, srcOffset?: GLuint, srcLength?: GLuint): void;
uniform2ui(location: WebGLUniformLocation | null, v0: GLuint, v1: GLuint): void;
uniform2uiv(location: WebGLUniformLocation | null, data: Uint32List, srcOffset?: GLuint, srcLength?: GLuint): void;
uniform3ui(location: WebGLUniformLocation | null, v0: GLuint, v1: GLuint, v2: GLuint): void;
uniform3uiv(location: WebGLUniformLocation | null, data: Uint32List, srcOffset?: GLuint, srcLength?: GLuint): void;
uniform4ui(location: WebGLUniformLocation | null, v0: GLuint, v1: GLuint, v2: GLuint, v3: GLuint): void;
uniform4uiv(location: WebGLUniformLocation | null, data: Uint32List, srcOffset?: GLuint, srcLength?: GLuint): void;
uniformBlockBinding(program: WebGLProgram, uniformBlockIndex: GLuint, uniformBlockBinding: GLuint): void;
uniformMatrix2x3fv(location: WebGLUniformLocation | null, transpose: GLboolean, data: Float32List, srcOffset?: GLuint, srcLength?: GLuint): void;
uniformMatrix2x4fv(location: WebGLUniformLocation | null, transpose: GLboolean, data: Float32List, srcOffset?: GLuint, srcLength?: GLuint): void;
uniformMatrix3x2fv(location: WebGLUniformLocation | null, transpose: GLboolean, data: Float32List, srcOffset?: GLuint, srcLength?: GLuint): void;
uniformMatrix3x4fv(location: WebGLUniformLocation | null, transpose: GLboolean, data: Float32List, srcOffset?: GLuint, srcLength?: GLuint): void;
uniformMatrix4x2fv(location: WebGLUniformLocation | null, transpose: GLboolean, data: Float32List, srcOffset?: GLuint, srcLength?: GLuint): void;
uniformMatrix4x3fv(location: WebGLUniformLocation | null, transpose: GLboolean, data: Float32List, srcOffset?: GLuint, srcLength?: GLuint): void;*/

/*

for (const key of Object.getOwnPropertyNames(Object.getPrototypeOf(gl))) {
  /*if (key.startsWith('uniform')) {
    console.log(key)
  }
  let s = ''
  if (typeof gl[key] === 'function') {
    s += `export const gl_${key} = gl.${key}.bind(gl)\n`
  }
}

const funcso = []
for (const key of Object.getOwnPropertyNames(Object)) {
  if (typeof Object[key] === 'function') {
    funcso.push(`${key}: object${key.charAt(0).toUpperCase()}${key.slice(1)}`)
  }
}

const funcsr = []
for (const key of Object.getOwnPropertyNames(Array)) {
  if (typeof Array[key] === 'function') {
    funcsr.push(`${key}: reflect${key.charAt(0).toUpperCase()}${key.slice(1)}`)
  }
}

console.log(JSON.stringify(funcso.join(',')))
console.log(JSON.stringify(funcsr.join(',')))

export const gl_uniform1ui,
export const gl_uniform1uiv,
export const gl_uniform2ui,
export const gl_uniform2uiv,
export const gl_uniform3ui,
export const gl_uniform3uiv,
export const gl_uniform4ui,
export const gl_uniform4uiv,
export const gl_uniformMatrix2x3fv,
export const gl_uniformMatrix2x4fv,
export const gl_uniformMatrix3x2fv,
export const gl_uniformMatrix3x4fv,
export const gl_uniformMatrix4x2fv,
export const gl_uniformMatrix4x3fv,
export const gl_uniform1fv,
export const gl_uniform1iv,
export const gl_uniform2fv,
export const gl_uniform2iv,
export const gl_uniform3fv,
export const gl_uniform3iv,
export const gl_uniform4fv,
export const gl_uniform4iv,
export const gl_uniformMatrix2fv,
export const gl_uniformMatrix3fv,
export const gl_uniformMatrix4fv,
export const gl_uniform1f ,
export const gl_uniform1i ,
export const gl_uniform2f ,
export const gl_uniform2i ,
export const gl_uniform3f ,
export const gl_uniform3i ,
export const gl_uniform4f ,
export const gl_uniform4i ,
export const gl_uniform1fv ,
gl_uniform1iv ,
gl_uniform2fv,
gl_uniform2iv,
gl_uniform3fv,
gl_uniform3iv,
gl_uniform4fv,
gl_uniform4iv,
gl_uniformMatrix2fv,
gl_uniformMatrix3fv,
gl_uniformMatrix4fv,


export type UniformWriterType = 
uniform1f(x: GLfloat): void |
uniform1i( x: GLint): void |
uniform2f( x: GLfloat, y: GLfloat): void |
uniform2i( x: GLint, y: GLint): void |
uniform3f( x: GLfloat, y: GLfloat, z: GLfloat): void |
uniform3i( x: GLint, y: GLint, z: GLint): void |
uniform4f( x: GLfloat, y: GLfloat, z: GLfloat, w: GLfloat): void |
uniform4i(x: GLint, y: GLint, z: GLint, w: GLint): void |

export const glUniformWriter = (uniformName: string, uniformType: UniformWriterType): */
