const getRarityKey = 'func_77953_t'

const getRarity = id =>
  Item.of(id).getItemStack()[getRarityKey]()

// Can be replaced with NBT.compoundTag({}) in 1.18
const constructCompound = obj =>
  Item.of('minecraft:stone', obj).getNbt()

global.populateSalvage = (recipes, event) => {
  recipes.add(0, constructCompound({
    maxUses: 12,
    buyB: {
      id: "minecraft:air",
      Count: 0
    },
    buy: {
      id: "minecraft:emerald",
      Count: 1
    },
    sell: {
      id: "minecraft:vine",
      Count: 1
    },
    xp: 1,
    uses: 0,
    priceMultiplier: 0.05,
    specialPrice: 0,
    demand: 0,
    rewardExp: 1
  }) )
}

const getValue = nbt => {
  if(getRarity(nbt.Item.id) == Rarity.COMMON)
    return 0
}

onEvent('entity.death', event => {
  let entity = event.getEntity()

  if(entity.isPlayer() ) {
    console.log('t')
    entity.getServer().runCommandSilent(`execute as ${entity.getId()} run kill @e[type=minecraft:experience_orb,distance=..1]`)
    entity.getServer().runCommandSilent(`execute as ${entity.getId()} run xp set @s 0 levels`)
  }
})

// onEvent('item.destroyed', event => {
//   console.log(event)
//   console.log(event.getItem())
// })