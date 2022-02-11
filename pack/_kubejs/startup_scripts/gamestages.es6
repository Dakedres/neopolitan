const genericStage = (mod, ...patterns) =>
  patterns.reduce((out, pattern) => {
    // Regex to grab the item wrapped in paranthenses
    out[/.*\((\w*?)\).*/.exec(pattern)[1]] = {
      reveal: [ new RegExp(`${mod}:${pattern}$`) ]
    }

    return out
  }, {})

const dynArray = items => typeof items[0] == 'object' ? items[0] : items

const materialFrom = (mod, ...names) =>
	dynArray(names).map(name => new RegExp(`${mod}:(.*_|)${name}.*?$`) )

const materialStage = (mod, ...names) =>
  dynArray(names).reduce((out, name) => {
    out[name] = {
      reveal: new RegExp(`${mod}:(.*_|)${name}.*?$`)
    }

    return out
  }, {})

const single = (...items) =>
  dynArray(items).reduce((out, reveal) => {
    out[reveal.split(':')[1]] = { reveal }
    return out
  }, {})

const singleFrom = (mod, ...items) =>
  single(dynArray(items).map(i => mod + ':' + i) )

const modStages = (...mods) =>
  dynArray(mods).reduce((out, mod) => {
    out[mod] = { reveal: '@' + mod }
    return out
  }, {})

// const forMods = (processor, mods, ...args) =>
//   mods.reduce((out, mod) => {
//     let data = processor(mod, ...args)

//     for(let key in data) {
//       let outValue = out[key]

//       if(outValue) {
//         outValue.reveal = outValue.reveal.concat(data[key].reveal)
//       } else {
        
//       }
//     }
//   }, {})

