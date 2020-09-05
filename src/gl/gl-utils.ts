import {
  GL_TRIANGLES,
  GL_TEXTURE_2D,
  GL_LINEAR,
  GL_TEXTURE_MAG_FILTER,
  GL_TEXTURE_MIN_FILTER,
  GL_TEXTURE_WRAP_T,
  GL_TEXTURE_WRAP_S,
  GL_REPEAT
} from './gl-constants'
import { gl_drawArrays, gl_texParameteri } from './gl-context'

export const glDrawFullScreenTriangle = () => {
  gl_drawArrays(GL_TRIANGLES, 0, 3)
}

export const glSetTextureSampling = (wrap: number = GL_REPEAT, filter = GL_LINEAR) => {
  gl_texParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, wrap)
  gl_texParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, wrap)
  gl_texParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, filter)
  gl_texParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, filter)
}
