import { createEsbuildRenderChunkRollupPlugin } from '../lib/esbuild'
import { isStaticAsset } from 'vite/dist/node/utils'
import {
  rollup,
  Plugin as RollupPlugin,
  RollupOutput,
  RollupOptions,
  OutputOptions as RollupOutputOptions
} from 'rollup'
import { createResolver, InternalResolver } from 'vite/dist/node/resolver'
import { createBuildCssPlugin } from 'vite/dist/node/build/buildPluginCss'
import { createBuildAssetPlugin } from 'vite/dist/node/build/buildPluginAsset'
import { createReplacePlugin } from 'vite/dist/node/build/buildPluginReplace'
import { defaultDefines } from 'vite/dist/node/config'
import { isCSSRequest } from 'vite/dist/node/utils/cssUtils'
import { createBuildWasmPlugin } from 'vite/dist/node/build/buildPluginWasm'
import paths from '../config/builder-paths'
import viteConfig from '../config/vite.config'
import { onRollupWarning, createBaseRollupPlugins } from 'vite'
import { BuilderMainHtml, BuilderMainHtmlExtraction } from './builder-main-html'
import chalk from 'chalk'
import { prettyFileSize, devEndOperation, devBeginOperation } from '../lib/dev-utils'
import { builderBundle } from './builder-bundle'
import fs from 'fs'
import path from 'path'
import { createRollupPluginImportText } from './rollup-plugin-import-text'

export interface RollupBuildResult {
  html: string
  assets: RollupOutput['output']
}

export async function builderRollupBuild(): Promise<RollupBuildResult> {
  const sourcemap = !!viteConfig.sourcemap && !!viteConfig.buildSourcemap

  const resolver = createResolver(paths.root, viteConfig.resolvers || [], viteConfig.alias || {})

  const mainHtml = new BuilderMainHtml(resolver)

  devBeginOperation('rollup')
  await mainHtml.load()
  await mainHtml.processAssets()

  const rollupPlugins = await createRollupPlugins(sourcemap, resolver, mainHtml.rollupPlugin)

  const rollupOptions: RollupOptions = {
    input: mainHtml.indexHtmlSourcePath,
    onwarn: onRollupWarning(undefined, viteConfig.optimizeDeps),
    ...viteConfig.rollupInputOptions,
    plugins: rollupPlugins
  }

  const rollupOutputOptions: RollupOutputOptions = {
    sourcemap,
    entryFileNames: `[name].js`,
    chunkFileNames: `[name].js`,
    ...viteConfig.rollupOutputOptions
  }

  const rollupBundle = await rollup(rollupOptions)
  const rollupOutput = await rollupBundle.generate(rollupOutputOptions)
  const extractedOutput = mainHtml.extract(rollupOutput)

  devEndOperation()

  reportRolloutOutput(mainHtml, extractedOutput)

  const unoptimizedHtml = await builderBundle(extractedOutput, false)

  console.log()
  await fs.promises.writeFile(paths.unoptimizedOutputHtmlPath, unoptimizedHtml)
  console.log(
    `${chalk.greenBright('💾 file')} ${chalk.rgb(
      200,
      255,
      240
    )(path.relative(paths.root, paths.unoptimizedOutputHtmlPath))} ${chalk.greenBright('written')}  ${chalk.rgb(
      80,
      200,
      100
    )(prettyFileSize(unoptimizedHtml.length))}`
  )
  console.log()

  const optimizedHtml = await builderBundle(extractedOutput, true)

  console.log()
  await fs.promises.writeFile(paths.optimizedOutputHtmlPath, optimizedHtml)
  console.log(
    `${chalk.greenBright('💾 file')} ${chalk.rgb(
      200,
      255,
      240
    )(path.relative(paths.root, paths.optimizedOutputHtmlPath))} ${chalk.greenBright('written')}  ${chalk.rgb(
      80,
      200,
      100
    )(prettyFileSize(optimizedHtml.length))}`
  )
  console.log()

  return {
    html: optimizedHtml,
    assets: extractedOutput.assets
  }
}

