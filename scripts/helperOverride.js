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