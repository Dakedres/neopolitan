const materialFrom = (mod, names) =>
	(typeof names[0] == 'object' ? names : [ names ]).map(name => new RegExp(`${mod}:(.*_|)${name}.*?$`) )

const hemp = 'immersiveengineering:seed'

const blossomSaplings = [
  'quark:blue_blossom_sapling',
  'quark:pink_blossom_sapling',
  'quark:orange_blossom_sapling',
  'quark:red_blossom_sapling'
]

const seasons = {
  spring: 'sereneseasons:summer_crops',
  summer: 'sereneseasons:spring_crops',
  autumn: 'sereneseasons:autumn_crops'
}

const instruments = [
	"pitchperfect:banjo",
	"pitchperfect:bass",
	"pitchperfect:bass_drum",
	"pitchperfect:bit",
	// "pitchperfect:chimes",
	"pitchperfect:cow_bell",
	"pitchperfect:didgeridoo",
	"pitchperfect:electric_piano",
	"pitchperfect:flute",
	"pitchperfect:glockenspiel",
	"pitchperfect:guitar",
	"pitchperfect:harp",
	"pitchperfect:snare_drum",
	"pitchperfect:sticks",
	"pitchperfect:vibraphone",
	"pitchperfect:xylophone"
]


onEvent('item.tags', event => {
  const equalMetal = (left, right) => [
    [ `forge:nuggets/${left}`, `#forge:nuggets/${right}` ],
    [ `forge:ingots/${left}`, `#forge:ingots/${right}` ],
    [ `forge:plates/${left}`, `#forge:plates/${right}` ]
  ].map(a => event.add(...a))

  const addFrom = (mod, ...names) => names.forEach(name => {
    console.log('TAG ' + name)

    event.add([ mod, name ].join(':'), materialFrom(mod, name) )
  })

  event.add(seasons.autumn, hemp)

  blossomSaplings.forEach(item => {
    event.add(seasons.spring, item)
    event.add(seasons.summer, item)
  })

  event.add('instruments', instruments)
  event.add('quark:vertical_slab', /^.*?:.*?_vertical_slab$/)
  // event.add('alexsmobs:grizzly_foodstuffs', [
  //   'buzzier_bees:honey_apple',
  //   'buzzier_bees:glazed_porkchop',
  //   'create:honeyed_apple',
  //   'buzzier_bees:sticky_honey_wand',
  // ])

  event.add('forge:plates/nickel', '#forge:ingots/zinc')
  event.add('forge:dusts/bronze', 'architects_palette:sunmetal_blend')
  equalMetal('constantan', 'brass')
  equalMetal('nickel', 'zinc')
  equalMetal('electrum', 'bronze')

  ;[
    'kubejs:crushed_sunmetal',
    'kubejs:crushed_steel'
  ].forEach(i => event.add('create:crushed_ores', i) )

  // event.add('supplementaries:sign_post', materialFrom('supplementaries', 'sign_post') )

  addFrom('supplementaries', 'sign_post', 'flag')
})