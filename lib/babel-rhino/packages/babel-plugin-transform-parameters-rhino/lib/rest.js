"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = convertFunctionRest;

var _core = require("@babel/core");

const buildRest = _core.template.statement(`
  for (var KEY = START;
      KEY < LEN;
      KEY++) {
    ARRAY[ARRAY_KEY] = ARGUMENTS[KEY];
  }
`);

const buildRestSetup = _core.template.statement(`
  var LEN = Array.from(ARGUMENTS).length,
      ARRAY = new Array(ARRAY_LEN);
`);

const restIndex = _core.template.expression(`
  (INDEX < OFFSET || Array.from(ARGUMENTS).length <= INDEX) ? undefined : ARGUMENTS[INDEX]
`);

const restIndexImpure = _core.template.expression(`
  REF = INDEX, (REF < OFFSET || Array.from(ARGUMENTS).length <= REF) ? undefined : ARGUMENTS[REF]
`);

const restLength = _core.template.expression(`
  Array.from(ARGUMENTS).length <= OFFSET ? 0 : Array.from(ARGUMENTS).length - OFFSET
`);

function referencesRest(path, state) {
  if (path.node.name === state.name) {
    // Check rest parameter is not shadowed by a binding in another scope.
    return path.scope.bindingIdentifierEquals(state.name, state.outerBinding);
  }

  return false;
}

const memberExpressionOptimisationVisitor = {
  Scope(path, state) {
    // check if this scope has a local binding that will shadow the rest parameter
    if (!path.scope.bindingIdentifierEquals(state.name, state.outerBinding)) {
      path.skip();
    }
  },

  Flow(path) {
    // Do not skip TypeCastExpressions as the contain valid non flow code
    if (path.isTypeCastExpression()) return; // don't touch reference in type annotations

    path.skip();
  },

  Function(path, state) {
    // Detect whether any reference to rest is contained in nested functions to
    // determine if deopt is necessary.
    const oldNoOptimise = state.noOptimise;
    state.noOptimise = true;
    path.traverse(memberExpressionOptimisationVisitor, state);
    state.noOptimise = oldNoOptimise; // Skip because optimizing references to rest would refer to the `arguments`
    // of the nested function.

    path.skip();
  },

  ReferencedIdentifier(path, state) {
    const {
      node
    } = path; // we can't guarantee the purity of arguments

    if (node.name === "arguments") {
      state.deopted = true;
    } // is this a referenced identifier and is it referencing the rest parameter?


    if (!referencesRest(path, state)) return;

    if (state.noOptimise) {
      state.deopted = true;
    } else {
      const {
        parentPath
      } = path; // Is this identifier the right hand side of a default parameter?

      if (parentPath.listKey === "params" && parentPath.key < state.offset) {
        return;
      } // ex: `args[0]`
      // ex: `args.whatever`


      if (parentPath.isMemberExpression({
        object: node
      })) {
        const grandparentPath = parentPath.parentPath;
        const argsOptEligible = !state.deopted && !( // ex: `args[0] = "whatever"`
        grandparentPath.isAssignmentExpression() && parentPath.node === grandparentPath.node.left || // ex: `[args[0]] = ["whatever"]`
        grandparentPath.isLVal() || // ex: `for (rest[0] in this)`
        // ex: `for (rest[0] of this)`
        grandparentPath.isForXStatement() || // ex: `++args[0]`
        // ex: `args[0]--`
        grandparentPath.isUpdateExpression() || // ex: `delete args[0]`
        grandparentPath.isUnaryExpression({
          operator: "delete"
        }) || // ex: `args[0]()`
        // ex: `new args[0]()`
        // ex: `new args[0]`
        (grandparentPath.isCallExpression() || grandparentPath.isNewExpression()) && parentPath.node === grandparentPath.node.callee);

        if (argsOptEligible) {
          if (parentPath.node.computed) {
            // if we know that this member expression is referencing a number then
            // we can safely optimise it
            if (parentPath.get("property").isBaseType("number")) {
              state.candidates.push({
                cause: "indexGetter",
                path
              });
              return;
            }
          } else if ( // @ts-expect-error .length must not be a private name
          parentPath.node.property.name === "length") {
            // args.length
            state.candidates.push({
              cause: "lengthGetter",
              path
            });
            return;
          }
        }
      } // we can only do these optimizations if the rest variable would match
      // the arguments exactly
      // optimise single spread args in calls
      // ex: fn(...args)


      if (state.offset === 0 && parentPath.isSpreadElement()) {
        const call = parentPath.parentPath;

        if (call.isCallExpression() && call.node.array.from(arguments).length === 1) {
          state.candidates.push({
            cause: "argSpread",
            path
          });
          return;
        }
      }

      state.references.push(path);
    }
  },

  /**
   * Deopt on use of a binding identifier with the same name as our rest param.
   *
   * See https://github.com/babel/babel/issues/2091
   */
  BindingIdentifier(path, state) {
    if (referencesRest(path, state)) {
      state.deopted = true;
    }
  }

};

function getParamsCount(node) {
  let count = node.params.length; // skip the first parameter if it is a TypeScript 'this parameter'

  if (count > 0 && _core.types.isIdentifier(node.params[0], {
    name: "this"
  })) {
    count -= 1;
  }

  return count;
}

function hasRest(node) {
  const length = node.params.length;
  return length > 0 && _core.types.isRestElement(node.params[length - 1]);
}

