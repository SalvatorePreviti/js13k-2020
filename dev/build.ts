#!/usr/bin/env node dev/ts-run.js

///////////////////////////////////////////////////////
// build.ts
///////////////////////////////////////////////////////
// It builds everything.
//  usage: ./dev/build.ts [production|development]
///////////////////////////////////////////////////////

import { devBeginOperation, devLogError, devEndOperation, prettyFileSize } from './lib/dev-utils'
import chalk from 'chalk'
import paths from './config/builder-paths'
import fs from 'fs-extra'
import { builderZipBundle } from './builder/builder-zip-bundle'
import { builderRollupBuild } from './builder/builder'
import path from 'path'

export async function build() {
  devBeginOperation('build')

  console.log(
    `🎮 ${chalk.cyanBright.italic('building')} ${chalk.cyan(
      path.relative(paths.root, paths.indexHtmlPath)
    )} ${chalk.green('→')} ${chalk.cyan('dist/')}`
  )
  console.log()

  // Clean output directory
  await fs.remove(paths.dist)

  // Creates empty directory
  await fs.ensureDir(paths.dist)

  const rollupBuildResult = await builderRollupBuild()

  const zipBuffer = await builderZipBundle([{ name: 'index.html', content: rollupBuildResult.html }])

  devEndOperation(prettyFileSize(zipBuffer.length))
}

if (require.main === module) {
  console.log(chalk.rgb(80, 220, 255).bold('\nGREETINGS PROFESSOR FALKEN.\n'))
  build()
    .then(() => {
      console.log()
      console.log(chalk.rgb(80, 220, 255).bold('\nSHALL WE PLAY A GAME?\n'))
    })
    .catch((e) => {
      if (!process.exitCode) {
        process.exitCode = 1
      }
      devLogError('Build failed.', e)

      if (e && e.code === 'ENOENT' && typeof e.path === 'string') {
        console.log(
          chalk.yellow(
            `${chalk.yellowBright('TIP')}: Be sure there is a ${chalk.yellowBright(
              '"./"'
            )} in HTML references, like ${chalk.yellowBright('<link href="./filename.css">')} or ${chalk.yellowBright(
              '<script src="./file.js">'
            )}`
          )
        )
      }
    })
}
