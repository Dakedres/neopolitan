// priority: 0

/*
  The following script has been compiled with Babel, if you wish to make any edits, clone https://github.com/dakedres/neopolitan-mc and
    follow the instructions provided in the "Script compilation" section of the readme.
*/

// priority: 0
// Todo: Hide entire artifacts mod
// Reomve The One Probe
// Add immersive petroleum
console.info('Hello, World! (You will only see this line once in console, during startup)'); // let cons = {
// 	ropeBelt: Item.of('tetra:modular_toolbelt', {"toolbelt/belt_material":"belt/rope","toolbelt/belt":"toolbelt/belt","toolbelt/slot1":"toolbelt/strap_slot1","toolbelt/strap_slot1_material":"strap1/leather"})
// }

var dynArray = items => typeof items[0] == 'object' ? items[0] : items;

var materialFrom = function (mod) {
  var _len = Array.from(arguments).length,
      names = new Array(_len > 1 ? _len - 1 : 0);

  for (var _key = 1; _key < _len; _key++) {
    names[_key - 1] = arguments[_key];
  }

  return dynArray(names).map(name => new RegExp(`${mod}:(.*[\/_]|)${name}.*?$`));
};

var itemFrom = function (mod) {
  var _len2 = Array.from(arguments).length,
      names = new Array(_len2 > 1 ? _len2 - 1 : 0);

  for (var _key2 = 1; _key2 < _len2; _key2++) {
    names[_key2 - 1] = arguments[_key2];
  }

  return dynArray(names).map(name => mod + ':' + name);
};

var forMods = function (mods, func) {
  var out = [];
  var _len3 = Array.from(arguments).length,
      args = new Array(_len3 > 2 ? _len3 - 2 : 0);

  for (var _key3 = 2; _key3 < _len3; _key3++) {
    args[_key3 - 2] = arguments[_key3];
  }

  for (var mod of mods) {
    out = out.concat(func.apply(void 0, [mod].concat(args)));
  }

  return out;
};