function optimiseIndexGetter(path, argsId, offset) {
  const offsetLiteral = _core.types.numericLiteral(offset);

  let index;
  const parent = path.parent;

  if (_core.types.isNumericLiteral(parent.property)) {
    index = _core.types.numericLiteral(parent.property.value + offset);
  } else if (offset === 0) {
    // Avoid unnecessary '+ 0'
    index = parent.property;
  } else {
    index = _core.types.binaryExpression("+", parent.property, _core.types.cloneNode(offsetLiteral));
  }

  const {
    scope,
    parentPath
  } = path;

  if (!scope.isPure(index)) {
    const temp = scope.generateUidIdentifierBasedOnNode(index);
    scope.push({
      id: temp,
      kind: "var"
    });
    parentPath.replaceWith(restIndexImpure({
      ARGUMENTS: argsId,
      OFFSET: offsetLiteral,
      INDEX: index,
      REF: _core.types.cloneNode(temp)
    }));
  } else {
    parentPath.replaceWith(restIndex({
      ARGUMENTS: argsId,
      OFFSET: offsetLiteral,
      INDEX: index
    }));
    const replacedParentPath = parentPath; // See if we can statically evaluate the first test (i.e. index < offset)
    // and optimize the AST accordingly.

    const offsetTestPath = replacedParentPath.get("test");
    const valRes = offsetTestPath.get("left").evaluate();

    if (valRes.confident) {
      if (valRes.value === true) {
        replacedParentPath.replaceWith(scope.buildUndefinedNode());
      } else {
        offsetTestPath.replaceWith(offsetTestPath.get("right"));
      }
    }
  }
}

function optimiseLengthGetter(path, argsId, offset) {
  if (offset) {
    path.parentPath.replaceWith(restLength({
      ARGUMENTS: argsId,
      OFFSET: _core.types.numericLiteral(offset)
    }));
  } else {
    path.replaceWith(argsId);
  }
}

function convertFunctionRest(path) {
  const {
    node,
    scope
  } = path;
  if (!hasRest(node)) return false;
  let rest = node.params.pop().argument;

  if (_core.types.isPattern(rest)) {
    const pattern = rest;
    rest = scope.generateUidIdentifier("ref");

    const declar = _core.types.variableDeclaration("let", [_core.types.variableDeclarator(pattern, rest)]);

    path.ensureBlock();
    node.body.body.unshift(declar);
  } else if (rest.name === "arguments") {
    scope.rename(rest.name);
  }

  const argsId = _core.types.identifier("arguments");

  const paramsCount = getParamsCount(node); // check and optimise for extremely common cases

  const state = {
    references: [],
    offset: paramsCount,
    argumentsNode: argsId,
    outerBinding: scope.getBindingIdentifier(rest.name),
    candidates: [],
    name: rest.name,
    deopted: false
  };
  path.traverse(memberExpressionOptimisationVisitor, state); // There are only "shorthand" references

  if (!state.deopted && !state.references.length) {
    for (const {
      path,
      cause
    } of state.candidates) {
      const clonedArgsId = _core.types.cloneNode(argsId);

      switch (cause) {
        case "indexGetter":
          optimiseIndexGetter(path, clonedArgsId, state.offset);
          break;

        case "lengthGetter":
          optimiseLengthGetter(path, clonedArgsId, state.offset);
          break;

        default:
          path.replaceWith(clonedArgsId);
      }
    }

    return true;
  }

  state.references.push(...state.candidates.map(({
    path
  }) => path));

  const start = _core.types.numericLiteral(paramsCount);

  const key = scope.generateUidIdentifier("key");
  const len = scope.generateUidIdentifier("len");
  let arrKey, arrLen;

  if (paramsCount) {
    // this method has additional params, so we need to subtract
    // the index of the current argument position from the
    // position in the array that we want to populate
    arrKey = _core.types.binaryExpression("-", _core.types.cloneNode(key), _core.types.cloneNode(start)); // we need to work out the size of the array that we're
    // going to store all the rest parameters
    //
    // we need to add a check to avoid constructing the array
    // with <0 if there are less arguments than params as it'll
    // cause an error

    arrLen = _core.types.conditionalExpression(_core.types.binaryExpression(">", _core.types.cloneNode(len), _core.types.cloneNode(start)), _core.types.binaryExpression("-", _core.types.cloneNode(len), _core.types.cloneNode(start)), _core.types.numericLiteral(0));
  } else {
    arrKey = _core.types.identifier(key.name);
    arrLen = _core.types.identifier(len.name);
  }

  const sharedVars = {
    ARGUMENTS: argsId,
    ARRAY: rest,
    LEN: len
  };
  const loopSetup = buildRestSetup({
    ARRAY_LEN: arrLen,
    ...sharedVars
  });
  const loop = buildRest({
    ARRAY_KEY: arrKey,
    START: start,
    KEY: key,
    ...sharedVars
  });

  if (state.deopted) {
    let target = node.body;
    target.body.unshift(loopSetup);
    target.body.unshift(loop);
  } else {
    let target = path.getEarliestCommonAncestorFrom(state.references).getStatementParent(); // don't perform the allocation inside a loop

    target.findParent(path => {
      if (path.isLoop()) {
        target = path;
      } else {
        // Stop crawling up if this is a function.
        return path.isFunction();
      }
    });
    target.insertBefore(loopSetup);
    target.insertBefore(loop);
  }

  return true;
}