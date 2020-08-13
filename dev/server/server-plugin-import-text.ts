import { ServerPlugin, readBody, isImportRequest } from 'vite'
import { dataToEsm } from 'rollup-pluginutils'

export function createServerPluginImportText(extensions: string[]): ServerPlugin {
  const createTextPlugin: ServerPlugin = ({ app }) => {
    app.use(async (ctx, next) => {
      await next()
      if (isImportRequest(ctx) && ctx.body) {
        for (const ext of extensions) {
          if (ctx.path.endsWith(ext)) {
            ctx.type = 'js'
            ctx.body = dataToEsm(await readBody(ctx.body), { namedExports: false, preferConst: true })
            return
          }
        }
      }
    })
  }
  return createTextPlugin
}
