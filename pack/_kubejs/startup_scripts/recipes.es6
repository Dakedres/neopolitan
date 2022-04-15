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

	const proxyStonecutting = (to, from) => {
		let baseCount = Item.of(to).getCount(),
				type = "minecraft:stonecutting"

		recipe.forEachRecipe({
			type
		}, original => {
			let input = original.inputItems.get(0)

			if(!input.test(to) )
				return

			let json = original.json,
					custom = {
				type,
				ingredient: [
					Ingredient.of(from).toJson()
				],
				result: json.get('result'),
				count: json.get('count').getAsInt() * baseCount,
				// count: baseResult.count * json.get('count').getAsInt(),
				conditions: json.get('conditions')
			}

			recipe.custom(custom)
		})

		recipe.stonecutting(to, from)
	}

	// proxyStonecutting('3x architects_palette:sunmetal_block', 'alloyed:bronze_ingot')

// 	 __  __ _                      _     
//  |  \/  (_)                    | |    
//  | \  / |_ _ __   ___ _ __ __ _| |___ 
//  | |\/| | | '_ \ / _ \ '__/ _` | / __|
//  | |  | | | | | |  __/ | | (_| | \__ \
//  |_|  |_|_|_| |_|\___|_|  \__,_|_|___/

	;[
		'immersiveengineering:arc_furnace',
		'immersiveengineering:alloy',
		'create:mixing'
	].forEach(type => {
		recipe.remove({
			type,
			output: '#forge:ingots/bronze'
		})	
	})

	// recipe.remove({
	// 	type: 'create:mixing',
	// 	output: '#forge:ingots/electrum'
	// })	

	const toIngredient = exp =>
		Ingredient.of(exp).toJson()

	const manyOf = (string, count) =>
		new Array(count).fill(string)

	const alloyMixing = (results, inp) => {
		recipe.custom({
			type: 'create:mixing',
			ingredients: inp.map(toIngredient),
			results,
			heatRequirement: 'heated'
		})
	}

	const createAlloy = (out, inp, extras) => {
		// let results = {
		// 	count: 2,
		// 	base_ingredient: Item.of(out)
		// 		.toResultJson()
		// 		.toString()
		// 	base_ingredient: toIngredient()
		// }

		let results = [
			Item.of(out).toResultJson()
		]

		alloyMixing(results, [ inp, ...extras ])

		recipe.custom({
			type: 'immersiveengineering:arc_furnace',
			input: toIngredient(inp),
			additives: extras.map(toIngredient),
			results,
			time: 100,
  		energy: 51200
		})
	}

	createAlloy('2x alloyed:bronze_ingot', '#forge:ingots/gold', [
		'#forge:ingots/zinc',
		'create:cinder_flour'
	])

	createAlloy('2x kubejs:crushed_sunmetal', 'create:crushed_gold_ore', [
		'create:crushed_zinc_ore',
		'create:cinder_flour'
	])

	console.log(Ingredient.of('3x minecraft:stone').toJson())

	alloyMixing(
		[ Item.of('3x kubejs:crushed_steel').toResultJson() ],
		[
			...manyOf('create:crushed_iron_ore', 3),
			[ 'minecraft:coal', 'minecraft:charcoal' ]
		]
	)

	recipe.smelting('alloyed:bronze_ingot', 'architects_palette:sunmetal_blend')
	recipe.shapeless('9x #forge:nuggets/electrum', [ 'alloyed:bronze_ingot' ]),
	recipe.shapeless('alloyed:bronze_ingot', manyOf('#forge:nuggets/electrum', 9) )
	// 1 ingot -> 3 blocks
	recipe.shapeless('12x architects_palette:sunmetal_block', manyOf('#forge:ingots/electrum', 4) )

	// No silver

	recipe.replaceInput({
		id: 'architects_palette:sunmetal_bars'
	}, 'architects_palette:sunmetal_brick', 'alloyed:bronze_ingot')

	recipe.custom({
		"type": "immersiveengineering:blueprint",
		"inputs": [
			{
				"item": "immersiveengineering:empty_casing"
			},
			{
				"tag": "forge:gunpowder"
			},
			{
				"count": 2,
				"base_ingredient": {
					"tag": "forge:nuggets/lead"
				}
			},
			{
				"item": "cavesandcliffs:amethyst_shard"
			}
		],
		"category": "bullet",
		"result": {
			"item": "immersiveengineering:silver"
		}
	})
})