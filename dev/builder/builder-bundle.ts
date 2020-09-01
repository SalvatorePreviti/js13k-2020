import csso from 'csso'
import { cssoOptions } from '../config/css-minify-options'
import { getTerserMinifyOptions } from '../config/terser-minify-options'
import { minify as terserMinify } from 'terser'
import { babelMinify } from './babel-minify'
import { builderEslintMinify } from './builder-eslint-minify'
import { getESLintMinifyOptions } from '../config/eslint-minify-options'
import { knownBrowserGlobals } from '../config/browser-globals'
import acornGlobals from 'acorn-globals'
import { getHtmlMinifierOptions } from '../config/html-minify-options'
import { minify as htmlMinify } from 'html-minifier'
import { devBeginOperation, devEndOperation, prettyFileSize } from '../lib/dev-utils'
import chalk from 'chalk'
import cheerio from 'cheerio'
import type { BuilderMainHtmlExtraction } from './builder-main-html'
import { cheerioOptions } from '../config/cheerio-options'

export async function builderBundle(input: BuilderMainHtmlExtraction, optimize: boolean): Promise<string> {
  devBeginOperation('bundle', optimize ? chalk.greenBright('<optimized>') : chalk.yellow('<unoptimized>'))

  devBeginOperation('html+css')

  let $ = cheerio.load(input.html)

  let css = input.css
  if (css) {
    if (optimize) {
      css = (csso.minify(css, cssoOptions).css || css).trim()
    }
    if (css) {
      $('head').append(`<style>${css}</style>`)
    }
  }
  let html = $.html(cheerioOptions)
  if (optimize) {
    html = htmlMinify(html, getHtmlMinifierOptions({ minifyCss: true, minifyJs: true }))
  }
  $ = cheerio.load(html, cheerioOptions)
  devEndOperation(prettyFileSize(Buffer.byteLength(html)))

  devBeginOperation('js')

  let allJs: string
  if (optimize) {
    allJs = await builderJsOptimize(input.globalJs, input.modulesJs)
  } else {
    allJs = input.globalJs
    if (allJs && !allJs.endsWith(';') && !allJs.endsWith('}')) {
      allJs += ';\n'
    }
    allJs += `function __js_load_modules__(){${input.modulesJs}}\n__js_load_modules__();`
  }

  $('body').append(`<script>${allJs}</script>`)

  html = $.html(cheerioOptions)
  if (optimize) {
    html = htmlMinify($.html(cheerioOptions), getHtmlMinifierOptions({ minifyCss: true, minifyJs: false }))
  }
  devEndOperation(prettyFileSize(Buffer.byteLength(allJs)))

  devEndOperation(prettyFileSize(Buffer.byteLength(html)))
  console.log()
  return html
}

export async function builderJsOptimize(globalJs: string, modulesJs: string) {
  devBeginOperation('minify modules')

  modulesJs = (
    await terserMinify(
      modulesJs,
      getTerserMinifyOptions({ sourceType: 'module', mangle: false, preserve_annotations: true, passes: 30 })
    )
  ).code

  devEndOperation()

  devBeginOperation('merge and mangle')

  // Merge global js with modules wrapped in an IIFE. Pass all globals as parameters to improve mangling.

  let allJs: string = globalJs
  if (allJs && !allJs.endsWith(';') && !allJs.endsWith('}')) {
    allJs += ';'
  }

  const moduleUsedGlobals = builderGetJsUsedGlobals(modulesJs, { minimumUsageCount: 2 }).join(',')
  if (moduleUsedGlobals) {
    allJs += `(({${moduleUsedGlobals}})=>{${modulesJs}})(this)`
  } else {
    allJs += `(()=>{${modulesJs}})()`
  }

  allJs = (
    await terserMinify(
      allJs,
      getTerserMinifyOptions({ sourceType: 'script', mangle: true, preserve_annotations: true, passes: 30 })
    )
  ).code
  devEndOperation()

  // Apply babel transformations

  devBeginOperation('babel minify')
  allJs = babelMinify(allJs)
  devEndOperation()

  // Runs eslint to do cleanup that may result in additional optimizations

  devBeginOperation('eslint minify')
  allJs = await builderEslintMinify(allJs, getESLintMinifyOptions({ sourceType: 'script', maxPasses: 30 }))
  devEndOperation()

  // Final terser pass

  devBeginOperation('final minification')
  allJs = (
    await terserMinify(
      allJs,
      getTerserMinifyOptions({ sourceType: 'script', mangle: true, preserve_annotations: false, passes: 30 })
    )
  ).code
  devEndOperation()

  // Remove last semicolon
  if (allJs.endsWith(';')) {
    allJs = allJs.slice(0, -1)
  }

  return allJs
}

interface BuilderGetJsUsedGlobalsSettings {
  /** Minimum number of times the variable is used. */
  minimumUsageCount: number
}

/**
 * Returns an array of used globals from a piece of javascript code.
 * @param code Javascript code
 */
function builderGetJsUsedGlobals(code: string, { minimumUsageCount }: BuilderGetJsUsedGlobalsSettings): string[] {
  const map = new Map<string, number>()
  const scope = acornGlobals(code, { allowReserved: true })
  for (const item of scope) {
    if (item.nodes && item.nodes.length) {
      if (knownBrowserGlobals.has(item.name)) {
        map.set(item.name, (map.get(item.name) || 0) + item.nodes.length)
      }
    }
  }
  const result = Array.from(map)
    .filter((x) => x[1] >= minimumUsageCount)
    .sort((a, b) => {
      const c = b[1] - a[1]
      return c || a[0].localeCompare(b[0])
    })
    .map((x) => x[0])
  return result
}
