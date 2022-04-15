let ores = []

const addOre = (idName, displayName, tag) => {  
  ores.push({
    id: `kubejs:raw_${displayName.toLowerCase()}_ore`,
    idName,
    displayName,
    tag
  })
}

addOre('aluminum', 'bauxite', 'forge:ores/aluminum')
addOre('lead', 'Lead', 'forge:ores/lead')
// addOre('nickel', 'Nickel', 'forge:ores/nickel')
// addOre('silver', 'Silver', 'forge:ores/silver')

onEvent('item.registry', event => {
  for(let { id, idName, displayName } of ores)
    event.create(id)
      .displayName(`Raw ${displayName} Ore`)
      .texture(`neo:item/metal_raw_${idName}`)

  const createCrushed = (idName, displayName) => {
    let id = 'crushed_' + idName

    event.create(id)
      .displayName(`Crushed ${displayName}`)
      .texture(`neo:item/${id}`)
  }

  createCrushed('sunmetal', 'Sunmetal')
  createCrushed('steel', 'Steel')
})

onEvent('item.tags', event => {
  for(let { id, tag } of ores) {
    event.add(tag, id)
  }
})