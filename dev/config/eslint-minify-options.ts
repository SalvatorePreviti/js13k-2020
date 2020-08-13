import type { ESLint } from 'eslint'
import paths from './builder-paths'
import { knownBrowserGlobalsAsObject } from './browser-globals'

export interface ESLintMinifySettings {
  maxPasses: number
  sourceType: 'script' | 'module'
}

export interface ESLintMinifyOptions {
  maxPasses: number
  eslintOptions: ESLint.Options
}

/**
 * What? ESLint to minify stuff? Oh well, yes, why not!
 * Validate, standardise, optimize code and remove some redundant stuff.
 */
export function getESLintMinifyOptions({ maxPasses, sourceType }: ESLintMinifySettings): ESLintMinifyOptions {
  return {
    maxPasses,
    eslintOptions: {
      cwd: paths.root,
      fixTypes: ['problem', 'suggestion', 'layout'],
      cache: false,
      fix: true,
      errorOnUnmatchedPattern: false,
      ignore: false,
      useEslintrc: false,
      allowInlineConfig: false,
      baseConfig: {
        parserOptions: { ecmaVersion: 2020, sourceType },
        env: { browser: true, es2020: true },
        globals: knownBrowserGlobalsAsObject,
        rules: {
          yoda: 1,
          eqeqeq: 1,
          quotes: [1, 'single', { avoidEscape: true, allowTemplateLiterals: false }],
          'no-extra-boolean-cast': 1,
          'no-extra-parens': [
            1,
            'all',
            {
              conditionalAssign: true,
              returnAssign: true,
              nestedBinaryExpressions: true,
              enforceForArrowConditionals: true,
              enforceForSequenceExpressions: true,
              enforceForNewInMemberExpressions: true,
              enforceForFunctionPrototypeMethods: true
            }
          ],
          'no-lonely-if': 1,
          'no-else-return': 1,
          'dot-notation': 1,
          'no-const-assign': 2,
          'no-extra-semi': 1,
          'no-regex-spaces': 1,
          'no-extra-bind': 1,
          'no-extra-label': 1,
          'no-floating-decimal': 1,
          'prefer-arrow-callback': [1, { allowNamedFunctions: false }],
          'arrow-parens': [1, 'as-needed'],
          'arrow-body-style': [1, 'as-needed'],
          'object-shorthand': [
            1,
            'always',
            { avoidQuotes: true, ignoreConstructors: false, avoidExplicitReturnArrows: true }
          ],
          'prefer-numeric-literals': 1,
          'sort-vars': 1,
          'quote-props': [1, 'as-needed'],
          'no-var': 1,
          'no-unused-labels': 1,
          'prefer-object-spread': 1,
          'no-trailing-spaces': 1,
          'no-useless-rename': [1, { ignoreDestructuring: false, ignoreImport: false, ignoreExport: false }],
          'no-unneeded-ternary': 1,
          'no-useless-computed-key': 1,
          'no-useless-return': 1,
          'no-undef-init': 1,
          'prefer-exponentiation-operator': 1,
          'prefer-const': 1,
          'one-var': [1, 'always'],
          'operator-assignment': [1, 'always'],
          'prefer-destructuring': [1, { array: false, object: true }]
        }
      }
    }
  }
}
