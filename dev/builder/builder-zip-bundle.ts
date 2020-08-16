import ADMZip from 'adm-zip'
import ADMZipMethods from 'adm-zip/methods'
import fs from 'fs'
import path from 'path'
import zlib from 'zlib'
import { zipBundleOptions } from '../config/zip-bundle-options'
import chalk from 'chalk'
import paths from '../config/builder-paths'
import { prettyFileSize, devBeginOperation, devLogError, devEndOperation } from '../lib/dev-utils'

export type ZipFileEntry =
  | { name: string; content?: void; filePath: string }
  | { name: string; content: Buffer | string; filePath?: void }

export async function builderZipBundle(input: ZipFileEntry[]) {
  devBeginOperation(
    'zipBundle',
    `${input.length} file${input.length !== 1 ? 's' : ''}, ${
      zipBundleOptions.implementation === 'zopfli'
        ? `zopfli, ${zipBundleOptions.zopfli.numiterations} iterations`
        : `zlib, level ${zipBundleOptions.zlib.level}`
    }`
  )

  devBeginOperation('prepare')

  const admZip = new ADMZip()
  const entries: { name: string; data: Buffer }[] = []
  for (const item of input) {
    let data: Buffer
    if (item.filePath) {
      data = await fs.promises.readFile(item.filePath)
    } else {
      data = typeof item.content === 'string' ? Buffer.from(item.content) : (item.content as Buffer)
    }
    if (!data || !Buffer.isBuffer(data)) {
      throw new Error(`Entry ${item.name} is invalid.`)
    }
    entries.push({ name: item.name, data })
  }

  entries.sort((a, b) => b.data.length - a.data.length || a.name.localeCompare(b.name))

  let inputSize = 0
  for (const entry of entries) {
    inputSize += entry.data.length
    admZip.addFile(entry.name, entry.data)
  }
  devEndOperation(prettyFileSize(inputSize))

  devBeginOperation('compress')
  const zippedBuffer = await new Promise<Buffer>((resolve, reject) => admZip.toBuffer(resolve, reject))
  await fs.promises.writeFile(paths.distBundleZipPath, zippedBuffer)
  devEndOperation(prettyFileSize(zippedBuffer.length))

  devBeginOperation('verify')
  const unzip = new ADMZip(zippedBuffer)

  const unzippedEntries: { name: string; data: Buffer }[] = []
  for (const entry of unzip.getEntries()) {
    unzippedEntries.push({ name: entry.name, data: entry.getData() })
  }
  unzippedEntries.sort((a, b) => b.data.length - a.data.length || a.name.localeCompare(b.name))

  if (entries.length !== unzippedEntries.length) {
    throw new Error(
      `Final zip contains ${unzippedEntries.length} files instead of ${entries.length}. Zip file verification failed.`
    )
  }
  for (let i = 0; i < entries.length; ++i) {
    const entry = entries[i]
    if (!entry.data.equals(unzippedEntries[i].data)) {
      throw new Error(
        `Compressed file ${entry.name}, index ${i}, has a different content. Zip file verification failed.`
      )
    }
  }
  devEndOperation(`${chalk.greenBright.underline('verification successful')} ✅`)

  devEndOperation(prettyFileSize(zippedBuffer.length))

  console.log()
  console.log(
    `${chalk.greenBright('💾 file')} ${chalk.rgb(
      200,
      255,
      240
    )(path.relative(paths.root, paths.distBundleZipPath))} ${chalk.greenBright('written')}  ${chalk.rgb(
      80,
      200,
      100
    )(prettyFileSize(zippedBuffer.length))}`
  )
  console.log()

  return zippedBuffer
}

let _zopfli: any = null

// Hack into adm-zip package to replace default zlib based implementation with a custom zlib or zopfli implementation.
Object.defineProperty(ADMZipMethods, 'Deflater', {
  get() {
    return zipBundleOptions.implementation === 'zopfli' ? ZopliDeflater : ZLibDeflater
  },
  configurable: true,
  enumerable: true
})

const { round } = Math

function ZLibDeflater(input: Buffer) {
  const options = {
    ...zipBundleOptions.zlib,
    chunkSize: (round(input.length / 1024) + 1) * 1024
  }
  return {
    deflate() {
      return zlib.deflateRawSync(input, options)
    },
    deflateAsync(callback: (input: Buffer) => void) {
      const parts = []
      zlib
        .createDeflateRaw(options)
        .on('data', (data) => parts.push(data))
        .on('end', () => callback(Buffer.concat(parts)))
        .on('error', (error) => {
          devLogError('zlib compression failed', error)
          callback(null)
        })
        .end(input)
    }
  }
}

function ZopliDeflater(input: Buffer) {
  return {
    deflate() {
      return _requireZopfli().deflateSync(input, zipBundleOptions.zopfli)
    },
    deflateAsync(callback: (input: Buffer) => void) {
      _requireZopfli().deflate(input, zipBundleOptions.zopfli, (error: Error | null, deflated: Buffer) => {
        if (error) {
          devLogError('zopli compression failed', error)
          callback(null)
        } else {
          callback(deflated)
        }
      })
    }
  }
}

function _requireZopfli() {
  return _zopfli || (_zopfli = require('node-zopfli'))
}
