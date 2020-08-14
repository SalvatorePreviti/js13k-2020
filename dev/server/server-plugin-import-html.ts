import { readBody, isImportRequest, ServerPluginContext } from 'vite'
import { dataToEsm } from 'rollup-pluginutils'

export function serverPluginImportHtml({ app }: ServerPluginContext) {
  app.use(async (ctx, next) => {
    await next()
    if (isImportRequest(ctx) && ctx.body) {
      if (ctx.path.endsWith('.html')) {
        ctx.type = 'js'
        ctx.body = dataToEsm(await readBody(ctx.body), { namedExports: false, preferConst: true })
      }
    }
  })
}
