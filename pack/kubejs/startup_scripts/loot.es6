const instrumentTables = {
  minecraft: [
    "abandoned_mineshaft",
    "bastion_bridge",
    "bastion_hoglin_stable",
    "bastion_other",
    "bastion_treasure",
    "buried_treasure",
    "desert_pyramid",
    "end_city_treasure",
    "igloo_chest",
    "jungle_temple_dispenser",
    "jungle_temple",
    "nether_bridge",
    "pillager_outpost",
    "ruined_portal",
    "shipwreck_map",
    "shipwreck_supply",
    "shipwreck_treasure",
    "simple_dungeon",
    "spawn_bonus_chest",
    "stronghold_corridor",
    "stronghold_crossing",
    "stronghold_library",
    "underwater_ruin_big",
    "underwater_ruin_small",
    "village",
    "woodland_mansion"
  ]
}

const createMapper = mod => name =>
  `${mod}:chests/${name}`

let tables = [
  'minecraft:chests/igloo_chest'
]

// for(let mod in instrumentTables)
//   tables = tables.concat(instrumentTables[mod].map(createMapper(mod) ) )

console.log(tables)

onEvent('chest.loot_tables', event => {
  for(let path of tables) {
    event.modify(path, table => {
      table.addPool(pool => {
        pool.rolls = 20

        // pool.addEntry({
        //   type: "tag",
        //   weight: 100,
        //   name: "minecraft:instruments"
        // })

        pool.addEntry({
          "type": "minecraft:item",
          "weight": 15,
          "name": "minecraft:music_disc_13"
        })

      })
    })
  }
})