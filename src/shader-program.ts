import { loadShaderProgram } from './gl-utils'

import { code as vertexShaderCode } from './shaders/vertex.vert'
import { code as fragmentShaderCode } from './shaders/fragment.frag'
import { debug_exec, debug_time, debug_timeEnd } from './debug'
import { gl_deleteProgram, gl_getUniformLocation } from './gl_context'

export let shaderProgram: WebGLProgram

export let shaderProgram_iResolution: WebGLUniformLocation

export let shaderProgram_iTime: WebGLUniformLocation

export let shaderProgram_iFrame: WebGLUniformLocation

export let shaderProgram_iMouse: WebGLUniformLocation

export let shaderProgram_iCameraPos: WebGLUniformLocation

export let shaderProgram_iCameraDir: WebGLUniformLocation

export let shaderProgram_iCameraEuler: WebGLUniformLocation

export let shaderProgram_iCameraMat3: WebGLUniformLocation

export let shaderProgram_iHeightmap: WebGLUniformLocation

export let shaderProgram_iNoise: WebGLUniformLocation

/*const loadUniforms = () => {


function Uniform(value: number) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log('Uniform', value, target, propertyKey, descriptor)
  }
}

  shaderProgram_iResolution = getUniformLocation('iResolution')
  shaderProgram_iTime = getUniformLocation('iTime')
  shaderProgram_iFrame = getUniformLocation('iFrame')
  shaderProgram_iCameraPos = getUniformLocation('iCameraPos')
  shaderProgram_iCameraDir = getUniformLocation('iCameraDir')
  shaderProgram_iCameraEuler = getUniformLocation('iCameraEuler')
  shaderProgram_iCameraMat3 = getUniformLocation('iCameraMat3')

  shaderProgram_iHeightmap = getUniformLocation('iHeightmap')
  shaderProgram_iNoise = getUniformLocation('iNoise')

  return {
    $iResolution
  }
}*/

export const loadMainShaderProgram = () => {
  debug_time(loadMainShaderProgram)
  // A new program

  debug_exec(() => {
    if (shaderProgram) {
      gl_deleteProgram(shaderProgram)
    }
  })

  shaderProgram = loadShaderProgram(vertexShaderCode, fragmentShaderCode, 'main')

  // Loads uniforms

  const getUniformLocation = (name: string) => gl_getUniformLocation(shaderProgram, name)

  shaderProgram_iResolution = getUniformLocation('iResolution')
  shaderProgram_iTime = getUniformLocation('iTime')
  shaderProgram_iFrame = getUniformLocation('iFrame')
  shaderProgram_iCameraPos = getUniformLocation('iCameraPos')
  shaderProgram_iCameraDir = getUniformLocation('iCameraDir')
  shaderProgram_iCameraEuler = getUniformLocation('iCameraEuler')
  shaderProgram_iCameraMat3 = getUniformLocation('iCameraMat3')

  shaderProgram_iHeightmap = getUniformLocation('iHeightmap')
  shaderProgram_iNoise = getUniformLocation('iNoise')

  debug_timeEnd(loadMainShaderProgram)

  return shaderProgram
}
