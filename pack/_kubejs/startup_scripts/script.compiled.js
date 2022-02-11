function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

// priority: 0
// Todo: Hide entire artifacts mod
// Reomve The One Probe
// Add immersive petroleum
console.info('Hello, World! (You will only see this line once in console, during startup)'); // let cons = {
// 	ropeBelt: Item.of('tetra:modular_toolbelt', {"toolbelt/belt_material":"belt/rope","toolbelt/belt":"toolbelt/belt","toolbelt/slot1":"toolbelt/strap_slot1","toolbelt/strap_slot1_material":"strap1/leather"})
// }

var materialFrom = function materialFrom(mod) {
  for (var _len = arguments.length, names = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    names[_key - 1] = arguments[_key];
  }

  return (typeof names[0] == 'object' ? names[0] : names).map(name => new RegExp("".concat(mod, ":(.*_|)").concat(name, ".*?$")));
};

var toRemove = ['immersiveengineering:lantern', 'immersiveengineering:electric_lantern', 'immersiveengineering:crate', // Obselete, supplementaries sack
'immersiveengineering:reinforced_crate', 'immersiveengineering:minecart_reinforcedcrate', 'immersiveengineering:minecart_woodencrate', 'immersiveengineering:toolbox', // Obselete, create
// 'immersiveengineering:treated_post', // Promote creative block use
// 'immersiveengineering:steel_post',
// 'immersiveengineering:alu_post',
'immersiveengineering:plate_copper', // Obselete, create
'immersiveengineering:plate_iron', 'immersiveengineering:plate_gold', /immersiveengineering:conveyor.+$/, // Obselete, create
'immersiveengineering:alu_fence'].concat(_toConsumableArray(materialFrom('immersiveengineering', ['post', 'wallmount', 'constantan', // Replaced with constantan
'nickel', // One use other than constantan, replaced with zinc
'uranium', // Bloat
'slope', 'alu_scaffolding'])), _toConsumableArray(['ingot', 'plate', 'sword', 'pickaxe', 'axe', 'shovel', 'hoe'].map(n => "immersiveengineering:".concat(n, "_steel"))), ['create:crushed_uranium_ore', 'decorative_blocks:lattice', // Too specific
'decorative_blocks:bar_panel', 'decorative_blocks:chain', 'decorative_blocks:chandelier', 'decorative_blocks:soul_chandelier', 'decorative_blocks_abnormals:ender_chandelier', 'decorative_winter:festive_chain', 'decorative_winter:wreath', 'muchmoremodcompat:ice_chain', 'muchmoremodcompat:gold_chain', 'muchmoremodcompat:glow_chandelier', '#cavesandcliffs:candles', // Obselete
'cavesandcliffs:spyglass', 'darkerdepths:rope', // /enhanced_mushrooms:red_mushroom.+$/, // Bloat
// /enhanced_mushrooms:brown_mushroom.+$/,
// /enhanced_mushrooms:stripped_red_mushroom.+$/,
// /enhanced_mushrooms:stripped_brown_mushroom.+$/,
// /cavesandcliffs:.*?_boat$/,
// 'endergetic:poised_boat',
'endergetic:ender_torch', 'muchmoremodcompat:bamboo_support', 'muchmoremodcompat:bamboo_seat', '@curios', /^\w*:.*?_post$/, // no quark posts
'cavesandcliffs:copper_ingot', 'cavesandcliffs:copper_block', /cavesandcliffs:oxidized.+$/, // Obselete, create
/cavesandcliffs:weathered.+$/, /cavesandcliffs:exposed.+$/, /cavesandcliffs:waxed.+$/], _toConsumableArray(materialFrom('cavesandcliffs', 'copper_ore')), _toConsumableArray(materialFrom('infernalexp', ['basalt_brick', // Obselete, create
'pressure_plate', // Why
'glowstone_brick', // Too much
'dimstone_brick', 'dullstone_brick', 'smooth_glowstone', 'smooth_dimstone', 'smooth_dullstone', 'soul_sand', 'soul_soil'])), ['infernalexp:glowsilk_bow'], _toConsumableArray(materialFrom('alexsmobs', ['blobfish', 'emu', 'hawk', 'leafcutter', 'komodo', 'lobster', 'hemolymph', 'shrimp', 'cockroach', 'gust', 'spiked' // TODO: Make buzzier bees' bears drop their hair, and rename it to fur
])), ['alexsmobs:warped_muscle', 'alexsmobs:hummingbird_feeder', 'alexsmobs:maggot', 'alexsmobs:animal_dictionary', 'alexsmobs:endolocator'], _toConsumableArray(materialFrom('wyrmroost', 'geode', 'drake', 'platinum')), ["wyrmroost:raw_behemoth_meat", "wyrmroost:raw_common_meat", "wyrmroost:raw_lowtier_meat", "wyrmroost:cooked_behemoth_meat", "wyrmroost:cooked_common_meat", "wyrmroost:cooked_desertwyrm", "wyrmroost:cooked_lowtier_meat", "wyrmroost:coin_dragon", "wyrmroost:desert_wyrm", // /^supplementaries:timber_/,
// /^supplementaries:stone_/,
// /^supplementaries:candelabra_/,
'supplementaries:planter', 'supplementaries:gold_gate', 'supplementaries:flute', // Idk about it when Pitch Perfect already has one
'supplementaries:pedestal'], _toConsumableArray(materialFrom('supplementaries', ['tile', 'lamp', 'blackstone', 'candelabra', 'sconce'])), ['chimes:carved_bamboo_chimes', 'chimes:iron_chimes'], _toConsumableArray(materialFrom('buzzier_bees', ['honeycomb_tile', 'honeycomb_brick', 'honeycomb_door', // cute but just, why?
'honeycomb_trapdoor'])), ['buzzier_bees:honey_apple', // Obselete via create
'create:handheld_blockzapper', // Promote Psi
'create:handheld_worldshaper'], _toConsumableArray(materialFrom('create', ['limestone', 'scoria'])), _toConsumableArray(materialFrom('darkerdepths', 'aridrock', 'silver')), _toConsumableArray(materialFrom('psi', 'psimetal')), _toConsumableArray(materialFrom('supplementaries', 'checker', 'daub', 'timber')), ['supplementaries:brass_lantern', 'supplementaries:cog_block']);
var toHide = [/^\w*:spawn_egg_.*?$/, // Spawn eggs can spoil some mobs
/^\w*:.*?_spawn_egg$/, 'immersiveengineering:storage_copper', // Obselete, create
'immersiveengineering:slab_storage_copper', 'immersiveengineering:ingot_copper', 'immersiveengineering:nugget_copper', '#quark:candles'].concat(_toConsumableArray(materialFrom('quark', ['stained_planks', 'marble', 'myalite', 'midori', 'duskbound', 'brimstone', 'elder_prismarine', 'soul_sandstone', 'permafrost', 'biotite', 'voidstone', 'limestone', 'jasper', 'slate', 'granite', // More variants
'andesite', 'diorite', 'cobblestone_bricks', // WHY SO MANY BRICKS
'blackstone_bricks', 'dirt_bricks', 'sandy_bricks', 'netherrack_bricks', 'charred_nether_bricks', 'magma_bricks', 'blue_nether_bricks', 'basalt_bricks', 'quilted_wool', 'bonded', 'crate', 'turf', // Obselete, moss
'thatch', // Obselete, Decorative Blocks
'pavement', 'stool', // Obselete, create
'slime', // Obselete, honey
'lavender_blossom', // Don't like how these are like "shades"
'yellow_blossom'])), ['quark:gravisand', // why
'quark:rope', '#quark:shards', 'quark:elder_sea_lantern', 'quark:matrix_enchanter', // Should just be hidden anyway
'endergetic:bolloom_crate', 'minecraft:enchanted_book', // testing
'pitchperfect:chimes' // Obselete, chimes
]); // let hiddenEnchants = [
// 	'allurement:reforming'
// ].map(e => Item.of('minecraft:enchanted_book').enchant('allurement:reforming', 1))

