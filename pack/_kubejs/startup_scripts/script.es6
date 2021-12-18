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

let toRemove = [
	'immersiveengineering:lantern',
	'immersiveengineering:electric_lantern',
	'immersiveengineering:crate', // Obselete, shulker
	'immersiveengineering:reinforced_crate',
	'immersiveengineering:minecart_reinforcedcrate',
	'immersiveengineering:minecart_woodencrate',
	'immersiveengineering:toolbox',
	'immersiveengineering:treated_post', // Promote creative block use
	'immersiveengineering:steel_post',
	'immersiveengineering:alu_post',
	/immersiveengineering:.*?_uranium$/, // Bloat
	'create:crushed_uranium_ore',
	'immersiveengineering:plate_copper', // Obselete, create
	'immersiveengineering:plate_iron',
	'immersiveengineering:plate_gold',
	/immersiveengineering:conveyor.+$/, // Obselete, create
	'decorative_blocks:lattice', // Too specific
	'decorative_blocks:bar_panel',
	'decorative_blocks:chain',
	'decorative_blocks:chandelier',
	'decorative_blocks:soul_chandelier',
	'decorative_blocks_abnormals:ender_chandelier',
	'muchmoremodcompat:ice_chain',
	'muchmoremodcompat:gold_chain',
	'muchmoremodcompat:glow_chandelier',
	'supplementaries:brass_lantern',
	'create:handheld_blockzapper', // Promote Psi
	'create:handheld_worldshaper',
	'#cavesandcliffs:candles', // Obselete
	'cavesandcliffs:spyglass',
	'darkerdepths:rope',
	/enhanced_mushrooms:red_mushroom.+$/, // Bloat
	/enhanced_mushrooms:brown_mushroom.+$/,
	/enhanced_mushrooms:stripped_red_mushroom.+$/,
	/enhanced_mushrooms:stripped_brown_mushroom.+$/,
	/cavesandcliffs:.*?_boat$/,
	'endergetic:poised_boat',
	'muchmoremodcompat:bamboo_support',
	'muchmoremodcompat:bamboo_seat',
	'@curios',
	'@adpoles',
	/cavesandcliffs:oxidized.+$/, // Obselete, create
	/cavesandcliffs:weathered.+$/,
	/cavesandcliffs:exposed.+$/,
	/cavesandcliffs:waxed.+$/,
	'darkerdepths:silver_ingot', // Obselete, IE
	'darkerdepths:silver_ore',
	'pitchperfect:chimes', // Obselete, chimes
	/^\w*:.*?_post$/, // no quark posts
	...materialFrom('infernalexp', 'basalt') // Obselete, create
]

let toHide = [
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
		'voidstone',
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
	'quark:gravisand',
	'quark:elder_sea_lantern'
]

console.log(toHide)

let toClean = [
	'psi:cad_assembly_ivory_psimetal',
	'psi:cad_assembly_ebony_psimetal',
	// cons.ropeBelt,
	'quark:pipe'
]

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
	
	let cadPattern = [
	  'R  ',
	  'SIS',
	  '  L'
	]
	
	recipe.shaped('psi:cad_assembly_ivory_psimetal', cadPattern, {
	  S: 'psi:ivory_substance',
	  I: '#forge:ingots/psimetal',
	  R: 'create:refined_radiance',
  	L: 'minecraft:stripped_birch_log'	  
	})
	
	recipe.shaped('psi:cad_assembly_ebony_psimetal', cadPattern, {
	  S: 'psi:ebony_substance',
	  I: '#forge:ingots/psimetal',
	  R: 'create:refined_radiance',
    L: 'minecraft:stripped_dark_oak_log' 
	})
	
	// recipe.shaped(cons.ropeBelt, [
	//   'RR '
	// ], {
	//   R: '#supplementaries:ropes'
	// })

	recipe.shaped('4x quark:pipe', [
		'P',
		'G',
		'P'
	], {
		P: '#forge:plates/nickel',
		G: '#forge:glass'
	})
})

// for(let mod of global.modStages) {
// 	toHide.push('@' + mod)
// }

onEvent('jei.hide.items', event => {
	for(let item of toHide.concat(toRemove) ) {
		event.hide(item)
	}
})