var toRemove = ['kubejs:dummy_fluid_item', // why
// 'create:crushed_uranium_ore',
// 'create:crushed_silver_ore',
'decorative_blocks:lattice', // Too specific
'decorative_blocks:bar_panel', 'decorative_blocks:chain', 'decorative_blocks:chandelier', 'decorative_blocks:soul_chandelier', 'decorative_blocks_abnormals:ender_chandelier', 'decorative_winter:festive_chain', 'decorative_winter:wreath', 'muchmoremodcompat:ice_chain', 'muchmoremodcompat:gold_chain', 'muchmoremodcompat:glow_chandelier', 'darkerdepths:rope', // /enhanced_mushrooms:red_mushroom.+$/, // Bloat
// /enhanced_mushrooms:brown_mushroom.+$/,
// /enhanced_mushrooms:stripped_red_mushroom.+$/,
// /enhanced_mushrooms:stripped_brown_mushroom.+$/,
// 'endergetic:poised_boat',
'endergetic:ender_torch', 'muchmoremodcompat:bamboo_support', 'muchmoremodcompat:bamboo_seat', // '@curios',
/^\w*:.*?_post$/].concat(babelHelpers.toConsumableArray(materialFrom('alexsmobs', ['blobfish', 'emu', 'hawk', 'leafcutter', 'komodo', 'lobster', 'hemolymph', 'shrimp', 'cockroach', 'gust', 'spiked', 'fish_oil', 'flutter', 'froststalker', 'terrapin', 'frilled_shark', 'mungal', 'roadrunner' // TODO: Make buzzier bees' bears drop their hair, and rename it to fur
])), ['alexsmobs:serrated_shark_tooth', 'alexsmobs:straddleboard', // Makes obselete more creative gameplay
'alexsmobs:flying_fish_boots', // Maybe as an enchantment
'alexsmobs:warped_muscle', 'alexsmobs:hemolymph_blaster', 'alexsmobs:blood_sprayer', 'alexsmobs:hummingbird_feeder', 'alexsmobs:maggot', 'alexsmobs:animal_dictionary', 'alexsmobs:endolocator', 'alexsmobs:animal_dictionary', 'alexsmobs:void_worm_effigy', // Just kinda bloaty
'alexsmobs:pocket_sand', 'alexsmobs:warped_mixture', // ...materialFrom('wyrmroost', 'geode', 'drake', 'platinum'),
// "wyrmroost:raw_behemoth_meat",
// "wyrmroost:raw_common_meat",
// "wyrmroost:raw_lowtier_meat",
// "wyrmroost:cooked_behemoth_meat",
// "wyrmroost:cooked_common_meat",
// "wyrmroost:cooked_desertwyrm",
// "wyrmroost:cooked_lowtier_meat",
// "wyrmroost:coin_dragon",
// "wyrmroost:desert_wyrm",
// /^supplementaries:timber_/,
// /^supplementaries:stone_/,
// /^supplementaries:candelabra_/,
'supplementaries:planter', 'supplementaries:gold_gate', 'supplementaries:flute', // Idk about it when Pitch Perfect already has one
'supplementaries:pedestal', 'supplementaries:brass_lantern', 'supplementaries:cog_block', 'supplementaries:candy'], babelHelpers.toConsumableArray(materialFrom('supplementaries', ['tile', 'checker', 'daub', 'timber', 'lamp', 'blackstone', 'candelabra', 'sconce'])), babelHelpers.toConsumableArray(materialFrom('naturalist', 'venison')), babelHelpers.toConsumableArray(itemFrom('naturalist', ['chrysalis', 'antler'])), ['chimes:carved_bamboo_chimes', 'chimes:iron_chimes', 'create:handheld_blockzapper', // Promote Psi
'create:handheld_worldshaper', 'create:redstone_link', // Use beams or something
'create:linked_controller', 'create:cuckoo_clock', // Both bloat, emphasize more redstone
'create:clockwork_bearing', 'create:sequenced_gearshift'], babelHelpers.toConsumableArray(materialFrom('create', ['creative', 'limestone', 'scoria', 'layered', 'overgrown' // Obselete, moss, ect
])), [/create:fancy_.*?_bricks/ // ...materialFrom('ecologics', 'azalea'),
// ...forMods([
// 	'immersive_weathering',
// 	'supplementaries',
// 	'everycomp'
// ], materialFrom, [
// 	'ecologics'
// ])
// ...materialFrom('psi', 'psimetal'),
// 'pitchperfect:chimes', // Obselete, chimes
// '@enchantwithmob'
]);
var toHide = [/^\w*:spawn_egg_.*?$/, // Spawn eggs can spoil some mobs
/^\w*:.*?_spawn_egg$/, // ...materialFrom('quark', [
// 	'stained_planks',
// 	'marble',
// 	'myalite',
// 	'midori',
// 	'duskbound',
// 	'brimstone',
// 	'elder_prismarine',
// 	'soul_sandstone',
// 	'permafrost',
// 	'biotite',
// 	'basalt', // (Voidstone)
// 	'limestone',
// 	'jasper',
// 	'slate',
// 	'granite', // More variants
// 	'andesite',
// 	'diorite',
// 	'cobblestone_bricks', // WHY SO MANY BRICKS
// 	'blackstone_bricks',
// 	'dirt_bricks',
// 	'sandy_bricks',
// 	'netherrack_bricks',
// 	'charred_nether_bricks',
// 	'magma_bricks',
// 	'blue_nether_bricks',
// 	'basalt_bricks',
// 	'quilted_wool',
// 	'bonded',
// 	'crate',
// 	'turf', // Obselete, moss
// 	'thatch', // Obselete, Decorative Blocks
// 	'pavement',
// 	'stool', // Obselete, create
// 	'slime', // Obselete, honey
// 	'lavender_blossom', // Don't like how these are like "shades"
// 	'yellow_blossom'
// ]),
// 'quark:gravisand', // why
// 'quark:rope',
// 'quark:weather_sensor',
// '#quark:shards',
// 'quark:elder_sea_lantern',
// 'quark:matrix_enchanter', // Should just be hidden anyway
// 'endergetic:bolloom_crate',
'minecraft:enchanted_book', // testing
'architects_palette:sunmetal_brick', 'alexsmobs:novelty_hat']; // let hiddenEnchants = [
// 	'allurement:reforming'
// ].map(e => Item.of('minecraft:enchanted_book').enchant('allurement:reforming', 1))

console.log(toHide);
var toClean = [// 'psi:cad_assembly_ivory_psimetal',
// 'psi:cad_assembly_ebony_psimetal',
// cons.ropeBelt,
'quark:pipe', '#minecraft:instruments', 'supplementaries:slingshot', 'supplementaries:rope', 'create:rope_pulley', // 'immersiveengineering:silver', // Amethyst Cartridge now
// Sunmetal stuff. Why did I ever choose to do it this way
// { id: 'immersiveengineering:crafting/ingot_electrum_to_nugget_electrum' },
// '#forge:nuggets/electrum',
'architects_palette:sunmetal_block', 'alexsmobs:maraca']; // // Ore blocks to remove smelting recipes for
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
  for (var item of toClean.concat(toRemove)) {
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
  // recipe.remove({
  // 	type: 'minecraft:smelting',
  // 	input: 'immersiveengineering:ore_silver'
  // })

}); // for(let mod of global.modStages) {
// 	toHide.push('@' + mod)
// }

onEvent('item.tags', tags => {
  var process = (a, v) => {
    return a.concat(Ingredient.of(v).getItemIds().toArray());
  };

  tags.add('kubejs:disabled', toRemove.reduce(process, []));
});
onEvent('jei.hide.items', event => {
  // for(let item of toHide.concat(toRemove).concat(toHide) ) {
  // 	event.hide(item)
  // }
  for (var item of toHide) {
    event.hide(item);
  }

  event.hide('#kubejs:disabled');
});