console.log(toHide);
var toClean = ['psi:cad_assembly_ivory_psimetal', 'psi:cad_assembly_ebony_psimetal', // cons.ropeBelt,
'quark:pipe', '#minecraft:instruments', 'supplementaries:slingshot', 'supplementaries:rope', 'create:rope_pulley']; // // Ore blocks to remove smelting recipes for
// let oreBlocks = [
// 	'immersiveengineering:aluminum_ore',
// 	'immersiveengineering:silver_ore',
// 	'immersiveengineering:lead_ore',
// 	'immersiveengineering:nickel_ore',
// ]
// let smeltingTypes = [
// 	'minecraft:smelting',
// 	'minecraft:blasting',
// 	'immersiveengineering:arc_furnace'
// ]

var openSet = set => {
  var out = [];

  for (var i = 0; i < set.length; i++) {
    out.push(set[i]);
  }

  return out;
};

onEvent('recipes', recipe => {
  var _iterator = _createForOfIteratorHelper(toClean.concat(toRemove)),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var item = _step.value;
      recipe.remove({
        output: item
      });
    } // for(let input of oreBlocks) {
    // 	smeltingTypes.forEach(type => {
    // 		recipe.remove({
    // 			input,
    // 			type
    // 		})
    // 	})
    // }

  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  recipe.remove({
    type: 'minecraft:smelting',
    input: 'immersiveengineering:ore_silver'
  });
}); // for(let mod of global.modStages) {
// 	toHide.push('@' + mod)
// }

onEvent('jei.hide.items', event => {
  var _iterator2 = _createForOfIteratorHelper(toHide.concat(toRemove).concat(toHide)),
      _step2;

  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var item = _step2.value;
      event.hide(item);
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
});