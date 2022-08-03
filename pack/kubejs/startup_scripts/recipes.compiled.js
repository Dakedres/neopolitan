// priority: 0

/*
  The following script has been compiled with Babel, if you wish to make any edits, clone https://github.com/dakedres/neopolitan-mc and
    follow the instructions provided in the "Script compilation" section of the readme.
*/

onEvent('recipes', recipe => {
  // let cadPattern = [
  //   'R  ',
  //   'SIS',
  //   '  L'
  // ]
  // recipe.shaped('psi:cad_assembly_ivory_psimetal', cadPattern, {
  //   S: 'psi:ivory_substance',
  //   I: '#forge:ingots/psimetal',
  //   R: 'create:refined_radiance',
  // 	L: 'minecraft:stripped_birch_log'	  
  // })
  // recipe.shaped('psi:cad_assembly_ebony_psimetal', cadPattern, {
  //   S: 'psi:ebony_substance',
  //   I: '#forge:ingots/psimetal',
  //   R: 'create:refined_radiance',
  //   L: 'minecraft:stripped_dark_oak_log' 
  // })
  // recipe.shaped(cons.ropeBelt, [
  //   'RR '
  // ], {
  //   R: '#supplementaries:ropes'
  // })
  recipe.shaped('6x quark:pipe', ['P', 'G', 'P'], {
    P: '#forge:plates/steel',
    G: '#forge:glass'
  });
  var chimePattern = ['W', 'S', 'C'];
  recipe.shaped('chimes:copper_chimes', chimePattern, {
    W: '#minecraft:wooden_slabs',
    S: '#forge:string',
    C: '#forge:plates/copper'
  });
  recipe.shaped(Item.of('supplementaries:slingshot', '{Damage:0}'), ['SHS', 'RBR', ' R '], {
    R: '#forge:rods/wooden',
    H: 'quark:ravager_hide',
    S: '#forge:string',
    B: '#forge:slimeballs'
  });
  recipe.shaped('supplementaries:rope', ['  H', ' H ', 'H  '], {
    H: '#forge:fiber_hemp'
  }), recipe.shaped('create:rope_pulley', [' C ', 'SRS', ' P '], {
    C: 'create:andesite_casing',
    S: 'create:shaft',
    R: '#supplementaries:ropes',
    P: '#forge:plates/iron'
  }); // recipe.remove('quark:rainbow_rune')

  recipe.shaped('quark:rainbow_rune', ['YGB', 'OjI', 'RrV'], {
    R: 'quark:red_corundum',
    O: 'quark:orange_corundum',
    Y: 'quark:yellow_corundum',
    G: 'quark:green_corundum',
    B: 'quark:blue_corundum',
    I: 'quark:indigo_corundum',
    V: 'quark:violet_corundum',
    r: '#quark:runes',
    j: 'alexsmobs:rainbow_jelly'
  });
  {
    var _recipe$shaped;

    var shield = 'alexsmobs:shield_of_the_deep'; // recipe.remove(shield)

    recipe.shaped(Item.of(shield, '{Damage:0}'), ['TTT', 'PHP', 'BPB'], (_recipe$shaped = {
      T: 'alexsmobs:shark_tooth',
      B: 'alexsmobs:fish_bones'
    }, babelHelpers.defineProperty(_recipe$shaped, "B", 'alexsmobs:fish_bones'), babelHelpers.defineProperty(_recipe$shaped, "P", 'minecraft:prismarine_bricks'), babelHelpers.defineProperty(_recipe$shaped, "H", 'minecraft:heart_of_the_sea'), _recipe$shaped));
  } // Decided against this
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

  var proxyStonecutting = (to, from) => {
    var baseCount = Item.of(to).getCount(),
        type = "minecraft:stonecutting";
    recipe.forEachRecipe({
      type: type
    }, original => {
      var input = original.inputItems.get(0);
      if (!input.test(to)) return;
      var json = original.json,
          custom = {
        type: type,
        ingredient: [Ingredient.of(from).toJson()],
        result: json.get('result'),
        count: json.get('count').getAsInt() * baseCount,
        // count: baseResult.count * json.get('count').getAsInt(),
        conditions: json.get('conditions')
      };
      recipe.custom(custom);
    });
    recipe.stonecutting(to, from);
  }; // proxyStonecutting('3x architects_palette:sunmetal_block', 'alloyed:bronze_ingot')
  // 	 __  __ _                      _     
  //  |  \/  (_)                    | |    
  //  | \  / |_ _ __   ___ _ __ __ _| |___ 
  //  | |\/| | | '_ \ / _ \ '__/ _` | / __|
  //  | |  | | | | | |  __/ | | (_| | \__ \
  //  |_|  |_|_|_| |_|\___|_|  \__,_|_|___/
  // ;[
  // 	'immersiveengineering:arc_furnace',
  // 	'immersiveengineering:alloy',
  // 	'create:mixing'
  // ].forEach(type => {
  // 	recipe.remove({
  // 		type,
  // 		output: '#forge:ingots/bronze'
  // 	})	
  // })
  // recipe.remove({
  // 	type: 'create:mixing',
  // 	output: '#forge:ingots/electrum'
  // })	


  var toIngredient = exp => Ingredient.of(exp).toJson();

  var manyOf = (string, count) => new Array(count).fill(string);

  var alloyMixing = (results, inp) => {
    recipe.custom({
      type: 'create:mixing',
      ingredients: inp.map(toIngredient),
      results: results,
      heatRequirement: 'heated'
    });
  };

  var createAlloy = (out, inp, extras) => {
    // let results = {
    // 	count: 2,
    // 	base_ingredient: Item.of(out)
    // 		.toResultJson()
    // 		.toString()
    // 	base_ingredient: toIngredient()
    // }
    var results = [Item.of(out).toResultJson()];
    alloyMixing(results, [inp].concat(babelHelpers.toConsumableArray(extras)));
    recipe.custom({
      type: 'immersiveengineering:arc_furnace',
      input: toIngredient(inp),
      additives: extras.map(toIngredient),
      results: results,
      time: 100,
      energy: 51200
    });
  };

  createAlloy('2x alloyed:bronze_ingot', '#forge:ingots/gold', ['#forge:ingots/zinc', 'create:cinder_flour']);
  createAlloy('2x kubejs:crushed_sunmetal', 'create:crushed_gold_ore', ['create:crushed_zinc_ore', 'create:cinder_flour']);
  console.log(Ingredient.of('3x minecraft:stone').toJson());
  alloyMixing([Item.of('3x kubejs:crushed_steel').toResultJson()], [].concat(babelHelpers.toConsumableArray(manyOf('create:crushed_iron_ore', 3)), [['minecraft:coal', 'minecraft:charcoal']]));
  recipe.smelting('alloyed:bronze_ingot', 'architects_palette:sunmetal_blend');
  recipe.shapeless('9x #forge:nuggets/electrum', ['alloyed:bronze_ingot']), recipe.shapeless('alloyed:bronze_ingot', manyOf('#forge:nuggets/electrum', 9)); // 1 ingot -> 3 blocks

  recipe.shapeless('12x architects_palette:sunmetal_block', manyOf('#forge:ingots/electrum', 4)); // No silver

  recipe.replaceInput({
    id: 'architects_palette:sunmetal_bars'
  }, 'architects_palette:sunmetal_brick', 'alloyed:bronze_ingot');
});