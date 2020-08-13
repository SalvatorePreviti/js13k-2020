import type { OptionsOutput as CleanCssOptions } from 'clean-css'
import type { MinifyOptions, CompressOptions } from 'csso'

export type CssoOptions = MinifyOptions & CompressOptions

export { CleanCssOptions }

export const cleanCssOptions: CleanCssOptions = {
  compatibility: '*',
  inline: ['all'],
  level: 2,
  rebase: false
}

export const cssoOptions: CssoOptions = {
  forceMediaMerge: true,
  restructure: true,
  comments: false
}
