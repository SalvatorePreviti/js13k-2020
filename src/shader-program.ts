import { gl, loadShaderProgram } from './gl'

import { code as vertexShaderCode } from './shaders/vertex.vert'
import { code as fragmentShaderCode } from './shaders/fragment.frag'
import { debug_exec } from './debug'

export let shaderProgram: WebGLProgram

export let shaderProgram_iResolution: WebGLUniformLocation

export let shaderProgram_iTime: WebGLUniformLocation

export let shaderProgram_iFrame: WebGLUniformLocation

export let shaderProgram_iMouse: WebGLUniformLocation

export let shaderProgram_iCameraPos: WebGLUniformLocation

export let shaderProgram_iCameraDir: WebGLUniformLocation

export let shaderProgram_iCameraEuler: WebGLUniformLocation

export let shaderProgram_iCameraMat3: WebGLUniformLocation

export const loadMainShaderProgram = () => {
  // A new program

  debug_exec(() => {
    if (shaderProgram) {
      gl.deleteProgram(shaderProgram)
    }
  })

  shaderProgram = loadShaderProgram(vertexShaderCode, fragmentShaderCode, 'main')

  // Loads uniforms

  const getUniformLocation = (name: string) => gl.getUniformLocation(shaderProgram, name)

  shaderProgram_iResolution = getUniformLocation('iResolution')
  shaderProgram_iTime = getUniformLocation('iTime')
  shaderProgram_iFrame = getUniformLocation('iFrame')
  shaderProgram_iCameraPos = getUniformLocation('iCameraPos')
  shaderProgram_iCameraDir = getUniformLocation('iCameraDir')
  shaderProgram_iCameraEuler = getUniformLocation('iCameraEuler')
  shaderProgram_iCameraMat3 = getUniformLocation('iCameraMat3')

  return shaderProgram
}
