import { UserConfig } from 'vite'

import { createServerPluginImportText } from '../server/server-plugin-import-text'

import paths from './builder-paths'

export type ViteConfig = UserConfig & { textExtensions: string[]; buildSourcemap: boolean }

const viteConfig: ViteConfig = {
  textExtensions: paths.textExtensions,

  configureServer: [createServerPluginImportText(paths.textExtensions)],

  root: paths.root,
  assetsDir: '_assets',
  base: paths.base,
  outDir: paths.resolve(paths.dist, 'vite'),

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
