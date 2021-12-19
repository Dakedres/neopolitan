const genericStage = (mod, ...patterns) =>
  patterns.reduce((out, pattern) => {
    // Regex to grab the item wrapped in paranthenses
    out[/.*\((\w*?)\).*/.exec(pattern)[1]] = {
      reveal: [ new RegExp(`${mod}:${pattern}$`) ]
    }

    return out
  }, {})

const materialStage = (mod, ...names) =>
  names.reduce((out, name) => {
    out[name] = {
      reveal: new RegExp(`${mod}:(.*_|)${name}.*?$`)
    }

    return out
  }, {})

const single = (...items) =>
  items.reduce((out, reveal) => {
    out[reveal.split(':')[1]] = { reveal }
    return out
  }, {})

const modStages = (...mods) =>
  mods.reduce((out, mod) => {
    out[mod] = { reveal: '@' + mod }
    return out
  }, {})

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
  ...single(
    '#buzzier_bees:candles'
  ),
  // This doesn't work I have no idea
  insect_bottle: {
    reveal: /buzzier_bees:.*?_bottle$/
  }
}

console.log(gamestages)

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
      let name = 'gamestage_' + stageName

      tags[name] = content
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

    onEvent('item.tags' , event => {
      for(let name in tags) {
        tags[name].forEach(i => event.add(name, i))
      }
    })
  }
}