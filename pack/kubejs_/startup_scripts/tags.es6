const reiGroup = (match) => ({
  match,
  makeGroup: true
})

// const markedGroup = (match) => ({
//   match,
//   marked: true
// })

const blossomSaplings = [
    'quark:blue_blossom_sapling',
    'quark:pink_blossom_sapling',
    'quark:orange_blossom_sapling',
    'quark:red_blossom_sapling'
  ]

const tags = {
  // ...[
  //   'potion',
  //   'splash_potion',
  //   'lingering_potion',
  //   'tipped_arrow',
  //   'enchanted_book'
  // ].reduce((out, key) => {
  //   console.log(Item.of(key).getName() )

  //   out[key] = {
  //     match: key,
  //     makeGroup: Item.of(key).getName(),
  //     useNbt: true
  //   }

  //   return out
  // }, {}),

  'minecraft:music_discs': reiGroup(/.+?:music_disc_.+?/),

  'sereneseasons:summer_crops': blossomSaplings,
  'sereneseasons:spring_crops': blossomSaplings,

  'terracotta_shingles': reiGroup(materialFrom('quark', 'shingles') ),

  // ...[
  //   'exposed_',
  //   'weathered_',
  //   'oxidized_',
  //   'waxed_',
  //   'waxed_exposed_',
  //   'waxed_weathered_',
  //   'waxed_oxidized_'
  // ].reduce((out, prefix, index) => {
  //   let base = 'Copper Blocks'

  //   let names = [
  //     'Exposed ' + base,
  //     'Weathered ' + base,
  //     'Oxidized ' + base,
  //     'Waxed ' + base,
  //     'Waxed Exposed ' + base,
  //     'Waxed Weathered ' + base,
  //     'Waxed Oxidized ' + base,
  //   ]

  //   out[prefix + 'copper_blocks'] = reiGroup(
  //     names[index],
  //     getItemIds(new RegExp(`minecraft:${prefix}cut_copper(_.+)?`) )
  //   )

  //   return out
  // }, {})

  'copper_building_blocks': reiGroup([
    'minecraft:copper_block',
    /.+?:((exposed|weathered|oxidized|waxed|cut)_)+?copper(_.+)?/,
    /create:copper_(shingle|tile).*?/
  ]),

  ...mapObject({
    red: {
      whitelist: [
        ...materialFrom('minecraft', [
          'bricks',
          'nether'
        ]),
        '#kubejs:wood_crimson'
      ]
    },
    blue: {},
    green: {}
  }, (key, value) => {
    let globalBlacklist = [
      '#quark:red_blossom_sapling',
      '#create:toolboxes'
    ]

    let mods = [
      'minecraft',
      'quark',
      'oreganized',
      'architects_palette',
      'create'
    ]

    let filter = Ingredient.of(globalBlacklist.concat(value.blacklist ?? []) ),
        blocks = getItemStacks(new RegExp(`^(${mods.join('|')}):(.+_)?${key}(_.+)?$`) )
      .filter(stack => {
        if(filter.test(stack) )
          return false
        else
          return stack.isBlock() 
          // return true
        })
      .map(stack => stack.getId() )

    return [
      key + '_building_blocks',
      {
        match: blocks.concat(value.whitelist ?? [])
      }
    ]
  })
}

console.log('TAGS')
console.log(tags)

onEvent('item.tags', event => {
  let groups = []

  for(let key in tags) {
    let tagData = tags[key],
        splitId = key.split(':'),
        [ namespace, path ] = splitId.length == 1 ? [ 'kubejs', key ] : splitId,
        tagId = Utils.id(namespace, path)

    if(Array.isArray(tagData) )
      tagData = {
        match: tagData
      }

    for(let element of tagData.match ? getItemIds(tagData.match) : [])
      event.add(tagId, element)

    if(tagData.makeGroup)
      groups.push({
        name: tagData.makeGroup,
        tag: tagId,
        namespace,
        path
      })
  }

  global.reiGroups = groups
  console.log(groups)
})

// {

// // const hemp = 'immersiveengineering:seed'

// const blossomSaplings = [
//   'quark:blue_blossom_sapling',
//   'quark:pink_blossom_sapling',
//   'quark:orange_blossom_sapling',
//   'quark:red_blossom_sapling'
// ]

// const seasons = {
//   spring: 'sereneseasons:summer_crops',
//   summer: 'sereneseasons:spring_crops',
//   autumn: 'sereneseasons:autumn_crops'
// }

// const instruments = [
// 	"pitchperfect:banjo",
// 	"pitchperfect:bass",
// 	"pitchperfect:bass_drum",
// 	"pitchperfect:bit",
// 	// "pitchperfect:chimes",
// 	"pitchperfect:cow_bell",
// 	"pitchperfect:didgeridoo",
// 	"pitchperfect:electric_piano",
// 	"pitchperfect:flute",
// 	"pitchperfect:glockenspiel",
// 	"pitchperfect:guitar",
// 	"pitchperfect:harp",
// 	"pitchperfect:snare_drum",
// 	"pitchperfect:sticks",
// 	"pitchperfect:vibraphone",
// 	"pitchperfect:xylophone"
// ]


// onEvent('item.tags', event => {
//   const equalMetal = (left, right) => [
//     [ `forge:nuggets/${left}`, `#forge:nuggets/${right}` ],
//     [ `forge:ingots/${left}`, `#forge:ingots/${right}` ],
//     [ `forge:plates/${left}`, `#forge:plates/${right}` ]
//   ].map(a => event.add(...a))

//   const addFrom = (mod, ...names) => names.forEach(name => {
//     console.log('TAG ' + name)

//     event.add([ mod, name ].join(':'), materialFrom(mod, name) )
//   })

//   // event.add(seasons.autumn, hemp)

//   blossomSaplings.forEach(item => {
//     event.add(seasons.spring, item)
//     event.add(seasons.summer, item)
//   })

//   // event.add('instruments', instruments)
//   event.add('quark:vertical_slab', /^.*?:.*?_vertical_slab$/)
//   event.add('#alexsmobs:bald_eagle_tameables', 'alexsmobs:flying_fish')
//   // event.add('alexsmobs:grizzly_foodstuffs', [
//   //   'buzzier_bees:honey_apple',
//   //   'buzzier_bees:glazed_porkchop',
//   //   'create:honeyed_apple',
//   //   'buzzier_bees:sticky_honey_wand',
//   // ])

//   event.add('forge:plates/nickel', '#forge:ingots/zinc')
//   event.add('forge:dusts/bronze', 'architects_palette:sunmetal_blend')
//   equalMetal('constantan', 'brass')
//   equalMetal('nickel', 'zinc')
//   equalMetal('electrum', 'bronze')

//   ;[
//     'kubejs:crushed_sunmetal',
//     'kubejs:crushed_steel'
//   ].forEach(i => event.add('create:crushed_ores', i) )

//   // event.add('supplementaries:sign_post', materialFrom('supplementaries', 'sign_post') )

//   addFrom('supplementaries', 'sign_post', 'flag')
// })

// }