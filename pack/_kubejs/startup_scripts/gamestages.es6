const materialStage = (mod, ...patterns) =>
  patterns.reduce((out, pattern) => {
    // Regex to grab the item wrapped in paranthenses
    out[/.*\((\w*?)\).*/.exec(pattern)[1]] = {
      on: 'discover',
      reveal: [ new RegExp(`${mod}:${pattern}$`) ]
    }

    return out
  }, {})

const modStages = (...mods) =>
  mods.reduce((out, mod) => {
    out[mod] = { on: 'discover', reveal: '@' + mod }
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
  ...materialStage('darkerdepths', '(grimestone).*?', '(.*_|)(shale).*?', '(.*_|)(petrified).*?'),
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

    if(!stage.of) {
      if(stage.on == constants.events.pickup) {
        out.of = out.reveal = filterToTag(out.name, out.reveal)
      } else {
        throw new Error("Stage missing 'of' descriptor")
      }
    } else {
      out.of = filterToTag(out.name, out.of)
    }

    if(isKube) {
      switch(stage.on) {
        case constants.events.pickup:
          data.pickup.push(out)
          break
  
        case constants.events.advancement:
          data.advancement.push(out)
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