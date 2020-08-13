import { ConfigAPI, PluginObj, NodePath, types } from '@babel/core'

export default function babelPluginMinifyObjectArgs(api: ConfigAPI): PluginObj {
  api.assertVersion(7)

  return {
    visitor: {
      FunctionDeclaration: funcExpression,
      ArrowFunctionExpression: funcExpression
    }
  }
}

function funcExpression(path: NodePath<types.FunctionDeclaration | types.ArrowFunctionExpression>) {
  for (const param of path.node.params) {
    if (param.type === 'ObjectPattern') {
      for (const prop of param.properties as any) {
        if (
          prop.type === 'ObjectProperty' &&
          prop.key &&
          prop.key.name &&
          prop.value &&
          prop.value.name &&
          prop.key.name.length <= prop.value.name.length + 1 &&
          !path.scope.bindings[prop.key.name]
        ) {
          tryRename(path.scope, prop.value.name, prop.key.name)
        }
      }
    }
  }

  for (const param of path.node.params as any) {
    if (param.type === 'Identifier' || (param.type === 'AssignmentPattern' && param.name)) {
      tryRename(path.scope, param.name, findBestParamNameFromShorthands(param, path))
    }
  }
}

function findBestParamNameFromShorthands(param, path) {
  let bestName = param.name
  const bindings = path.scope.bindings[param.name]
  if (bindings && bindings.referencePaths.length > 0) {
    for (const referencePath of bindings.referencePaths) {
      const parent = referencePath.parent
      if (parent && parent.type === 'ObjectProperty') {
        const kn = parent.key && parent.key.name
        if (kn && parent.value && parent.value.name === param.name) {
          if (kn.length <= bestName.length + 1) {
            if (!path.scope.bindings[kn]) {
              bestName = kn
            }
          }
        }
      }
    }
  }
  return bestName
}

function tryRename(scope, original, newName) {
  if (!newName || original === newName) {
    return false
  }
  const bindings = scope.bindings[original]
  if (bindings) {
    for (const referencePath of bindings.referencePaths) {
      const subScope = referencePath.scope
      if (subScope && subScope.bindings && subScope.bindings[newName]) {
        return false
      }
    }
  }
  scope.rename(original, newName)
  return true
}
