#!/usr/bin/env node

'use strict'

/////////////////////////////////////////////////////////
// ts-run.js
/////////////////////////////////////////////////////////
// Runs a .ts or .js file with esm modules.
// Transpiles input just in time, without type checking.
//  usage: node ./dev/ts-run file-to-execute.ts
/////////////////////////////////////////////////////////

const _startTime = process.hrtime()

const path = require('path')
const util = require('util')
const chalk = require('chalk')

// For simplifying debug, increase console.log inspection depth
util.inspect.defaultOptions.depth = 30
if (Error.stackTraceLimit < 30) {
  Error.stackTraceLimit = 30
}

const rollup = require('rollup')
const sourceMapSupport = require('source-map-support')
const pluginNodeResolve = require('@rollup/plugin-node-resolve')
const pluginCommonjs = require('@rollup/plugin-commonjs')

const { createEsbuildRollupPlugin } = require('./lib/esbuild')

const _sourceMaps = new Map()

async function run(fileToLoad) {
  process.chdir(path.resolve(__dirname, '..'))

  sourceMapSupport.install({
    handleUncaughtExceptions: true,
    environment: 'node',
    retrieveSourceMap(file) {
      let map = _sourceMaps.get(file)
      if (map === undefined) {
        return null
      }
      if (typeof map !== 'string') {
        map = map.toString()
        _sourceMaps.set(file, map)
      }
      return { url: file, map }
    }
  })

  const resolvedPath = require.resolve(path.resolve(fileToLoad))

  const nodeResolve = pluginNodeResolve.nodeResolve({
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
  })

  const esbuildPlugin = await createEsbuildRollupPlugin({})

  const bundle = await rollup.rollup({
    external(id) {
      return (id[0] !== '.' && !path.isAbsolute(id)) || id.endsWith('.json')
    },
    input: resolvedPath,
    cache: false,
    treeshake: false,
    acorn: {
      allowHashBang: true
    },
    plugins: [esbuildPlugin, nodeResolve, pluginCommonjs()]
  })

  const {
    output: [{ code, map: jsSourceMap }]
  } = await bundle.generate({
    exports: 'named',
    strict: true,
    format: 'cjs',
    sourcemap: true,
    sourcemapExcludeSources: true,
    sourcemapPathTransform: (relativeSourcePath, sourcemapPath) => {
      return path.resolve(path.dirname(sourcemapPath), relativeSourcePath)
    }
  })

  // remove #! hashbang
  const js = code.replace(/^#!\/.*/gm, '')

  _sourceMaps.set(resolvedPath, jsSourceMap)

  // eslint-disable-next-line node/no-deprecated-api
  const requireExtensions = require.extensions
  const extension = path.extname(resolvedPath)
  const defaultLoader = requireExtensions[extension]
  requireExtensions[extension] = (module, filename) => {
    if (filename === resolvedPath) {
      process.mainModule = module
      module._compile(js, filename)
    } else {
      defaultLoader(module, filename)
    }
  }
  delete require.cache[resolvedPath]

  if (require.main === module) {
    const timeDiff = process.hrtime(_startTime)
    const timeDiffMs = (timeDiff[0] * 1e9 + timeDiff[1]) * 1e-6
    console.log(chalk.gray(`ts-run: compiled in ${timeDiffMs.toFixed(0)} ms`))
  }

  return require(resolvedPath)
}

if (require.main === module) {
  run(process.argv[2]).catch((error) => {
    if (error && error.watchFiles) {
      // Hide this from console logging because is not helpful and noisy
      Reflect.defineProperty(error, 'watchFiles', {
        value: error.watchFiles,
        configurable: true,
        enumerable: false,
        writable: true
      })
    }
    console.error(chalk.redBright('❌ ts-run'), error)
    if (!process.exitCode) {
      process.exitCode = 1
    }
  })
}
