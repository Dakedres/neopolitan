"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _helperPluginUtils = require("@babel/helper-plugin-utils");

var _pluginSyntaxObjectRestSpread = _interopRequireDefault(require("@babel/plugin-syntax-object-rest-spread"));

var _core = require("@babel/core");

var _pluginTransformParameters = require("@babel/plugin-transform-parameters");

var _helperCompilationTargets = require("@babel/helper-compilation-targets");

var _corejs2BuiltIns = _interopRequireDefault(require("@babel/compat-data/corejs2-built-ins"));

var _shouldStoreRHSInTemporaryVariable = _interopRequireDefault(require("./shouldStoreRHSInTemporaryVariable"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  isAssignmentPattern,
  isObjectProperty
} = _core.types; // @babel/types <=7.3.3 counts FOO as referenced in var { x: FOO }.
// We need to detect this bug to know if "unused" means 0 or 1 references.

if (!process.env.BABEL_8_BREAKING) {
  const node = _core.types.identifier("a");

  const property = _core.types.objectProperty(_core.types.identifier("key"), node);

  const pattern = _core.types.objectPattern([property]); // eslint-disable-next-line no-var


  var ZERO_REFS = _core.types.isReferenced(node, property, pattern) ? 1 : 0;
}

var _default = (0, _helperPluginUtils.declare)((api, opts) => {
  api.assertVersion(7);
  const targets = api.targets();
  const supportsObjectAssign = !(0, _helperCompilationTargets.isRequired)("es6.object.assign", targets, {
    compatData: _corejs2BuiltIns.default
  });
  const {
    useBuiltIns = supportsObjectAssign,
    loose = false
  } = opts;

  if (typeof loose !== "boolean") {
    throw new Error(".loose must be a boolean, or undefined");
  }

  const ignoreFunctionLength = api.assumption("ignoreFunctionLength") ?? loose;
  const objectRestNoSymbols = api.assumption("objectRestNoSymbols") ?? loose;
  const pureGetters = api.assumption("pureGetters") ?? loose;
  const setSpreadProperties = api.assumption("setSpreadProperties") ?? loose;

  function getExtendsHelper(file) {
    return useBuiltIns ? _core.types.memberExpression(_core.types.identifier("Object"), _core.types.identifier("assign")) : file.addHelper("extends");
  }

  function hasRestElement(path) {
    let foundRestElement = false;
    visitRestElements(path, restElement => {
      foundRestElement = true;
      restElement.stop();
    });
    return foundRestElement;
  }

  function hasObjectPatternRestElement(path) {
    let foundRestElement = false;
    visitRestElements(path, restElement => {
      if (restElement.parentPath.isObjectPattern()) {
        foundRestElement = true;
        restElement.stop();
      }
    });
    return foundRestElement;
  }

  function visitRestElements(path, visitor) {
    path.traverse({
      Expression(path) {
        const {
          parent,
          key
        } = path;

        if (isAssignmentPattern(parent) && key === "right" || isObjectProperty(parent) && parent.computed && key === "key") {
          path.skip();
        }
      },

      RestElement: visitor
    });
  }

  function hasSpread(node) {
    for (const prop of node.properties) {
      if (_core.types.isSpreadElement(prop)) {
        return true;
      }
    }

    return false;
  } // returns an array of all keys of an object, and a status flag indicating if all extracted keys
  // were converted to stringLiterals or not
  // e.g. extracts {keys: ["a", "b", "3", ++x], allLiteral: false }
  // from ast of {a: "foo", b, 3: "bar", [++x]: "baz"}


  function extractNormalizedKeys(node) {
    // RestElement has been removed in createObjectRest
    const props = node.properties;
    const keys = [];
    let allLiteral = true;
    let hasTemplateLiteral = false;

    for (const prop of props) {
      if (_core.types.isIdentifier(prop.key) && !prop.computed) {
        // since a key {a: 3} is equivalent to {"a": 3}, use the latter
        keys.push(_core.types.stringLiteral(prop.key.name));
      } else if (_core.types.isTemplateLiteral(prop.key)) {
        keys.push(_core.types.cloneNode(prop.key));
        hasTemplateLiteral = true;
      } else if (_core.types.isLiteral(prop.key)) {
        keys.push(_core.types.stringLiteral(String( //@ts-ignore prop.key can not be a NullLiteral
        prop.key.value)));
      } else {
        // @ts-expect-error private name has been handled by destructuring-private
        keys.push(_core.types.cloneNode(prop.key));
        allLiteral = false;
      }
    }

    return {
      keys,
      allLiteral,
      hasTemplateLiteral
    };
  } // replaces impure computed keys with new identifiers
  // and returns variable declarators of these new identifiers


  function replaceImpureComputedKeys(properties, scope) {
    const impureComputedPropertyDeclarators = [];

    for (const propPath of properties) {
      // PrivateName is handled in destructuring-private plugin
      const key = propPath.get("key");

      if (propPath.node.computed && !key.isPure()) {
        const name = scope.generateUidBasedOnNode(key.node);

        const declarator = _core.types.variableDeclarator(_core.types.identifier(name), key.node);

        impureComputedPropertyDeclarators.push(declarator);
        key.replaceWith(_core.types.identifier(name));
      }
    }

    return impureComputedPropertyDeclarators;
  }

  function removeUnusedExcludedKeys(path) {
    const bindings = path.getOuterBindingIdentifierPaths();
    Object.keys(bindings).forEach(bindingName => {
      const bindingParentPath = bindings[bindingName].parentPath;

      if (path.scope.getBinding(bindingName).references > (process.env.BABEL_8_BREAKING ? 0 : ZERO_REFS) || !bindingParentPath.isObjectProperty()) {
        return;
      }

      bindingParentPath.remove();
    });
  } //expects path to an object pattern


  function createObjectRest(path, file, objRef) {
    const props = path.get("properties");
    const last = props[props.length - 1];

    _core.types.assertRestElement(last.node);

    const restElement = _core.types.cloneNode(last.node);

    last.remove();
    const impureComputedPropertyDeclarators = replaceImpureComputedKeys(path.get("properties"), path.scope);
    const {
      keys,
      allLiteral,
      hasTemplateLiteral
    } = extractNormalizedKeys(path.node);

    if (keys.length === 0) {
      return [impureComputedPropertyDeclarators, restElement.argument, _core.types.callExpression(getExtendsHelper(file), [_core.types.objectExpression([]), _core.types.cloneNode(objRef)])];
    }

    let keyExpression;

    if (!allLiteral) {
      // map to toPropertyKey to handle the possible non-string values
      keyExpression = _core.types.callExpression(_core.types.memberExpression(_core.types.arrayExpression(keys), _core.types.identifier("map")), [file.addHelper("toPropertyKey")]);
    } else {
      keyExpression = _core.types.arrayExpression(keys);

      if (!hasTemplateLiteral && !_core.types.isProgram(path.scope.block)) {
        // Hoist definition of excluded keys, so that it's not created each time.
        const program = path.findParent(path => path.isProgram());
        const id = path.scope.generateUidIdentifier("excluded");
        program.scope.push({
          id,
          init: keyExpression,
          kind: "const"
        });
        keyExpression = _core.types.cloneNode(id);
      }
    }

    return [impureComputedPropertyDeclarators, restElement.argument, _core.types.callExpression(file.addHelper(`objectWithoutProperties${objectRestNoSymbols ? "Loose" : ""}`), [_core.types.cloneNode(objRef), keyExpression])];
  }

  function replaceRestElement(parentPath, paramPath, container) {
    if (paramPath.isAssignmentPattern()) {
      replaceRestElement(parentPath, paramPath.get("left"), container);
      return;
    }

    if (paramPath.isArrayPattern() && hasRestElement(paramPath)) {
      const elements = paramPath.get("elements");

      for (let i = 0; i < elements.length; i++) {
        replaceRestElement(parentPath, // @ts-expect-error Fixme: handle TSAsExpression
        elements[i], container);
      }
    }

    if (paramPath.isObjectPattern() && hasRestElement(paramPath)) {
      const uid = parentPath.scope.generateUidIdentifier("ref");

      const declar = _core.types.variableDeclaration("let", [_core.types.variableDeclarator(paramPath.node, uid)]);

      if (container) {
        container.push(declar);
      } else {
        parentPath.ensureBlock();
        parentPath.get("body").unshiftContainer("body", declar);
      }

      paramPath.replaceWith(_core.types.cloneNode(uid));
    }
  }

  return {
    name: "proposal-object-rest-spread",
    inherits: _pluginSyntaxObjectRestSpread.default.default,
    visitor: {
      // function a({ b, ...c }) {}
      Function(path) {
        const params = path.get("params");
        const paramsWithRestElement = new Set();
        const idsInRestParams = new Set();

        for (let i = 0; i < params.length; ++i) {
          const param = params[i];

          if (hasRestElement(param)) {
            paramsWithRestElement.add(i);

            for (const name of Object.keys(param.getBindingIdentifiers())) {
              idsInRestParams.add(name);
            }
          }
        } // if true, a parameter exists that has an id in its initializer
        // that is also an id bound in a rest parameter
        // example: f({...R}, a = R)


        let idInRest = false;

        const IdentifierHandler = function (path, functionScope) {
          const name = path.node.name;

          if (path.scope.getBinding(name) === functionScope.getBinding(name) && idsInRestParams.has(name)) {
            idInRest = true;
            path.stop();
          }
        };

        let i;

        for (i = 0; i < params.length && !idInRest; ++i) {
          const param = params[i];

          if (!paramsWithRestElement.has(i)) {
            if (param.isReferencedIdentifier() || param.isBindingIdentifier()) {
              IdentifierHandler(param, path.scope);
            } else {
              param.traverse({
                "Scope|TypeAnnotation|TSTypeAnnotation": path => path.skip(),
                "ReferencedIdentifier|BindingIdentifier": IdentifierHandler
              }, path.scope);
            }
          }
        }

        if (!idInRest) {
          for (let i = 0; i < params.length; ++i) {
            const param = params[i];

            if (paramsWithRestElement.has(i)) {
              replaceRestElement(path, param);
            }
          }
        } else {
          const shouldTransformParam = idx => idx >= i - 1 || paramsWithRestElement.has(idx);

          (0, _pluginTransformParameters.convertFunctionParams)(path, ignoreFunctionLength, shouldTransformParam, replaceRestElement);
        }
      },

      // adapted from transform-destructuring/src/index.js#pushObjectRest
      // const { a, ...b } = c;
      VariableDeclarator(path, file) {
        if (!path.get("id").isObjectPattern()) {
          return;
        }

        let insertionPath = path;
        const originalPath = path;
        visitRestElements(path.get("id"), path => {
          if (!path.parentPath.isObjectPattern()) {
            // Return early if the parent is not an ObjectPattern, but
            // (for example) an ArrayPattern or Function, because that
            // means this RestElement is an not an object property.
            return;
          }

          if ( // skip single-property case, e.g.
          // const { ...x } = foo();
          // since the RHS will not be duplicated
          (0, _shouldStoreRHSInTemporaryVariable.default)(originalPath.node.id) && !_core.types.isIdentifier(originalPath.node.init)) {
            // const { a, ...b } = foo();
            // to avoid calling foo() twice, as a first step convert it to:
            // const _foo = foo(),
            //       { a, ...b } = _foo;
            const initRef = path.scope.generateUidIdentifierBasedOnNode(originalPath.node.init, "ref"); // insert _foo = foo()

            originalPath.insertBefore(_core.types.variableDeclarator(initRef, originalPath.node.init)); // replace foo() with _foo

            originalPath.replaceWith(_core.types.variableDeclarator(originalPath.node.id, _core.types.cloneNode(initRef)));
            return;
          }

          let ref = originalPath.node.init;
          const refPropertyPath = [];
          let kind;
          path.findParent(path => {
            if (path.isObjectProperty()) {
              refPropertyPath.unshift(path);
            } else if (path.isVariableDeclarator()) {
              kind = path.parentPath.node.kind;
              return true;
            }
          });
          const impureObjRefComputedDeclarators = replaceImpureComputedKeys(refPropertyPath, path.scope);
          refPropertyPath.forEach(prop => {
            const {
              node
            } = prop;
            ref = _core.types.memberExpression(ref, _core.types.cloneNode(node.key), node.computed || _core.types.isLiteral(node.key));
          }); //@ts-expect-error: findParent can not apply assertions on result shape

          const objectPatternPath = path.findParent(path => path.isObjectPattern());
          const [impureComputedPropertyDeclarators, argument, callExpression] = createObjectRest(objectPatternPath, file, ref);

          if (pureGetters) {
            removeUnusedExcludedKeys(objectPatternPath);
          }

          _core.types.assertIdentifier(argument);

          insertionPath.insertBefore(impureComputedPropertyDeclarators);
          insertionPath.insertBefore(impureObjRefComputedDeclarators);
          insertionPath = insertionPath.insertAfter(_core.types.variableDeclarator(argument, callExpression))[0];
          path.scope.registerBinding(kind, insertionPath);

          if (objectPatternPath.node.properties.length === 0) {
            objectPatternPath.findParent(path => path.isObjectProperty() || path.isVariableDeclarator()).remove();
          }
        });
      },

      // taken from transform-destructuring/src/index.js#visitor
      // export var { a, ...b } = c;
      ExportNamedDeclaration(path) {
        const declaration = path.get("declaration");
        if (!declaration.isVariableDeclaration()) return;
        const hasRest = declaration.get("declarations").some(path => hasObjectPatternRestElement(path.get("id")));
        if (!hasRest) return;
        const specifiers = [];

        for (const name of Object.keys(path.getOuterBindingIdentifiers(true))) {
          specifiers.push(_core.types.exportSpecifier(_core.types.identifier(name), _core.types.identifier(name)));
        } // Split the declaration and export list into two declarations so that the variable
        // declaration can be split up later without needing to worry about not being a
        // top-level statement.


        path.replaceWith(declaration.node);
        path.insertAfter(_core.types.exportNamedDeclaration(null, specifiers));
      },

      // try {} catch ({a, ...b}) {}
      CatchClause(path) {
        const paramPath = path.get("param");
        replaceRestElement(path, paramPath);
      },

      // ({a, ...b} = c);
      AssignmentExpression(path, file) {
        const leftPath = path.get("left");

        if (leftPath.isObjectPattern() && hasRestElement(leftPath)) {
          const nodes = [];
          const refName = path.scope.generateUidBasedOnNode(path.node.right, "ref");
          nodes.push(_core.types.variableDeclaration("var", [_core.types.variableDeclarator(_core.types.identifier(refName), path.node.right)]));
          const [impureComputedPropertyDeclarators, argument, callExpression] = createObjectRest(leftPath, file, _core.types.identifier(refName));

          if (impureComputedPropertyDeclarators.length > 0) {
            nodes.push(_core.types.variableDeclaration("var", impureComputedPropertyDeclarators));
          }

          const nodeWithoutSpread = _core.types.cloneNode(path.node);

          nodeWithoutSpread.right = _core.types.identifier(refName);
          nodes.push(_core.types.expressionStatement(nodeWithoutSpread));
          nodes.push(_core.types.toStatement(_core.types.assignmentExpression("=", argument, callExpression)));
          nodes.push(_core.types.expressionStatement(_core.types.identifier(refName)));
          path.replaceWithMultiple(nodes);
        }
      },

      // taken from transform-destructuring/src/index.js#visitor
      ForXStatement(path) {
        const {
          node,
          scope
        } = path;
        const leftPath = path.get("left");
        const left = node.left;

        if (!hasObjectPatternRestElement(leftPath)) {
          return;
        }

        if (!_core.types.isVariableDeclaration(left)) {
          // for ({a, ...b} of []) {}
          const temp = scope.generateUidIdentifier("ref");
          node.left = _core.types.variableDeclaration("var", [_core.types.variableDeclarator(temp)]);
          path.ensureBlock();
          const body = path.node.body;

          if (body.body.length === 0 && path.isCompletionRecord()) {
            body.body.unshift(_core.types.expressionStatement(scope.buildUndefinedNode()));
          }

          body.body.unshift(_core.types.expressionStatement(_core.types.assignmentExpression("=", left, _core.types.cloneNode(temp))));
        } else {
          // for (var {a, ...b} of []) {}
          const pattern = left.declarations[0].id;
          const key = scope.generateUidIdentifier("ref");
          node.left = _core.types.variableDeclaration(left.kind, [_core.types.variableDeclarator(key, null)]);
          path.ensureBlock();
          const body = node.body;
          body.body.unshift(_core.types.variableDeclaration(node.left.kind, [_core.types.variableDeclarator(pattern, _core.types.cloneNode(key))]));
        }
      },

      // [{a, ...b}] = c;
      ArrayPattern(path) {
        const objectPatterns = [];
        visitRestElements(path, path => {
          if (!path.parentPath.isObjectPattern()) {
            // Return early if the parent is not an ObjectPattern, but
            // (for example) an ArrayPattern or Function, because that
            // means this RestElement is an not an object property.
            return;
          }

          const objectPattern = path.parentPath;
          const uid = path.scope.generateUidIdentifier("ref");
          objectPatterns.push(_core.types.variableDeclarator(objectPattern.node, uid));
          objectPattern.replaceWith(_core.types.cloneNode(uid));
          path.skip();
        });

        if (objectPatterns.length > 0) {
          const statementPath = path.getStatementParent();
          const statementNode = statementPath.node;
          const kind = statementNode.type === "VariableDeclaration" ? statementNode.kind : "var";
          statementPath.insertAfter(_core.types.variableDeclaration(kind, objectPatterns));
        }
      },

      // var a = { ...b, ...c }
      ObjectExpression(path, file) {
        if (!hasSpread(path.node)) return;

        let helper = _core.types.identifier('babelHelpers.objectSpread'); // if (setSpreadProperties) {
        //   helper = getExtendsHelper(file);
        // } else {
        //   try {
        //     helper = file.addHelper("objectSpread2");
        //   } catch {
        //     // TODO: This is needed to workaround https://github.com/babel/babel/issues/10187
        //     // and https://github.com/babel/babel/issues/10179 for older @babel/core versions
        //     // where #10187 isn't fixed.
        //     this.file.declarations["objectSpread2"] = null;
        //     // objectSpread2 has been introduced in v7.5.0
        //     // We have to maintain backward compatibility.
        //     helper = file.addHelper("objectSpread");
        //   }
        // }


        let exp = null;
        let props = [];

        function make() {
          const hadProps = props.length > 0;

          const obj = _core.types.objectExpression(props);

          props = [];

          if (!exp) {
            exp = _core.types.callExpression(helper, [obj]);
            return;
          } // When we can assume that getters are pure and don't depend on
          // the order of evaluation, we can avoid making multiple calls.


          if (pureGetters) {
            if (hadProps) {
              exp.arguments.push(obj);
            }

            return;
          }

          exp = _core.types.callExpression(_core.types.cloneNode(helper), [exp, // If we have static props, we need to insert an empty object
          // because the odd arguments are copied with [[Get]], not
          // [[GetOwnProperty]]
          ...(hadProps ? [_core.types.objectExpression([]), obj] : [])]);
        }

        for (const prop of path.node.properties) {
          if (_core.types.isSpreadElement(prop)) {
            make();
            exp.arguments.push(prop.argument);
          } else {
            props.push(prop);
          }
        }

        if (props.length) make();
        path.replaceWith(exp);
      }

    }
  };
});

exports.default = _default;