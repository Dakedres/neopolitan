const genericPowerGroup = {
  removeOnDeath: false
}

const powerGroups = {
  moon_blessing: {
    ...genericPowerGroup,
    powers: [
      'neo:second_chance'
    ]
  }
}

const PowerCommand = java('io.github.apace100.apoli.command.PowerCommand'),
      PowerTypeRegistry = java('io.github.apace100.apoli.power.PowerTypeRegistry')

const PowerGroupUtil = {
  grant(livingEntity, groupName) {
    let powerGroup = powerGroups[groupName]

    console.log(
      PowerTypeRegistry.get(new ResourceLocation('neo:retain_xp') )
    )

    console.log(
      new ResourceLocation('kubejs', groupName)
    )
    
    if(powerGroup.powers)
      for(let power of powerGroup.powers) {
        let out = PowerCommand.grantPower(
          livingEntity,
          new ResourceLocation(power)
        )

        console.log(out)
      }
  }
}

let args

onEvent('server.tick', event => {
  if(Date.now() % 1000 == 0) {
    if(args)
      PowerGroupUtil.grant(...args)
  }
});