function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var ores = [];

var addOre = (idName, displayName, tag) => {
  ores.push({
    id: "kubejs:raw_".concat(displayName.toLowerCase(), "_ore"),
    idName: idName,
    displayName: displayName,
    tag: tag
  });
};

addOre('aluminum', 'bauxite', 'forge:ores/aluminum');
addOre('lead', 'Lead', 'forge:ores/lead'); // addOre('nickel', 'Nickel', 'forge:ores/nickel')

addOre('silver', 'Silver', 'forge:ores/silver');
onEvent('item.registry', event => {
  var _iterator = _createForOfIteratorHelper(ores),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var _step$value = _step.value,
          id = _step$value.id,
          idName = _step$value.idName,
          displayName = _step$value.displayName;
      event.create(id).displayName("Raw ".concat(displayName, " Ore")).texture("neo:item/metal_raw_".concat(idName));
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
});
onEvent('item.tags', event => {
  var _iterator2 = _createForOfIteratorHelper(ores),
      _step2;

  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var _step2$value = _step2.value,
          id = _step2$value.id,
          tag = _step2$value.tag;
      event.add(tag, id);
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
});