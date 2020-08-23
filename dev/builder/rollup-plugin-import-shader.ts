import { Plugin } from 'rollup'
import { resolveAssetText } from './builder-utils'
import path from 'path'

import { spglslAngleCompile } from 'spglsl'
import { devBeginOperation, devEndOperation } from '../lib/dev-utils'

export const createRollupPluginImportShader = (extensions: string[]): Plugin => {
  return {
    name: `rollupPluginImportShader[${extensions.join(',')}]`,
    async load(id) {
      for (const ext of extensions) {
        if (id.endsWith(ext)) {
          const text = await resolveAssetText(id, 0)
          return `export const code = ${JSON.stringify(await compressShader(text, id))};\n`
        }
      }
      return undefined
    }
  }
}

async function compressShader(source: string, filePath: string): Promise<string> {
  const endOp = devBeginOperation(`spglsl ${path.basename(filePath)}`, undefined, true)

  const spglslResult = await spglslAngleCompile({
    compileMode: 'Optimize',
    mainFilePath: filePath,
    mainSourceCode: source,
    minify: true
  })

  if (!spglslResult.valid) {
    const error = new Error('glsl compilation failed') as any
    error.infoLog = spglslResult.infoLog
    error.filePath = filePath
    throw error
  }

  endOp(spglslResult.infoLog.inspect())

  return spglslResult.output
}
