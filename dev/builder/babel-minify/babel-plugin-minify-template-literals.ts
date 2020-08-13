import { types, ConfigAPI, PluginObj, NodePath } from '@babel/core'

const babelGenerator = require('@babel/generator').default

export default function babelPluginMinifyTemplateLiterals(api: ConfigAPI): PluginObj {
  api.assertVersion(7)
  return {
    visitor: {
      TemplateLiteral: templateLiteral
    }
  }
}

function templateLiteral(path: NodePath<types.TemplateLiteral>): void {
  const nodes = []
  const expressions = path.get('expressions')

  let index = 0
  for (const elem of path.node.quasis) {
    if (elem.value.cooked) {
      nodes.push(types.stringLiteral(elem.value.cooked))
    }

    if (index < expressions.length) {
      const expr = expressions[index++]
      const node = expr.node
      if (!types.isStringLiteral(node, { value: '' })) {
        nodes.push(node)
      }
    }
  }

  if (!types.isStringLiteral(nodes[0]) && !types.isStringLiteral(nodes[1])) {
    nodes.unshift(types.stringLiteral(''))
  }
  let root = nodes[0]

  for (let i = 1; i < nodes.length; i++) {
    root = types.binaryExpression('+', root, nodes[i])
  }

  const templateLength = babelGenerator(path.node, { comments: false, minified: true }, '').code.length
  const es5Length = babelGenerator(root, { comments: false, minified: true }, '').code.length

  if (es5Length <= templateLength) {
    path.replaceWith(root)
  }
}
