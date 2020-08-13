import cheerio from 'cheerio'
import { isExternalUrl, cleanUrl, isDataUrl } from 'vite/dist/node/utils'
import { resolveAsset, registerAssets } from 'vite/dist/node/build/buildPluginAsset'
import chalk from 'chalk'
import { InternalResolver } from 'vite/dist/node/resolver'
import paths from '../config/builder-paths'
import viteConfig from '../config/vite.config'
import type { RollupOutput, Plugin as RollupPlugin } from 'rollup'
import fs from 'fs'
import { resolveAssetText } from './builder-utils'
import { cheerioOptions } from '../config/cheerio-options'

export interface AssetEntry {
  content?: Buffer
  fileName?: string
  url: string
}

export interface BuilderMainHtmlExtraction {
  html: string
  css: string
  globalJs: string
  modulesJs: string
  assets: RollupOutput['output']
}

export class BuilderMainHtml {
  public $: CheerioStatic

  /** Plugin that needs to be passed to rollup */
  public readonly rollupPlugin: RollupPlugin

  /** Map of attributes to convert to assets */
  public assetAttrsConfig: Record<string, string[]> = {
    link: ['href'],
    video: ['src', 'poster'],
    source: ['src'],
    img: ['src'],
    image: ['xlink:href', 'href'],
    use: ['xlink:href', 'href']
  }

  /** vite assets resolver */
  public readonly resolver: InternalResolver

  /** Path of the source index.html */
  public readonly indexHtmlSourcePath: string

  /** Resulting static JS, not to be included as a module */
  private _globalJs: string

  /** Resulting js module code, needs to be wrapped in an IIFE */
  private _modulesJs: string

  /** List of other assets to bundle */
  public assets = new Map<string, Buffer>()

  public constructor(resolver: InternalResolver, indexHtmlSourcePath: string = paths.indexHtmlPath) {
    indexHtmlSourcePath = paths.resolve(indexHtmlSourcePath)
    this.indexHtmlSourcePath = indexHtmlSourcePath
    this.resolver = resolver

    this.rollupPlugin = {
      name: this.constructor.name,
      load: async (id) => {
        if (id === this.indexHtmlSourcePath) {
          // Returns just the module js code to rollup, globalJs will be merged and optimized later
          return this._modulesJs
        }
        if (id.endsWith('.html')) {
          // Not the main html, load as plain text
          const rawHtml = await resolveAssetText(id, 0)
          return `export default ${JSON.stringify(rawHtml)};\n`
        }
        return undefined
      },

      generateBundle: (_options, bundle) => {
        registerAssets(this.assets, bundle)
      }
    }
  }

  public async load() {
    const rawHtml = await fs.promises.readFile(this.indexHtmlSourcePath)
    this.$ = cheerio.load(rawHtml, cheerioOptions)
  }

  public resolveAsset(src: string, inlineLimit: boolean): Promise<AssetEntry> {
    return resolveAsset(
      this.resolver.requestToFile(src),
      paths.root,
      paths.base,
      viteConfig.assetsDir,
      inlineLimit ? viteConfig.assetsInlineLimit : 0
    )
  }

  public async processAssets() {
    const $ = this.$
    const syncScripts: string[] = []
    const asyncScripts: string[] = []
    const jsModules: string[] = []

    for (const rawElement of Array.from($('script'))) {
      const element = $(rawElement)
      const src = (element.attr('src') || '').trim()
      const srcType = (element.attr('type') || '').trim().toLowerCase()
      let gcode: string = ''
      if (src) {
        if (srcType === 'module') {
          if (isExternalUrl(src)) {
            console.warn(chalk.yellow(`WARNING: found external <script src="${src}"> with an external URL`))
            continue
          }
          jsModules.push(`import ${JSON.stringify(src)};`) // <script type="module" src="..."/>, add it as an import
        } else {
          const { fileName, content } = await this.resolveAsset(src, false)
          if (!fileName || !content) {
            console.warn(chalk.yellow(`WARNING: could not find script ${src}`))
            continue
          }
          gcode = content.toString().trim()
        }
      } else {
        gcode = element.html().trim()
      }

      if (gcode) {
        if (!gcode.endsWith(';') && !gcode.endsWith('}')) {
          gcode += ';'
        }
        if (srcType === 'module') {
          jsModules.push(gcode)
        } else if (element.prop('async') && element.attr('async') !== 'false') {
          asyncScripts.push(gcode)
        } else {
          syncScripts.push(gcode)
        }
      }

      element.remove()
    }

    for (const [tagName, attrNames] of Object.entries(this.assetAttrsConfig)) {
      for (const rawElement of Array.from($(tagName))) {
        const element = $(rawElement)
        for (const attrName of attrNames) {
          const src = element.attr(attrName)
          if (src) {
            if (!isExternalUrl(src) && !isDataUrl(src)) {
              const { fileName, content, url } = await this.resolveAsset(src, !cleanUrl(src).endsWith('.css'))
              element.attr(attrName, url)
              if (fileName && content) {
                this.assets.set(fileName, content)
              }
            }
          }
        }
      }
    }

    this._globalJs = syncScripts.join('\n') + asyncScripts.join('\n')

    this._modulesJs = jsModules.join('\n')
  }

  public extract(rollupOutput: RollupOutput): BuilderMainHtmlExtraction {
    let css = ''
    for (const chunk of rollupOutput.output) {
      if (
        chunk.type !== 'chunk' &&
        chunk.fileName.endsWith('.css') &&
        chunk.source &&
        !this.assets.has(chunk.fileName)
      ) {
        css += `${chunk.source.toString().trimEnd()}\n`
      }
    }

    let globalJs = this._globalJs || ''
    globalJs = globalJs.trim()

    let modulesJs = ''
    for (const chunk of rollupOutput.output) {
      if (chunk.type === 'chunk') {
        if (chunk.isEntry) {
          let code = chunk.code.trim()
          if (!code.endsWith(';') && !code.endsWith('}')) {
            code += ';'
          }
          modulesJs += `${code}\n`
        }
      }
    }

    modulesJs = modulesJs.trim()

    if (globalJs && modulesJs) {
      globalJs += !globalJs.endsWith(';') && !globalJs.endsWith('}') ? ';\n' : '\n'
    }

    const html = this.$.html(cheerioOptions)

    return { html, css, globalJs, modulesJs, assets: rollupOutput.output }
  }
}
