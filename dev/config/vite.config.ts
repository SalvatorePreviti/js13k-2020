import { UserConfig as ViteUserConfig } from 'vite'

import { createServerPluginImportText } from '../server/server-plugin-import-text'
import { createServerPluginImportShader } from '../server/server-plugin-import-shader'

import paths from './builder-paths'
import { serverPluginImportHtml } from '../server/server-plugin-import-html'

export interface ViteConfig extends ViteUserConfig {
  textExtensions: string[]
  shaderExtensions: string[]
  buildSourcemap: boolean
}

/** List of aliases available only during local server development mode */
const devModeAliases = new Map<string, string>([['/src/debug', 'src/_debug/_debug.ts']])

const devModeResolver = {
  fileToRequest(filePath: string, _root: string) {
    const found = devModeAliases.get(filePath)
    return found && `/${found}`
  },
  requestToFile(filePath: string, _root: string) {
    const found = devModeAliases.get(filePath)
    return found && paths.resolve(found)
  }
}

const viteConfig: ViteConfig = {
  textExtensions: paths.textExtensions,
  shaderExtensions: paths.shaderExtensions,

  configureServer: [
    createServerPluginImportText(paths.textExtensions),
    createServerPluginImportShader(paths.shaderExtensions),
    serverPluginImportHtml
  ],

  root: paths.root,
  assetsDir: '_assets',
  base: paths.base,
  outDir: paths.resolve(paths.dist, 'vite'),

  resolvers: [devModeResolver],

  sourcemap: true,

  buildSourcemap: false,

  minify: false,
  esbuildTarget: 'es2019',
  enableRollupPluginVue: false,
  cssCodeSplit: true,
  assetsInlineLimit: 32000,

  rollupInputOptions: {
    preserveEntrySignatures: false,
    context: 'window',
    moduleContext: () => 'window',
    acorn: {
      sourceType: 'module',
      allowReturnOutsideFunction: true,
      allowImportExportEverywhere: true
    },
    treeshake: {
      tryCatchDeoptimization: false,
      propertyReadSideEffects: false,
      unknownGlobalSideEffects: false,
      annotations: true,
      moduleSideEffects: 'no-external'
    }
  },

  rollupOutputOptions: {
    esModule: false,
    preserveModules: false,
    externalLiveBindings: false,
    minifyInternalExports: true,
    hoistTransitiveImports: true,
    inlineDynamicImports: true,
    interop: false,
    preferConst: true,
    compact: true,
    extend: false,
    strict: false,
    format: 'iife',
    name: '$'
  }
}

export default viteConfig
