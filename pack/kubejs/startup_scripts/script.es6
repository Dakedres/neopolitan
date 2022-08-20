{

// priority: 0

let toRemove = [
	'kubejs:dummy_fluid_item', // why

	// 'create:crushed_uranium_ore',
	// 'create:crushed_silver_ore',

	'decorative_blocks:lattice', // Too specific
	'decorative_blocks:bar_panel',
	'decorative_blocks:chain',
	'decorative_blocks:chandelier',
	'decorative_blocks:soul_chandelier',
	'decorative_blocks_abnormals:ender_chandelier',
	'decorative_winter:festive_chain',
	'decorative_winter:wreath',

	'muchmoremodcompat:ice_chain',
	'muchmoremodcompat:gold_chain',
	'muchmoremodcompat:glow_chandelier',

	'darkerdepths:rope',
	// /enhanced_mushrooms:red_mushroom.+$/, // Bloat
	// /enhanced_mushrooms:brown_mushroom.+$/,
	// /enhanced_mushrooms:stripped_red_mushroom.+$/,
	// /enhanced_mushrooms:stripped_brown_mushroom.+$/,
	// 'endergetic:poised_boat',
	'endergetic:ender_torch',
	'muchmoremodcompat:bamboo_support',
	'muchmoremodcompat:bamboo_seat',
	// '@curios',
	/^\w*:.*?_post$/, // no quark posts
	
	...materialFrom('infernalexp', [
		'basalt_brick', // Obselete, create
		'pressure_plate', // Why
		'glowstone_brick', // Too much
		'dimstone_brick',
		'dullstone_brick',
		'smooth_glowstone',
		'smooth_dimstone',
		'smooth_dullstone',
		'soul_sand',
		'soul_soil'
	]), 
	'infernalexp:glowsilk_bow', // Broken?

	...materialFrom('alexsmobs', [
		'blobfish',
		'emu',
		'hawk',
		'leafcutter',
		'komodo',
		'lobster',
		'hemolymph',
		'shrimp',
		'cockroach',
		'gust',
		'spiked',
		'fish_oil',
		'flutter',
		'froststalker',
		'terrapin',
		'frilled_shark',
		'mungal',
		'roadrunner',
		'straddlite'
		// TODO: Make naturalist bears drop their hair, and rename it to fur
	]),
	'alexsmobs:serrated_shark_tooth',
	'alexsmobs:straddleboard', // Makes obselete more creative gameplay
	'alexsmobs:flying_fish_boots', // Maybe as an enchantment
	'alexsmobs:warped_muscle',
	'alexsmobs:hemolymph_blaster',
	'alexsmobs:blood_sprayer',
	'alexsmobs:hummingbird_feeder',
	'alexsmobs:maggot',
	'alexsmobs:animal_dictionary',
  'alexsmobs:endolocator',
	'alexsmobs:animal_dictionary',
	'alexsmobs:void_worm_effigy', // Just kinda bloaty
	'alexsmobs:pocket_sand',
	'alexsmobs:warped_mixture',

	// ...materialFrom('wyrmroost', 'geode', 'drake', 'platinum'),
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
	'supplementaries:planter',
	'supplementaries:gold_gate',
	'supplementaries:flute', // Idk about it when Pitch Perfect already has one
	'supplementaries:pedestal',
	'supplementaries:brass_lantern',
	'supplementaries:cog_block',
	'supplementaries:candy',
	...materialFrom('supplementaries', [
		'tile',
		'checker',
		'daub',
		'timber',
		'lamp',
		'blackstone',
		'candelabra',
		'sconce',
		'ash'
	]),

	...materialFrom('naturalist', 'venison'),
	...itemFrom('naturalist', [
		'chrysalis',
		'antler'
	]),

	'chimes:carved_bamboo_chimes',
	'chimes:iron_chimes',

	'create:handheld_blockzapper', // Promote Psi
	'create:handheld_worldshaper',
	'create:redstone_link', // Use beams or something
	'create:linked_controller',
	'create:cuckoo_clock', // Both bloat, emphasize more redstone
	'create:clockwork_bearing',
	'create:sequenced_gearshift', // Prioritize more big brain
	// 'create:rotation_speed_controller', // Ditto but this might cause issues idk\
	// TODO: Make sure removed stuff generates properly
	...materialFrom('create', [
		'zinc', // Replaced with lead
		'tuff', // Architect's palette got us
		'calcite',
		'limestone',
		'diorite',
		'andesite',
		'granite',
		'deepslate',
		'scorcia',
		'copper_tile',
		// 'scoria',
		'layered',
		'creative'
	]),
	/create:fancy_.*?_bricks/,

	// ...materialFrom('ecologics', 'azalea'),
	// ...forMods([
	// 	'immersive_weathering',
	// 	'supplementaries',
	// 	'everycomp'
	// ], materialFrom, [
	// 	'ecologics'
	// ])

	// ...materialFrom('psi', 'psimetal'),
	// 'pitchperfect:chimes', // Obselete, chimes

	// '@enchantwithmob',

	'berry_good:music_disc_fox',

	'oreganized:music_disc_pillaged',
	'oreganized:electrum_nugget', // Bloaty
	'oreganized:netherite_nugget'
]

global.toHide = [
	/^\w*:spawn_egg_.*?$/, // Spawn eggs can spoil some mobs
	/^\w*:.*?_spawn_egg$/,

	// ...materialFrom('quark', [
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

	'alexsmobs:novelty_hat',

	'supplementaries:pancake_disc',

	'#kubejs:disabled'
]

// let hiddenEnchants = [
// 	'allurement:reforming'
// ].map(e => Item.of('minecraft:enchanted_book').enchant('allurement:reforming', 1))

let toClean = [
	// 'psi:cad_assembly_ivory_psimetal',
	// 'psi:cad_assembly_ebony_psimetal',
	// cons.ropeBelt,
	'quark:pipe',
	'#minecraft:instruments',
	'supplementaries:slingshot',
	'supplementaries:rope',
	'create:rope_pulley',
	// 'immersiveengineering:silver', // Amethyst Cartridge now
	// Sunmetal stuff. Why did I ever choose to do it this way
	// { id: 'immersiveengineering:crafting/ingot_electrum_to_nugget_electrum' },
	// '#forge:nuggets/electrum',
	'alexsmobs:maraca'
]

// // Ore blocks to remove smelting recipes for
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

// const openSet = set => {
// 	let out = []
	
// 	for(let i = 0; i < set.length; i++)
// 		out.push(set[i])
	
// 	return out
// }

onEvent('recipes', recipe => {
	for(let item of toClean.concat(toRemove) ) {
	  	recipe.remove({ output: item })
	}

	// for(let input of oreBlocks) {
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
})

onEvent('item.tags', tags => {
	tags.add('kubejs:disabled', getItemIds(toRemove) )
})

onEvent('recipes', recipe => {
	// recipe.remove('#kubejs:disabled')
})

}