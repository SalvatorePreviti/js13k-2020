import { ServerPlugin, readBody, isImportRequest } from 'vite'

export function createServerPluginImportShader(extensions: string[]): ServerPlugin {
  const isShaderExtension = (filepath: string) => {
    for (const ext of extensions) {
      if (filepath.endsWith(ext)) {
        return true
      }
    }
    return false
  }

  const createTextPlugin: ServerPlugin = ({ app, watcher }) => {
    app.use(async (ctx, next) => {
      if (!isShaderExtension(ctx.path)) {
        await next()
        return
      }

      if (ctx.path.startsWith('/vite/hmr_shaders/')) {
        ctx.body = `
export let code;
export function _setCode(v) { code = v; }
if (import.meta.hot) {
  import.meta.hot.on(${JSON.stringify(ctx.path.slice('/vite/hmr_shaders'.length))}, _setCode)
}`
        ctx.type = 'js'
        ctx.status = 200
        return
      }

      await next()
      if (!ctx.body) {
        return
      }

      const code = await readBody(ctx.body)

      ctx.type = 'js'
      ctx.body = `
import { code, _setCode } from ${JSON.stringify(`/vite/hmr_shaders${ctx.path}`)};
_setCode(${JSON.stringify(code)});
export { code } from ${JSON.stringify(`/vite/hmr_shaders${ctx.path}`)};
if (import.meta.hot) {
  import.meta.hot.accept(()=>{});
}`

      if (!isImportRequest(ctx)) {
        watcher.send({
          type: 'custom',
          id: ctx.path,
          customData: code
        })
      }
    })
  }
  return createTextPlugin
}
