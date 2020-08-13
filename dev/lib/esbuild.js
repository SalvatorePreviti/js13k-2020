const child_process = require('child_process')

const esbuildService = require('vite/dist/node/esbuildService')

const buildPluginEsbuild = require('vite/dist/node/build/buildPluginEsbuild.js')

let _esbuildChildProcess
let _esBuildRefCount = 0

// monkey patch process spawn to obtain a reference to esbuild child process instance.
const _oldChildProcessSpawn = child_process.spawn
child_process.spawn = (command, args, options) => {
  const result = _oldChildProcessSpawn(command, args, options)
  if (
    _esBuildRefCount > 0 &&
    !_esbuildChildProcess &&
    typeof command === 'string' &&
    command.endsWith('esbuild') | command.endsWith('esbuild.exe')
  ) {
    _esbuildChildProcess = result
    if (result.stdin && result.stdin !== process.stdin) {
      result.stdin.unref()
    }
    if (result.stdout && result.stdout !== process.stdout) {
      result.stdout.unref()
    }
  }
  return result
}

/** Adds a reference so esbuild so it does not get destroyed */
function esbuildRef() {
  if (++_esBuildRefCount === 1 && _esbuildChildProcess) {
    _esbuildChildProcess.ref()
  }
}

/** Removes a reference so esbuild can get destroyed when process should terminate */
function esbuildUnref() {
  if (--_esBuildRefCount === 0 && _esbuildChildProcess) {
    _esbuildChildProcess.unref()
  }
}

const _oldEsbuildTransform = esbuildService.transform
const _oldEsbuildStopService = esbuildService.stopService

// Monkey patch esbuild service transform so we can decorate with addref and unref
esbuildService.transform = function esbuildTransform(...args) {
  esbuildRef()
  return _oldEsbuildTransform(...args).finally(esbuildUnref)
}

// Monkey patch esbuild stop service so we can remove _esbuildChildProcess
esbuildService.stopService = function esbuildStopService(...args) {
  if (_esbuildChildProcess) {
    _esbuildChildProcess.unref()
    _esbuildChildProcess = null
  }
  return _oldEsbuildStopService(...args)
}

const oldCreateEsbuildPlugin = buildPluginEsbuild.createEsbuildPlugin

async function createEsbuildRollupPlugin(...args) {
  const result = await oldCreateEsbuildPlugin(...args)
  const oldTransform = result.transform

  result.transform = function transform(code, id) {
    if ((typeof code === 'string' && id.endsWith('.js')) || id.endsWith('.ts')) {
      if (code.charCodeAt(0) === 35 && code.charCodeAt(1) === 33) {
        // #! - Replace hashbang with a comment, it makes rollup hang in findFirstLineBreakOutsideComment function!
        code = `// ${code.slice(2)}`
      }
    }
    return oldTransform(code, id)
  }
  return result
}

buildPluginEsbuild.createEsbuildPlugin = createEsbuildRollupPlugin

module.exports = {
  esbuildTransform: esbuildService.transform,
  esbuildStopService: esbuildService.stopService,
  createEsbuildRollupPlugin,
  createEsbuildRenderChunkRollupPlugin: buildPluginEsbuild.createEsbuildRenderChunkPlugin
}