function reportRolloutOutput(mainHtml: BuilderMainHtml, result: BuilderMainHtmlExtraction) {
  const lines: string[] = []
  for (const chunk of result.assets) {
    let typeColor: chalk.Chalk
    let size = 0
    if (chunk.type === 'chunk') {
      typeColor = chalk.cyan
      size = Buffer.byteLength(chunk.code)
    } else {
      if (!chunk.source) {
        continue
      }
      size = Buffer.byteLength(chunk.source)
      typeColor = chunk.fileName.endsWith('.css') ? chalk.magenta : chalk.green
    }
    lines.push(` ${typeColor(chunk.fileName.padEnd(10))} ${chalk.green(prettyFileSize(size).padStart(21))}`)
  }

  for (const line of lines) {
    console.log(line)
  }
  console.log()
}

async function createRollupPlugins(
  sourcemap: boolean,
  resolver: InternalResolver,
  htmlPlugin: RollupPlugin
): Promise<RollupPlugin[]> {
  let publicBasePath = (paths.base || '').trim()
  if (publicBasePath && !publicBasePath.endsWith('/')) {
    publicBasePath += '/'
  }
  const plugins: RollupPlugin[] = [
    ...(await createBaseRollupPlugins(paths.root, resolver, viteConfig)),

    createRollupPluginImportText(paths.textExtensions),

    htmlPlugin,
    createReplacePlugin(
      (id) => !isCSSRequest(id) && !isStaticAsset(id),
      getReplaceDefinitions(publicBasePath),
      sourcemap
    ),

    createBuildCssPlugin({
      root: paths.root,
      publicBase: publicBasePath,
      assetsDir: viteConfig.assetsDir,
      minify: !!viteConfig.minify,
      inlineLimit: viteConfig.assetsInlineLimit,
      cssCodeSplit: viteConfig.cssCodeSplit === undefined || !!viteConfig.cssCodeSplit,
      preprocessOptions: viteConfig.cssPreprocessOptions,
      modulesOptions: viteConfig.cssModuleOptions
    }),

    createBuildAssetPlugin(paths.root, publicBasePath, viteConfig.assetsDir, viteConfig.assetsInlineLimit),
    createBuildWasmPlugin(paths.root, publicBasePath, viteConfig.assetsDir, viteConfig.assetsInlineLimit),
    createEsbuildRenderChunkRollupPlugin(viteConfig.esbuildTarget || 'es2019', viteConfig.minify === 'esbuild')
  ]

  return plugins.filter(Boolean)
}

function getReplaceDefinitions(publicBasePath: string) {
  const env = viteConfig.env || {}
  const userClientEnv: Record<string, string | boolean> = {}
  const userEnvReplacements: Record<string, string> = {}
  Object.keys(env).forEach((key) => {
    if (key.startsWith(`VITE_`)) {
      userEnvReplacements[`import.meta.env.${key}`] = JSON.stringify(env[key])
      userClientEnv[key] = env[key]
    }
  })
  const builtInClientEnv = {
    BASE_URL: publicBasePath,
    MODE: viteConfig.mode === 'development' ? 'development' : 'production',
    DEV: viteConfig.mode === 'development',
    PROD: viteConfig.mode !== 'development'
  }
  const builtInEnvReplacements: Record<string, string> = {}
  Object.keys(builtInClientEnv).forEach((key) => {
    builtInEnvReplacements[`import.meta.env.${key}`] = JSON.stringify(builtInClientEnv[key])
  })

  const definitions = {
    ...defaultDefines,
    ...viteConfig.define,
    ...userEnvReplacements,
    ...builtInEnvReplacements,
    'import.meta.env.': `({}).`,
    'import.meta.env': JSON.stringify(userClientEnv),
    'process.env.NODE_ENV': JSON.stringify(viteConfig.mode),
    'process.env.': `({}).`,
    'process.env': JSON.stringify({ NODE_ENV: viteConfig.mode }),
    'import.meta.hot': `false`
  }
  return definitions
}
