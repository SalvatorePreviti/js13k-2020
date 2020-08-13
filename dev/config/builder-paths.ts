import path from 'path'

const root = process.cwd()

class BuilderPathsConfig {
  /** Project root directory. */
  public root = root

  public resolve(...parts: string[]): string {
    return path.resolve(root, ...parts)
  }

  /** List of extensions to use as text files */
  public textExtensions = ['.txt', '.frag', '.vert', '.glsl', '.fs', '.vs']

  /** source index.html path, the entry point */
  public indexHtmlPath = this.resolve('index.html')

  /** Build output directory. If the directory exists, it will be removed before the build and recreated. */
  public dist = this.resolve('dist')

  /** Output path for the final zip file */
  public distBundleZipPath = this.resolve('dist/bundle.zip')

  /** Base public path when served in production. Must end with '/' if not empty. */
  public base = ''

  public unoptimizedOutputHtmlPath = this.resolve(this.dist, 'index-raw.html')

  public optimizedOutputHtmlPath = this.resolve(this.dist, 'index.html')
}

const builderPathsConfig = new BuilderPathsConfig()

export default builderPathsConfig