const gamestages =  {
  ...modStages('create', 'pitchperfect'),
  //   The above is equivalent to:
  // "create": {
  //   "on": "discover",
  //   "reveal": "@create"
  // },
  // ...ect

  ...materialStage('darkerdepths', 'limestone', 'grimstone', 'shale', 'petrified'),
  //   The above is equivalent to:
  // shale: {
  //   on: "discover",
  //   reveal: [
  //     /darkerdepths:.*?_shale$/
  //   ]
  // },
  // grimestone: {
  //   on: "discover",
  //   reveal: [
  //     /darkerdepths:grimestone.*?$/
  //   ]
  // }
  // ...ect

  //   Also an option to similar ends
  // ...genericStage('darkerdepths', '(grimestone).*?', '(.*_|)(shale).*?', '(.*_|)(petrified).*?'),
  
  // This doesn't work I have no idea
  insect_bottle: {
    reveal: /buzzier_bees:.*?_bottle$/
  },
                                            
//   ______            _                 _   _             
//  |  ____|          | |               | | (_)            
//  | |__  __  ___ __ | | ___  _ __ __ _| |_ _  ___  _ __  
//  |  __| \ \/ / '_ \| |/ _ \| '__/ _` | __| |/ _ \| '_ \ 
//  | |____ >  <| |_) | | (_) | | | (_| | |_| | (_) | | | |
//  |______/_/\_\ .__/|_|\___/|_|  \__,_|\__|_|\___/|_| |_|
//              | |                                        
//              |_|   
//                                     
  // Alex's Mobs
  ...materialStage('alexsmobs', 'crocodile', 'moose', 'kangaroo', 'dropbear'),
  ...singleFrom('alexsmobs', 'sombrero', 'mimicream'),
  void_worm: {
    //   'on' isn't even needed if it's discover
    // on: "discover",
    or: "alexsmobs:alexsmobs/void_worm_kill",
    reveal: [
      '#alexsmobs:void_worm_drops',
      'alexsmobs:void_worm_beak',
      'alexsmobs:dimensional_carver'
    ]
  },
  frontier_cap: {
    reveal: [
      'alexsmobs:frontier_cap',
      'alexsmobs:raccoon_tail',
      'alexsmobs:bear_fur'
    ]
  },
  banana: {
    reveal: [
      'alexsmobs:banana',
      'alexsmobs:banana_peel',
      'alexsmobs:sopa_de_macaco'
    ]
  },

  glowstone_canyon: {
    reveal: [
      '#infernalexp:glowstone_canyon_blocks'
    ]
  },

  // Endergetic
  ...materialStage('endergetic', 'boof', 'corrock'),
  ...single('endergetic:acidian_lantern'),
  puffbug: {
    reveal: [
      'endergetic:puffbug_hive',
      'endergetic:puffbug_bottle'
    ]
  },
  eumus: {
    reveal: [
      ...materialFrom('endergetic', 'eumus'),
      'endergetic:poismoss'
    ]
  },
  bollom: {
    reveal: [
      'endergetic:bolloom_fruit',
      ...materialFrom('endergetic', 'bolloom_balloon')
    ]
  },
  // booflo: {
  //   reveal: [
  //     'endergetic:boof_block',
  //     'endergetic:boof_hide',
  //     'endergetic:booflo_vest'
  //   ]
  // }

  // Special recipes
  slingshot: {
    reveal: [
      'quark:ravager_hide',
      'supplementaries:slingshot'
    ]
  },

  hemp: {
    reveal: [
      'immersiveengineering:seed', // hemp seed
      'immersiveengineering:hemp_fiber',
      'immersiveengineering:wirecoil_structure_rope',
      'supplementaries:rope',
      'supplementaries:rope_arrow',
      'tetra:modular_toolbelt'
    ]
  },

  // Discs
  ...single(...[
    "alexsmobs:music_disc_daze",
    "alexsmobs:music_disc_thime",
    "cavesandcliffs:music_disc_otherside",
    "infernalexp:music_disc_flush",
    "infernalexp:music_disc_soul_spunk",
    "quark:music_disc_chatter",
    "quark:music_disc_clock",
    "quark:music_disc_crickets",
    "quark:music_disc_drips",
    "quark:music_disc_endermosh",
    "quark:music_disc_fire",
    "quark:music_disc_ocean",
    "quark:music_disc_rain",
    "quark:music_disc_wind",
    "endergetic:music_disc_kilobyte"
  ]),

//   _____                           _   _             
//  |  __ \                         | | (_)            
//  | |  | | ___  ___ ___  _ __ __ _| |_ _  ___  _ __  
//  | |  | |/ _ \/ __/ _ \| '__/ _` | __| |/ _ \| '_ \ 
//  | |__| |  __/ (_| (_) | | | (_| | |_| | (_) | | | |
//  |_____/ \___|\___\___/|_|  \__,_|\__|_|\___/|_| |_|
//
  ...materialStage('supplementaries', 'sign_post', 'flag'),
  // ...forMods(materialStage, [
  //   'decorative_blocks',
  //   'decorative_blocks_abnormals',
  //   'muchmoremodcompat'
  // ], [
  //   // TODO: Make sure the player can encounter each of these
  //   'seat',
  //   'palisade',
  //   'support',
  //   'beam'
  // ]),

  copper: {
    reveal: [
      '#forge:ores/copper',
      '#forge:ingots/copper',
      '#forge:nuggets/copper',
      '#forge:plates/copper',
      '#forge:dusts/copper',
      'create:crushed_copper_ore',
      ...materialFrom('create', 'copper'),
      ...materialFrom('immersiveengineering', 'copper'),
      'immersiveengineering:coil_lv',
      ...materialFrom('cavesandcliffs', 'copper'),
      'chimes:copper_chimes',
      'supplementaries:copper_lantern'
    ]
  },

  // Stones
  ...materialStage('create', 'gabbro', 'dolomite'),
  ...materialStage('darkerdepths', 'grimestone', 'limestone'),
  ...materialStage('cavesandcliffs', 'deepslate'),
  ...materialStage('infernalexp', 'soul_stone'),

  // Planks
  ...materialStage('enhanced_mushrooms', 'red_mushroom', 'brown_mushroom', 'glowshroom'),
  ...materialStage('endergetic', 'poise'),

  honey_pot: {
    of: [
      'minecraft:honeycomb',
      'minecraft:honey_block'
    ],
    reveal: [
      'buzzier_bees:honey_pot',
    ]
  },
  candles: {
    of: [
      'minecraft:honeycomb',
      'quark:tallow'
    ],
    reveal: '#buzzier_bees:candles'
  },

//   _______          _     
//  |__   __|        | |    
//     | | ___   ___ | |___ 
//     | |/ _ \ / _ \| / __|
//     | | (_) | (_) | \__ \
//     |_|\___/ \___/|_|___/                     
// 
  sweets: {
    reveal: [
      'buzzier_bees:honey_apple',
      'buzzier_bees:honey_bread',
      'buzzier_bees:glazed_porkchop',
      'create:honeyed_apple',
      'minecraft:honey_bottle',
      'buzzier_bees:sticky_honey_wand',
      'supplementaries:candy'
    ]
  }
}

{
  let isKube = this.global

  if(!isKube) {
    module.exports = []
  }

  const constants = {
    events: {
      pickup: 'discover',
      advancement: 'advance'
    }
  }

  let data = { pickup: [], advancement: [] },
      tags = {}

  const filterToTag = (stageName, content) => {
    if(typeof content == 'object') {
      let name = 'gamestages:' + stageName

      tags[name] = Array.isArray(content) ? content : [ content ]
      return '#' + name
    } else {
      return content
    }
  }

  for(let name in gamestages) {
    let stage = gamestages[name]
        out = stage

    out.name = name
    out.reveal = filterToTag(out.name, out.reveal)

    if(!stage.on)
      stage.on = constants.events.pickup

    // if(stage.notify == undefined)
    //   stage.notify = true

    if(!stage.of) {
      if(stage.on == constants.events.pickup) {
        out.of = out.reveal
      } else {
        throw new Error("Stage missing 'of' descriptor")
      }
    } else {
      out.of = filterToTag(out.name, out.of)
    }

    if(isKube) {
      switch(stage.on) {
        case constants.events.advancement:
          data.advancement.push(out)
          break

        case constants.events.pickup:
          data.pickup.push(out)

          if(out.or)
            data.advancement.push({
              of: out.or,
              name
            })
          break
      }
    } else {
      module.exports.push(out)
    }
  }

  if(isKube) {
    global.stageData = data

    console.log('TAG DATA')
    console.log(tags)

    onEvent('item.tags' , event => {
      for(let name in tags) {
        tags[name].forEach(i => event.add(name, i))
      }
    })
  }
}