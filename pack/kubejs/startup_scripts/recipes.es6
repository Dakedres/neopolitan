onEvent('recipes', recipe => {
	const removeAll = query =>
		getItemIds(query).forEach(id => recipe.remove(id) )

	// recipe.shaped(cons.ropeBelt, [
	//   'RR '
	// ], {
	//   R: '#supplementaries:ropes'
	// })

	// removeAll('#kubejs:disabled')

	recipe.shaped('6x quark:pipe', [
		'P',
		'G',
		'P'
	], {
		P: '#forge:ingots/lead',
		G: '#forge:glass'
	})

	// const chimePattern = [
	// 	'W',
	// 	'S',
	// 	'C'
	// ]

	// recipe.shaped('chimes:copper_chimes', chimePattern, {
	// 	W: '#minecraft:wooden_slabs',
	// 	S: '#forge:string',
	// 	C: '#forge:plates/copper'
	// })

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

	// recipe.remove('quark:rainbow_rune')
	recipe.shaped('quark:rainbow_rune', [
		'YGB',
		'OjI',
		'RrV'
	], {
		R: 'quark:red_corundum',
		O: 'quark:orange_corundum',
		Y: 'quark:yellow_corundum',
		G: 'quark:green_corundum',
		B: 'quark:blue_corundum',
		I: 'quark:indigo_corundum',
		V: 'quark:violet_corundum',
		r: '#quark:runes',
		j: 'alexsmobs:rainbow_jelly'
	})

	{
		let shield = 'alexsmobs:shield_of_the_deep'

		// recipe.remove(shield)
		recipe.shaped(Item.of(shield, '{Damage:0}'), [
			'TTT',
			'PHP',
			'BPB'
		], {
			T: 'alexsmobs:shark_tooth',
			B: 'alexsmobs:fish_bones',
			B: 'alexsmobs:fish_bones',
			P: 'minecraft:prismarine_bricks',
			H: 'minecraft:heart_of_the_sea'
		})
	}

	recipe.shaped('supplementaries:doormat', [
		'FF'
	], {
		F: 'alexsmobs:bear_fur'
	})

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
		let results = [
			Item.of(out).toResultJson()
		]

		alloyMixing(results, [ inp, ...extras ])
	}

	// removeAll([
	// 	'oreganized:electrum_ingot'
	// ])

	createAlloy('architects_palette:nether_brass_ingot', 'minecraft:copper_ingot', [
		'immersive_weathering:vitrified_sand'
	])
	

	recipe.shapeless('oreganized:electrum_ingot', [ '4x minecraft:netherite_scrap', '4x architects_palette:nether_brass_ingot' ])

	recipe.shaped('8x architects_palette:nether_brass_block', [
		'II',
		'II'
	], {
		I: 'architects_palette:nether_brass_ingot'
	})
})

onEvent('recipes.compostables', event => {
	let compostables = {
		'immersive_weathering:weeds': 1 
	}

	for(let id in compostables) {
		event.add(id, compostables[id])
	}
})

onEvent('item.tags', tags => {
	let equalMetal = (left, right) => [
		[ `forge:nuggets/${left}`, `#forge:nuggets/${right}` ],
		[ `forge:ingots/${left}`, `#forge:ingots/${right}` ],
		[ `forge:plates/${left}`, `#forge:plates/${right}` ]
	].map(a => tags.add(...a))

	equalMetal('zinc', 'lead')

	;[
		'forge:ash',
		'forge:dusts',
		'forge:dusts/ash',
		'supplementaries:hourglass_dusts'
	].forEach(tag => {
		tags.add(tag, 'immersive_weathering:soot')
	})
})