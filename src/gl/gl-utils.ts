import {
  GL_TEXTURE_2D,
  GL_LINEAR,
  GL_TEXTURE_MAG_FILTER,
  GL_TEXTURE_MIN_FILTER,
  GL_TEXTURE_WRAP_T,
  GL_TEXTURE_WRAP_S,
  GL_REPEAT
} from './gl-constants'
import { gl } from '../page'

export const glSetTextureSampling = (wrap: number = GL_REPEAT, minFilter = GL_LINEAR, magFilter = minFilter) => {
  gl.texParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, wrap)
  gl.texParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, wrap)
  gl.texParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, minFilter)
  gl.texParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, magFilter)
}
