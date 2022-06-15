const singleTrade = (weight = 1, cost = 1, uses) => item => ({
  cost, 
  sell: item,
  weight,
  uses
})

let gamestageTrades = {
  tetra: [
    singleTrade()('tetra:basic_workbench')
  ],

  red_mushroom: singleTrade(4)('quark:mushroom_chest'),
  brown_mushroom: singleTrade(4)('enhanced_mushrooms:brown_mushroom_chest'),
  
  // mushroom chest add red mushroom gamestage and provide here
  ...this.global.gamestageTrades
}

const genericTrades = [
  singleTrade()('buzzier_bees:insect_bottle')
]

for(let stage in gamestageTrades) {
  let table = []

  gamestageTrades[stage]
    .forEach(raw => {
      let { sell } = raw,
          trade = Object.assign({}, raw)

      if(typeof sell == 'string')
        sell = Item.of(sell)

      trade.sell = sell.toNBT()
      trade.stage = stage
      table = table.concat(new Array(trade.weight).fill(trade) )
    })

  gamestageTrades[stage] = table
}

console.log(gamestageTrades['hemp'][0])

let blacklist = Ingredient.of('#kubejs:disabled')

const getRarity = id =>
  Item.of(id).getItemStack()[getRarityKey]()

// Can be replaced with NBT.compoundTag({}) in 1.18
const constructCompound = obj =>
  Item.of('minecraft:stone', obj).getNbt()

const distanceBetween = (v1, v2) => {
  let dx = v1[0] - v2[0],
      dy = v1[1] - v2[1],
      dz = v1[2] - v2[2]

  return Math.sqrt( dx * dx + dy * dy + dz * dz )
}

const getPos = entity => ([
  entity.getX(),
  entity.getY(),
  entity.getZ()
])

const handleTrader = (event, wandering) => {
  let entity = event.getEntity(),
      nbt = entity.getFullNBT(),
      recipes = nbt.Offers?.Recipes

  console.log(recipes.class)

  if(!recipes)
    return

  recipes
    .toArray()
    .forEach((v, i) => {
      if(blacklist.test(v.sell.id) ) {
        recipes.remove(i)
        // console.log(i)
      }
    })

  // console.log( entity.runCommand('execute as @e[distance=..500,type=minecraft:player] run data get entity @s UUID') )

  if(wandering) {
    let traderPos = getPos(entity)

    let players = event.getWorld().getPlayers()
      .filter(p => distanceBetween(traderPos, getPos(p) ) < 64 )
      .toArray()

    // recipes.add(0, constructCompound({
    //   maxUses: 12,
    //   buyB: {
    //     id: "minecraft:air",
    //     Count: 0
    //   },
    //   buy: {
    //     id: "minecraft:emerald",
    //     Count: 1
    //   },
    //   sell: {
    //     id: "minecraft:vine",
    //     Count: 1
    //   },
    //   xp: 1,
    //   uses: 0,
    //   priceMultiplier: 0.05,
    //   specialPrice: 0,
    //   demand: 0,
    //   rewardExp: 1
    // }) )

    let tradeTable = []

    for(let player of players) {
      let stages = player.getStages()

      for(let stage in gamestageTrades) {
        if(!stages.has(stage) )
          tradeTable = tradeTable.concat(gamestageTrades[stage])
      }
    }

    let tradeCount = Math.floor(Math.random() * 2),
        diff = recipes.size(),
        attempts = 0,
        presentedStages = []

    // tradeCount = (diff + tradeCount) <= 9 ? (9 - diff) : tradeCount

    while(tradeCount > 0 && attempts < 5) {
      let trade = tradeTable[Math.floor(Math.random() * tradeTable.length)]

      if(presentedStages.includes(trade.stage) ) {
        attempts++
        continue
      }

      attempts = 0
      presentedStages.push(trade.stage)

      let offer = {
        maxUses: trade.uses || 1,
        buy: {
          id: "minecraft:emerald",
          Count: trade.cost
        },
        buyB: {
          id: "minecraft:air",
          Count: 0
        },
        sell: trade.sell,
        xp: 1,
        uses: 0,
        priceMultiplier: 0.05,
        specialPrice: 0,
        demand: 0,
        rewardExp: 1
      }

      recipes.add(0, constructCompound(offer) )
      tradeCount--
    }
  }

  entity.setFullNBT(nbt)

  // entity.mergeFullNBT({
  //   Offers: {
  //     Recipes:[
  //       {
  //         maxUses: 12,
  //         buyB: {
  //           id: "minecraft:air",
  //           Count: 0
  //         },
  //         buy: {
  //           id: "minecraft:emerald",
  //           Count: 1
  //         },
  //         sell: {
  //           id: "minecraft:vine",
  //           Count: 1
  //         },
  //         xp: 1,
  //         uses: 0,
  //         priceMultiplier: 0.05,
  //         specialPrice: 0,
  //         demand: 0,
  //         rewardExp: 1
  //       }
  //     ]
  //   }
  // })
}

let mobHandlers = {
  'minecraft:wandering_trader': event => {
    handleTrader(event, true)
  },

  'minecraft:villager': handleTrader
}

onEvent('entity.spawned', event => {
  let handle = mobHandlers[event.getEntity().getType()]

  if(handle)
    handle(event)
})