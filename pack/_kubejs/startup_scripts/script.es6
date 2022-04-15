// priority: 0

// Todo: Hide entire artifacts mod
// Reomve The One Probe
// Add immersive petroleum

console.info('Hello, World! (You will only see this line once in console, during startup)')

// let cons = {
// 	ropeBelt: Item.of('tetra:modular_toolbelt', {"toolbelt/belt_material":"belt/rope","toolbelt/belt":"toolbelt/belt","toolbelt/slot1":"toolbelt/strap_slot1","toolbelt/strap_slot1_material":"strap1/leather"})
// }

const materialFrom = (mod, ...names) =>
	(typeof names[0] == 'object' ? names[0] : names).map(name => new RegExp(`${mod}:(.*_|)${name}.*?$`) )

let ieForms = [
	'ingot',
	'plate',
	'dust',
	'sheetmetal',
	'slab_sheetmetal',
	'storage',
	'slab_storage'
]

let toRemove = [
	'kubejs:dummy_fluid_item', // why

	'immersiveengineering:lantern',
	'immersiveengineering:electric_lantern',
	'immersiveengineering:crate', // Obselete, supplementaries sack
	'immersiveengineering:reinforced_crate',
	'immersiveengineering:minecart_reinforcedcrate',
	'immersiveengineering:minecart_woodencrate',
	'immersiveengineering:toolbox', // Obselete, create
	// 'immersiveengineering:treated_post', // Promote creative block use
	// 'immersiveengineering:steel_post',
	// 'immersiveengineering:alu_post',
	'immersiveengineering:plate_copper', // Obselete, create
	'immersiveengineering:plate_iron',
	'immersiveengineering:plate_gold',
	/immersiveengineering:conveyor.+$/, // Obselete, create
	'immersiveengineering:alu_fence',
	...materialFrom('immersiveengineering', [
		'post',
		'wallmount',
		'constantan', // Replaced with constantan
		'nickel', // One use other than constantan, replaced with zinc
		'uranium', // Bloat
		// 'silver', // Bloat, replaced
		'slope',
		'alu_scaffolding', // Doesn't fit
		'metal_ladder'
	]),
	...[
		'ingot',
		'plate',
		'sword',
		'pickaxe',
		'axe',
		'shovel',
		'hoe',
		'storage'
	].map(n => `immersiveengineering:${n}_steel`),
	// Replaced with sunmetal/bronze
	...ieForms.map(n => `immersiveengineering:${n}_electrum`),
	...[
		'nugget',
		'ore',
		...ieForms
	].map(n => `immersiveengineering:${n}_silver`),
	'create:crushed_uranium_ore',
	'create:crushed_silver_ore',

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

	'#cavesandcliffs:candles', // Obselete
	'cavesandcliffs:spyglass',
	'darkerdepths:rope',
	// /enhanced_mushrooms:red_mushroom.+$/, // Bloat
	// /enhanced_mushrooms:brown_mushroom.+$/,
	// /enhanced_mushrooms:stripped_red_mushroom.+$/,
	// /enhanced_mushrooms:stripped_brown_mushroom.+$/,
	// /cavesandcliffs:.*?_boat$/,
	// 'endergetic:poised_boat',
	'endergetic:ender_torch',
	'muchmoremodcompat:bamboo_support',
	'muchmoremodcompat:bamboo_seat',
	'@curios',
	/^\w*:.*?_post$/, // no quark posts

	'cavesandcliffs:copper_ingot',
	'cavesandcliffs:copper_block',
	/cavesandcliffs:oxidized.+$/, // Obselete, create
	/cavesandcliffs:weathered.+$/,
	/cavesandcliffs:exposed.+$/,
	/cavesandcliffs:waxed.+$/,
	...materialFrom('cavesandcliffs', 'copper_ore'),
	
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
		'spiked'
		// TODO: Make buzzier bees' bears drop their hair, and rename it to fur
	]),
	'alexsmobs:warped_muscle',
	'alexsmobs:hummingbird_feeder',
	'alexsmobs:maggot',
	'alexsmobs:animal_dictionary',
  'alexsmobs:endolocator',
	'alexsmobs:animal_dictionary',

	...materialFrom('wyrmroost', 'geode', 'drake', 'platinum'),
  "wyrmroost:raw_behemoth_meat",
  "wyrmroost:raw_common_meat",
  "wyrmroost:raw_lowtier_meat",
  "wyrmroost:cooked_behemoth_meat",
  "wyrmroost:cooked_common_meat",
  "wyrmroost:cooked_desertwyrm",
  "wyrmroost:cooked_lowtier_meat",
	"wyrmroost:coin_dragon",
	"wyrmroost:desert_wyrm",

	// /^supplementaries:timber_/,
	// /^supplementaries:stone_/,
	// /^supplementaries:candelabra_/,
	'supplementaries:planter',
	'supplementaries:gold_gate',
	'supplementaries:flute', // Idk about it when Pitch Perfect already has one
	'supplementaries:pedestal',
	...materialFrom('supplementaries', [
		'tile',
		'lamp',
		'blackstone',
		'candelabra',
		'sconce'
	]),

	'chimes:carved_bamboo_chimes',
	'chimes:iron_chimes',

	...materialFrom('buzzier_bees', [
		'honeycomb_tile',
		'honeycomb_brick',
		'honeycomb_door', // cute but just, why?
		'honeycomb_trapdoor'
	]),
	'buzzier_bees:honey_apple', // Obselete via create
	
	'create:handheld_blockzapper', // Promote Psi
	'create:handheld_worldshaper',
	...materialFrom('create', [
		'limestone',
		'scoria',
		'layered',
		'overgrown' // Obselete, moss, ect
	]),
	/create:fancy_.*?_bricks/,
	
	// 'darkerdepths:silver_ingot', // Obselete, IE
	// 'darkerdepths:silver_ore',
	...materialFrom('darkerdepths', 'aridrock', 'silver'),

	...materialFrom('psi', 'psimetal'),

	...materialFrom('supplementaries', 'checker', 'daub', 'timber'),
	'supplementaries:brass_lantern',
	'supplementaries:cog_block',

	'@enchantwithmob'
]

