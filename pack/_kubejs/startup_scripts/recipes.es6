onEvent('recipes', recipe => {
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

	recipe.shaped('6x quark:pipe', [
		'P',
		'G',
		'P'
	], {
		P: '#forge:plates/steel',
		G: '#forge:glass'
	})

	const chimePattern = [
		'W',
		'S',
		'C'
	]

	recipe.shaped('chimes:copper_chimes', chimePattern, {
		W: '#minecraft:wooden_slabs',
		S: '#forge:string',
		C: '#forge:plates/copper'
	})

	recipe.shaped('chimes:amethyst_chimes', chimePattern, {
		W: '#forge:ingots/iron',
		S: '#forge:string',
		C: 'cavesandcliffs:amethyst_shard'
	})

	recipe.shaped(Item.of('supplementaries:slingshot', '{Damage:0}'), [
		'SHS',
		'RBR',
		' R '
	], {
		R: '#forge:rods/wooden',
		H: 'quark:ravager_hide',
		S: '#forge:string',
		B: '#forge:slimeballs'
	})

	recipe.shaped('supplementaries:rope', [
		'  H',
		' H ',
		'H  '
	], {
		H: '#forge:fiber_hemp'
	}),

	recipe.shaped('create:rope_pulley', [
		' C ',
		'SRS',
		' P '
	], {
		C: 'create:andesite_casing',
		S: 'create:shaft',
		R: '#supplementaries:ropes',
		P: '#forge:plates/iron'
	})

	// recipe.shaped(Item.of('alexsmobs:shield_of_the_deep', '{Damage:0}'), [
	// 	'TPT',
	// 	'PHP',
	// 	'TPT'
	// ], {
	// 	T: 'alexsmobs:shark_tooth',
	// 	P: 'minecraft:prismarine_bricks',
	// 	H: 'minecraft:heart_of_the_sea'
	// })

  // Decided against this
  //
  // const optimalSmelting = (type) => {
  //   recipe.custom({
  //     type: 'immersiveengineering:arc_furnace',
  //     results: {
  //       count: 2,
  //       "base_ingredient": {
  //         tag: `forge:ingots/${type}`
  //       }
  //     },
  //     input: {
  //       tag: `create:crushed_${type}_ore`
  //     },
  //     additives: [
  //       // {
  //       //   tag: `forge:nuggets/${type}`
  //       // }
  //     ],
  //     time: 100,
  //     energy: 204800
  //   })
  // }

  // optimalSmelting('silver')

// 	 __  __ _                      _     
//  |  \/  (_)                    | |    
//  | \  / |_ _ __   ___ _ __ __ _| |___ 
//  | |\/| | | '_ \ / _ \ '__/ _` | / __|
//  | |  | | | | | |  __/ | | (_| | \__ \
//  |_|  |_|_|_| |_|\___|_|  \__,_|_|___/

})