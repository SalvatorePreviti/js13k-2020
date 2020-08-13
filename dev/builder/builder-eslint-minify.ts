import { ESLint } from 'eslint'
import { ESLintMinifyOptions } from '../config/eslint-minify-options'

/**
 * What? ESLint to minify stuff? Oh well, yes, why not!
 * Validate, standardise, optimize code and remove some redundant stuff.
 */
export async function builderEslintMinify(code: string, options: ESLintMinifyOptions): Promise<string> {
  const eslint = new ESLint(options.eslintOptions)
  for (let pass = 0; pass < options.maxPasses; ++pass) {
    const results = await eslint.lintText(code)
    await ESLint.outputFixes(results)
    for (const msg of results) {
      if (msg.errorCount > 0) {
        const formatter = await eslint.loadFormatter('stylish')
        throw new Error(`ESLint minify errors: ${formatter.format(results)}`)
      }
    }
    const newCode = (results[0] && results[0].output) || code
    if (code === newCode) {
      break
    }
    code = newCode
  }
  return code
}