let toHide = [
	/^\w*:spawn_egg_.*?$/, // Spawn eggs can spoil some mobs
	/^\w*:.*?_spawn_egg$/,
	'immersiveengineering:storage_copper', // Obselete, create
	'immersiveengineering:slab_storage_copper',
	'immersiveengineering:ingot_copper',
	'immersiveengineering:nugget_copper',
	'#quark:candles', // Disabled quark content
	// /quark:.*?_stained_planks$/,
	// /quark:(.*_|)marble.*?$/,
	// /quark:(.*_|)myalite.*?$/,
	// /quark:(.*_|)cobblestone_bricks.*?$/,
	// /quark:thatch.*?$/,
	...materialFrom('quark', [
		'stained_planks',
		'marble',
		'myalite',
		'midori',
		'duskbound',
		'brimstone',
		'elder_prismarine',
		'soul_sandstone',
		'permafrost',
		'biotite',
		'basalt', // (Voidstone)
		'limestone',
		'jasper',
		'slate',
		'granite', // More variants
		'andesite',
		'diorite',
		'cobblestone_bricks', // WHY SO MANY BRICKS
		'blackstone_bricks',
		'dirt_bricks',
		'sandy_bricks',
		'netherrack_bricks',
		'charred_nether_bricks',
		'magma_bricks',
		'blue_nether_bricks',
		'basalt_bricks',
		'quilted_wool',
		'bonded',
		'crate',
		'turf', // Obselete, moss
		'thatch', // Obselete, Decorative Blocks
		'pavement',
		'stool', // Obselete, create
		'slime', // Obselete, honey
		'lavender_blossom', // Don't like how these are like "shades"
		'yellow_blossom'
	]),
	'quark:gravisand', // why
	'quark:rope',
	'quark:weather_sensor',
	'#quark:shards',
	'quark:elder_sea_lantern',
	'quark:matrix_enchanter', // Should just be hidden anyway
	'endergetic:bolloom_crate',

	'minecraft:enchanted_book', // testing

	'pitchperfect:chimes', // Obselete, chimes

	'architects_palette:sunmetal_brick'
]

// let hiddenEnchants = [
// 	'allurement:reforming'
// ].map(e => Item.of('minecraft:enchanted_book').enchant('allurement:reforming', 1))

console.log(toHide)

let toClean = [
	'psi:cad_assembly_ivory_psimetal',
	'psi:cad_assembly_ebony_psimetal',
	// cons.ropeBelt,
	'quark:pipe',
	'#minecraft:instruments',
	'supplementaries:slingshot',
	'supplementaries:rope',
	'create:rope_pulley',
	'immersiveengineering:silver', // Amethyst Cartridge now
	// Sunmetal stuff. Why did I ever choose to do it this way
	{ id: 'immersiveengineering:crafting/ingot_electrum_to_nugget_electrum' },
	'#forge:nuggets/electrum',
	'architects_palette:sunmetal_block'
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

const openSet = set => {
	let out = []
	
	for(let i = 0; i < set.length; i++)
		out.push(set[i])
	
	return out
}

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

	recipe.remove({
		type: 'minecraft:smelting',
		input: 'immersiveengineering:ore_silver'
	})
})

// for(let mod of global.modStages) {
// 	toHide.push('@' + mod)
// }

onEvent('item.tags', tags => {
	const process = (a, v) => {
		return a.concat(Ingredient.of(v).getItemIds().toArray() )
	}

	tags.add('kubejs:disabled', toRemove.reduce(process, []) )
})

onEvent('jei.hide.items', event => {
	// for(let item of toHide.concat(toRemove).concat(toHide) ) {
	// 	event.hide(item)
	// }

	for(let item of toHide ) {
		event.hide(item)
	}

	event.hide('#kubejs:disabled')
})