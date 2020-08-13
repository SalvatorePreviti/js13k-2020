import { resolveAsset as _viteResolveAsset } from 'vite/dist/node/build/buildPluginAsset'
import paths from '../config/builder-paths'
import viteConfig from '../config/vite.config'

export function resolveAsset(id: string, inlineLimit: number = 0) {
  return _viteResolveAsset(id, paths.root, paths.base, viteConfig.assetsDir, inlineLimit)
}

export async function resolveAssetText(id: string, inlineLimit: number = 0): Promise<string | undefined> {
  const resolved = await resolveAsset(id, inlineLimit)
  if (resolved) {
    const content = resolved.content
    if (content) {
      return content.toString('utf8')
    }
  }
  return undefined
}
