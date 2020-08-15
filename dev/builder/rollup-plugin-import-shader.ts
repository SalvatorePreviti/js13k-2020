import { Plugin } from 'rollup'
import { resolveAssetText } from './builder-utils'

export const createRollupPluginImportShader = (extensions: string[]): Plugin => {
  return {
    name: `rollupPluginImportShader[${extensions.join(',')}]`,
    async load(id) {
      for (const ext of extensions) {
        if (id.endsWith(ext)) {
          const text = await resolveAssetText(id, 0)
          return `export const code = ${JSON.stringify(compressShader(text))};\n`
        }
      }
      return undefined
    }
  }
}

function compressShader(source: string): string {
  // from https://github.com/vwochnik/rollup-plugin-glsl/blob/master/index.js
  let needNewline = false
  return source
    .replace(/\\(?:\r\n|\n\r|\n|\r)|\/\*.*?\*\/|\/\/(?:\\(?:\r\n|\n\r|\n|\r)|[^\n\r])*/g, '')
    .split(/\n+/)
    .reduce((result, line) => {
      line = line.trim().replace(/\s{2,}|\t/, ' ')
      if (line[0] === '#') {
        if (needNewline) {
          result.push('\n')
        }

        result.push(line, '\n')
        needNewline = false
      } else {
        result.push(line.replace(/\s*({|}|=|\*|,|\+|\/|>|<|&|\||\[|\]|\(|\)|-|!|;)\s*/g, '$1'))
        needNewline = true
      }
      return result
    }, [])
    .join('')
    .replace(/\n+/g, '\n')
}
