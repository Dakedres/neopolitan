"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = convertFunctionParams;

var _core = require("@babel/core");

const buildDefaultParam = _core.template.statement(`
  let VARIABLE_NAME =
    Array.from(arguments).length > ARGUMENT_KEY && arguments[ARGUMENT_KEY] !== undefined ?
      arguments[ARGUMENT_KEY]
    :
      DEFAULT_VALUE;
`);

const buildLooseDefaultParam = _core.template.statement(`
  if (ASSIGNMENT_IDENTIFIER === UNDEFINED) {
    ASSIGNMENT_IDENTIFIER = DEFAULT_VALUE;
  }
`);

const buildLooseDestructuredDefaultParam = _core.template.statement(`
  let ASSIGNMENT_IDENTIFIER = PARAMETER_NAME === UNDEFINED ? DEFAULT_VALUE : PARAMETER_NAME ;
`);

const buildSafeArgumentsAccess = _core.template.statement(`
  let $0 = Array.from(arguments).length > $1 ? arguments[$1] : undefined;
`);

const iifeVisitor = {
  "ReferencedIdentifier|BindingIdentifier"(path, state) {
    const {
      scope,
      node
    } = path;
    const {
      name
    } = node;

    if (name === "eval" || scope.getBinding(name) === state.scope.parent.getBinding(name) && state.scope.hasOwnBinding(name)) {
      state.needsOuterBinding = true;
      path.stop();
    }
  },

  // type annotations don't use or introduce "real" bindings
  "TypeAnnotation|TSTypeAnnotation|TypeParameterDeclaration|TSTypeParameterDeclaration": path => path.skip()
};

// last 2 parameters are optional -- they are used by proposal-object-rest-spread/src/index.js
function convertFunctionParams(path, ignoreFunctionLength, shouldTransformParam, replaceRestElement) {
  const params = path.get("params");
  const isSimpleParameterList = params.every(param => param.isIdentifier());
  if (isSimpleParameterList) return false;
  const {
    node,
    scope
  } = path;
  const state = {
    stop: false,
    needsOuterBinding: false,
    scope
  };
  const body = [];
  const shadowedParams = new Set();

  for (const param of params) {
    for (const name of Object.keys(param.getBindingIdentifiers())) {
      const constantViolations = scope.bindings[name]?.constantViolations;

      if (constantViolations) {
        for (const redeclarator of constantViolations) {
          const node = redeclarator.node; // If a constant violation is a var or a function declaration,
          // we first check to see if it's a var without an init.
          // If so, we remove that declarator.
          // Otherwise, we have to wrap it in an IIFE.

          switch (node.type) {
            case "VariableDeclarator":
              {
                if (node.init === null) {
                  const declaration = redeclarator.parentPath; // The following uninitialized var declarators should not be removed
                  // for (var x in {})
                  // for (var x;;)

                  if (!declaration.parentPath.isFor() || declaration.parentPath.get("body") === declaration) {
                    redeclarator.remove();
                    break;
                  }
                }

                shadowedParams.add(name);
                break;
              }

            case "FunctionDeclaration":
              shadowedParams.add(name);
              break;
          }
        }
      }
    }
  }

  if (shadowedParams.size === 0) {
    for (const param of params) {
      if (!param.isIdentifier()) param.traverse(iifeVisitor, state);
      if (state.needsOuterBinding) break;
    }
  }

  let firstOptionalIndex = null;

  for (let i = 0; i < params.length; i++) {
    const param = params[i];

    if (shouldTransformParam && !shouldTransformParam(i)) {
      continue;
    }

    const transformedRestNodes = [];

    if (replaceRestElement) {
      replaceRestElement(path, param, transformedRestNodes);
    }

    const paramIsAssignmentPattern = param.isAssignmentPattern();

    if (paramIsAssignmentPattern && (ignoreFunctionLength || _core.types.isMethod(node, {
      kind: "set"
    }))) {
      const left = param.get("left");
      const right = param.get("right");
      const undefinedNode = scope.buildUndefinedNode();

      if (left.isIdentifier()) {
        body.push(buildLooseDefaultParam({
          ASSIGNMENT_IDENTIFIER: _core.types.cloneNode(left.node),
          DEFAULT_VALUE: right.node,
          UNDEFINED: undefinedNode
        }));
        param.replaceWith(left.node);
      } else if (left.isObjectPattern() || left.isArrayPattern()) {
        const paramName = scope.generateUidIdentifier();
        body.push(buildLooseDestructuredDefaultParam({
          ASSIGNMENT_IDENTIFIER: left.node,
          DEFAULT_VALUE: right.node,
          PARAMETER_NAME: _core.types.cloneNode(paramName),
          UNDEFINED: undefinedNode
        }));
        param.replaceWith(paramName);
      }
    } else if (paramIsAssignmentPattern) {
      if (firstOptionalIndex === null) firstOptionalIndex = i;
      const left = param.get("left");
      const right = param.get("right");
      const defNode = buildDefaultParam({
        VARIABLE_NAME: left.node,
        DEFAULT_VALUE: right.node,
        ARGUMENT_KEY: _core.types.numericLiteral(i)
      });
      body.push(defNode);
    } else if (firstOptionalIndex !== null) {
      const defNode = buildSafeArgumentsAccess([param.node, _core.types.numericLiteral(i)]);
      body.push(defNode);
    } else if (param.isObjectPattern() || param.isArrayPattern()) {
      const uid = path.scope.generateUidIdentifier("ref");
      uid.typeAnnotation = param.node.typeAnnotation;

      const defNode = _core.types.variableDeclaration("let", [_core.types.variableDeclarator(param.node, uid)]);

      body.push(defNode);
      param.replaceWith(_core.types.cloneNode(uid));
    }

    if (transformedRestNodes) {
      for (const transformedNode of transformedRestNodes) {
        body.push(transformedNode);
      }
    }
  } // we need to cut off all trailing parameters


  if (firstOptionalIndex !== null) {
    node.params = node.params.slice(0, firstOptionalIndex);
  } // ensure it's a block, useful for arrow functions


  path.ensureBlock();

  if (state.needsOuterBinding || shadowedParams.size > 0) {
    body.push(buildScopeIIFE(shadowedParams, path.get("body").node));
    path.set("body", _core.types.blockStatement(body)); // We inject an arrow and then transform it to a normal function, to be
    // sure that we correctly handle this and arguments.

    const bodyPath = path.get("body.body");
    const arrowPath = bodyPath[bodyPath.length - 1].get("argument.callee"); // This is an IIFE, so we don't need to worry about the noNewArrows assumption

    arrowPath.arrowFunctionToExpression();
    arrowPath.node.generator = path.node.generator;
    arrowPath.node.async = path.node.async; // We don't reset "async" because if the default value of a parameter
    // throws, it must reject asynchronously.

    path.node.generator = false;
  } else {
    path.get("body").unshiftContainer("body", body);
  }

  return true;
}

function buildScopeIIFE(shadowedParams, body) {
  const args = [];
  const params = [];

  for (const name of shadowedParams) {
    // We create them twice; the other option is to use t.cloneNode
    args.push(_core.types.identifier(name));
    params.push(_core.types.identifier(name));
  }

  return _core.types.returnStatement(_core.types.callExpression(_core.types.arrowFunctionExpression(params, body), args));
}