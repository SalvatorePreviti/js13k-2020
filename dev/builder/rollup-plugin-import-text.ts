import { Plugin } from 'rollup'
import { resolveAssetText } from './builder-utils'

export const createRollupPluginImportText = (extensions: string[]): Plugin => {
  return {
    name: `rollupPluginImportText[${extensions.join(',')}]`,
    async load(id) {
      for (const ext of extensions) {
        if (id.endsWith(ext)) {
          const text = await resolveAssetText(id, 0)
          return `export default ${JSON.stringify(text)};\n`
        }
      }
      return undefined
    }
  }
}
