import { Plugin } from 'rollup'
import { resolveAssetText } from './builder-utils'
import path from 'path'

import { spglslAngleCompile } from 'spglsl'
import { devBeginOperation, prettyFileSize } from '../lib/dev-utils'
import chalk from 'chalk'

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
    minify: true,

    // sometime this to true gives better results after compression, sometime not.
    mangleTwoPasses: false
  })

  if (!spglslResult.valid) {
    const error = new Error('glsl compilation failed') as any
    Object.defineProperty(error, 'infoLog', {
      value: spglslResult.infoLog,
      configurable: true,
      enumerable: false,
      writable: true
    })
    error.filePath = filePath
    if (spglslResult.infoLog.hasErrors()) {
      Object.defineProperty(error, 'stack', {
        value: spglslResult.infoLog.inspect(),
        configurable: true,
        enumerable: true,
        writable: true
      })
    }
    throw error
  }

  endOp(
    `\n   ${chalk.blueBright('before')} ${`${prettyFileSize(source.length)}\n   ${chalk.blueBright(
      'after'
    )}  ${prettyFileSize((spglslResult.output || '').length)}`}\n   ${spglslResult.infoLog.inspect()}`
  )

  return spglslResult.output
}
