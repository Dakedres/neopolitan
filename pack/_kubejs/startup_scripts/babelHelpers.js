// priority: 1

(function (global) {
  var babelHelpers = global.babelHelpers = {};

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  babelHelpers.defineProperty = _defineProperty;

  function _toConsumableArray(arr) {
    return babelHelpers.arrayWithoutHoles(arr) || babelHelpers.iterableToArray(arr) || babelHelpers.unsupportedIterableToArray(arr) || babelHelpers.nonIterableSpread();
  }

  babelHelpers.toConsumableArray = _toConsumableArray;

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return babelHelpers.arrayLikeToArray(arr);
  }

  babelHelpers.arrayWithoutHoles = _arrayWithoutHoles;

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
  }

  babelHelpers.iterableToArray = _iterableToArray;

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return babelHelpers.arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return babelHelpers.arrayLikeToArray(o, minLen);
  }

  babelHelpers.unsupportedIterableToArray = _unsupportedIterableToArray;

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  babelHelpers.nonIterableSpread = _nonIterableSpread;
})(typeof global === "undefined" ? self : global);

(() => {
  // Pulled from: @babel/babel-helpers/src/helpers/objectSpread2.js
  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) {
        symbols = symbols.filter(function (sym) {
          return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        });
      }
      keys.push.apply(keys, symbols);
    }
    return keys;
  }

  const override = {
    arrayLikeToArray: function(arr, len) {
      if (len == null || len > arr.length) len = arr.length;
      var arr2 = new Array(len);
      for (var i = 0; i < len; i++) arr2[i] = arr[i];
      return arr2;
    },
    
    // Modified from: @babel/babel-helpers/src/helpers/objectSpread2.js
    objectSpread: function(target) {
      for (var i = 1; i < Array.from(arguments).length; i++) {
        var source = arguments[i] != null ? arguments[i] : {};
        if (i % 2) {
          ownKeys(Object(source), true).forEach(function (key) {
            babelHelpers.defineProperty(target, key, source[key]);
          });
        } /* else if (Object.getOwnPropertyDescriptors) {
          Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
        } */ else {
          ownKeys(Object(source)).forEach(function (key) {
            Object.defineProperty(
              target,
              key,
              Object.getOwnPropertyDescriptor(source, key)
            );
          });
        }
      }
      return target;
    }
    
  }

  // for(let key in override)
  //   global.babelHelpers[key] = override[key]

  global.babelHelpers = Object.assign(global.babelHelpers, override)
})();

var babelHelpers = global.babelHelpers