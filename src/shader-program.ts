import { loadShaderProgram, glNewUniformLocationGetter } from './gl-utils'

import { code as vertexShaderCode } from './shaders/vertex.vert'
import { code as fragmentShaderCode } from './shaders/fragment.frag'
import { debug_time, debug_timeEnd, debug_mode } from './debug'
import { gl_deleteProgram, gl_uniform1i, gl_useProgram } from './gl_context'

const _loadMainShaderProgram = (mainFunction: string) => {
  debug_time(`${_loadMainShaderProgram.name} ${mainFunction}`)

  const program = loadShaderProgram(
    vertexShaderCode,
    fragmentShaderCode.replace('\n', `\n#define ${mainFunction} main\n${debug_mode ? '#line 2 0\n' : ''}`),
    mainFunction
  )

  const uniforms = glNewUniformLocationGetter(program)
  gl_uniform1i(uniforms.iHeightmap, 0)
  gl_uniform1i(uniforms.iNoise, 1)

  const result = {
    _program: program,
    _use() {
      gl_useProgram(program)
    },

    _iResolution: uniforms.iResolution,
    _iTime: uniforms.iTime,
    _iCameraPos: uniforms.iCameraPos,
    _iCameraDir: uniforms.iCameraDir,
    _iCameraEuler: uniforms.iCameraEuler,
    _iCameraMat3: uniforms.iCameraMat3,

    _iGOKeyVisible: uniforms.iGOKeyVisible,
    _iAnimPrisonDoor: uniforms.iAnimPrisonDoor
  }

  debug_timeEnd(`${_loadMainShaderProgram.name} ${mainFunction}`)
  return result
}

export type MainShaderProgram = ReturnType<typeof _loadMainShaderProgram>

export let mainShader: MainShaderProgram

export let collisionShader: MainShaderProgram

export const loadMainShader = () => {
  if (debug_mode && mainShader) {
    gl_deleteProgram(mainShader._program)
  }

  mainShader = _loadMainShaderProgram('main_')
  collisionShader = _loadMainShaderProgram('main_coll')
}
