// priority: 0

settings.logAddedRecipes = true
settings.logRemovedRecipes = true
settings.logSkippedRecipes = false
settings.logErroringRecipes = true

console.info('Hello, World! (You will see this line every time server resources reload)')

global.modStages = [ "create", "immersiveengineering", "deextinction", "psi", "farsight_spyglasses", "supplementaries", "chimes", "snowrealmagic", "infernalexp", "endergetic", "deadlyendphantoms", "buzzier_bees" ]

const addGameStage = (event, stageName) => {
  // We need to use execute as gamestages will throw an error since the selector could
  //  also point to an entity. Wrapping it in execute works tho
  event.server.runCommandSilent(`execute as ${event.player.id} run gamestage add @s ${stageName}`)
}

console.log(global.stageData)

{
  const handleStage = (obj, stage) => {
    // if(stage.of.startsWith('@') ){
    //   let mod = obj.mod[stage.of]
    //   mod ? mod.push(stage.name) : mod = [ stage.name ]
    // } else {
    //   obj.item.push({
    //     // 'of': Ingredient.matchAny(stage.of),
    //     'of': Item.of(stage.of),
    //     name: stage.name
    //   })
    // }
    obj.item.push({
      // 'of': Ingredient.matchAny(stage.of),
      'of': Ingredient.of(stage.of),
      name: stage.name
    })

    return obj
  }

  const stageTypes = global.stageData.pickup.reduce(handleStage, { mod: {}, item: [] })

  console.log(stageTypes)

  onEvent('player.inventory.changed', event => {
    let item = event.item,
        modStage = stageTypes.mod[item.getMod() + '']

    if(modStage && !event.hasGameStage(modStage) ) {
      addGameStage(event, modStage)
    } else {
      let itemStage = stageTypes.item.find(stage => stage.of.test(item) )

      if(itemStage && !event.hasGameStage(itemStage.name) )
        addGameStage(event, itemStage.name)
    }
  })
}

{
  const advanceStages = global.stageData.advancement

  console.log(advanceStages)

  onEvent('player.advancement', event => {
    
  })
}

// onEvent('player.logged_in', event => {
//   refreshHidden(event)
// })

// onEvent('worldgen.remove', event => {
//   print(event)
// })