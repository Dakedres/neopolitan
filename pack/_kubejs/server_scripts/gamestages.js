// priority: 0

settings.logAddedRecipes = true
settings.logRemovedRecipes = true
settings.logSkippedRecipes = false
settings.logErroringRecipes = true

console.info('Hello, World! (You will see this line every time server resources reload)')

global.modStages = [ "create", "immersiveengineering", "deextinction", "psi", "farsight_spyglasses", "supplementaries", "chimes", "snowrealmagic", "infernalexp", "endergetic", "deadlyendphantoms", "buzzier_bees" ]

const onGamestage = (stageName, event) => {
  console.log(stageName)
}

const executeAs = (event, command) =>
  event.server.runCommandSilent(`execute as ${event.player.id} run ${command}`)

const addGameStage = (event, stage) => {
  // We need to use execute as gamestages will throw an error since the selector could
  //  also point to an entity. Wrapping it in execute works tho
  executeAs(event, `gamestage add @s ${stage.name}`)
  console.log(stage)
  
  if(!stage.hidden) {
    let data = [
      { text: "Your horizons have expanded! " },
      {
        text: `Wow \$${stage.name}`,
        color: "gray"
      }
    ]

    // console.log(`title ${event.player.id} actionbar ${JSON.stringify(message)}`)
    // Fade in/out .75s, stay 4s
    // executeAs(event, `title @s actionbar ${JSON.stringify(message)}`)
    console.log(`title @s actionbar ${JSON.stringify(data)}`)
    executeAs(event, `title @s actionbar [{"text":"Your horizons have expanded! "}, {"text":"\$${stage.name}","color":"gray"}]`)
  }

}

onEvent('player.chat', function (event) {
  if(event.message.startsWith('$add') ) {
    addGameStage(event, { name: 'dolomite' })
  }
})

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
      hidden: stage.hidden,
      name: stage.name
    })

    return obj
  }

  const stageTypes = global.stageData.pickup.reduce(handleStage, { mod: {}, item: [] })

  onEvent('player.inventory.changed', event => {
    let item = event.item,
        playerStages = event.getPlayer().getStages(),
        // Does not work well for items in multiple gamestages
        itemStage = stageTypes.item.find(stage => !playerStages.has(stage.name) && stage.of.test(item) )

    if(itemStage) {
      addGameStage(event, itemStage)
      // itemStages.forEach(stage => addGameStage(event, itemStages.name))
    } else {
      let modStage = stageTypes.mod[item.getMod() + '']

      if(modStage && !event.hasGameStage(modStage) ) {
        addGameStage(event, modStage)
      } 
      // // Need to prioritize other things for the time being 
      // 
      // else if(item.id == 'minecraft:enchanted_book') {
      //   console.log('double h')
      // }
    }
  })
}

{
  const advanceStages = global.stageData.advancement.reduce((map, stage) => {
    map.set(stage.of, stage)
    return map
  }, new Map())

  console.log(advanceStages.keys().next())

  onEvent('player.advancement', event => {
    let id = event.getAdvancement().id() + ''

    console.log(id)

    if(advanceStages.has(id)) {
      console.log('match')
      addGameStage(event, advanceStages.get(id).name)
    }
  })
}

// onEvent('player.logged_in', event => {
//   refreshHidden(event)
// })

// onEvent('worldgen.remove', event => {
//   print(event)
// })