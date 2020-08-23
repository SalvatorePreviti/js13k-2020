import { transform } from '@babel/core'
import paths from '../../config/builder-paths'

import babelPluginMinifyDeadCodeElimination from 'babel-plugin-minify-dead-code-elimination'
import babelPluginMinifyEmptyFunction from 'babel-plugin-minify-empty-function'
import babelPluginMinifySimplify from 'babel-plugin-minify-simplify'
import babelPluginMinifyTypeConstructors from 'babel-plugin-minify-type-constructors'
import babelPluginMergeSiblingVariables from 'babel-plugin-transform-merge-sibling-variables'
import babelPluginSimplifyComparisonOperators from 'babel-plugin-transform-simplify-comparison-operators'
import babelPluginMinifyFlipComparisons from 'babel-plugin-minify-flip-comparisons'
import babelPluginMinifyNumericLiterals from 'babel-plugin-minify-numeric-literals'
import babelPluginMinifyBuiltins from 'babel-plugin-minify-builtins'
import babelPluginTransformInlineConsecutiveAdds from 'babel-plugin-transform-inline-consecutive-adds'

import babelPluginMinifyObjectArgs from './babel-plugin-minify-object-args'
import babelPluginMinifyTemplateLiterals from './babel-plugin-minify-template-literals'

export function babelMinify(code: string) {
  const transformResult = transform(code, {
    root: paths.root,
    configFile: false,
    babelrc: false,
    envName: 'production',
    comments: true,
    compact: true,
    cwd: paths.root,
    minified: true,
    parserOpts: {
      strictMode: true,
      allowAwaitOutsideFunction: false,
      allowImportExportEverywhere: false,
      allowReturnOutsideFunction: false,
      allowSuperOutsideMethod: false,
      allowUndeclaredExports: true,
      sourceType: 'script'
    },
    plugins: [
      [
        babelPluginMinifyDeadCodeElimination,
        {
          optimizeRawSize: true,
          keepFnName: true,
          keepClassName: true,
          keepFnArgs: true,
          tdz: true
        }
      ],
      babelPluginTransformInlineConsecutiveAdds,
      babelPluginMinifyEmptyFunction,
      babelPluginMinifySimplify,
      babelPluginMinifyTypeConstructors,
      babelPluginMergeSiblingVariables,
      babelPluginMinifyFlipComparisons,
      babelPluginSimplifyComparisonOperators,
      babelPluginMinifyNumericLiterals,
      babelPluginMinifyBuiltins,
      babelPluginMinifyObjectArgs,
      babelPluginMinifyTemplateLiterals
    ]
  })
  return transformResult.code || code
}
