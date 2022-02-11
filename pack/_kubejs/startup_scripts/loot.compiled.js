function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var instrumentTables = {
  minecraft: ["abandoned_mineshaft", "bastion_bridge", "bastion_hoglin_stable", "bastion_other", "bastion_treasure", "buried_treasure", "desert_pyramid", "end_city_treasure", "igloo_chest", "jungle_temple_dispenser", "jungle_temple", "nether_bridge", "pillager_outpost", "ruined_portal", "shipwreck_map", "shipwreck_supply", "shipwreck_treasure", "simple_dungeon", "spawn_bonus_chest", "stronghold_corridor", "stronghold_crossing", "stronghold_library", "underwater_ruin_big", "underwater_ruin_small", "village", "woodland_mansion"]
};

var createMapper = mod => name => "".concat(mod, ":chests/").concat(name);

var tables = ['minecraft:chests/igloo_chest']; // for(let mod in instrumentTables)
//   tables = tables.concat(instrumentTables[mod].map(createMapper(mod) ) )

console.log(tables);
onEvent('chest.loot_tables', event => {
  var _iterator = _createForOfIteratorHelper(tables),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var path = _step.value;
      event.modify(path, table => {
        table.addPool(pool => {
          pool.rolls = 20; // pool.addEntry({
          //   type: "tag",
          //   weight: 100,
          //   name: "minecraft:instruments"
          // })

          pool.addEntry({
            "type": "minecraft:item",
            "weight": 15,
            "name": "minecraft:music_disc_13"
          });
        });
      });
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
});