const { writeFile } = require('fs/promises'),
      path = require('path')

const constants = {
  events: {
    advancement: "advance",
    pickup: "discover"
  },
  zs: {
    path: 'scripts/gamestages.zs',
    scriptStart: `
import mods.itemstages.ItemStages;
import stdlib.List;
import crafttweaker.api.item.IIngredient;`,
    createStagesBlock:`
for name in stageItems {
  for item in itemStages[name] {
    val res = ItemStages.restrict(item, name);
    res.preventInventory(false);
    res.preventPickup(false);
  }
}\n`,
  },
  kube: {
    path: 'kubejs/startup_scripts/constants.js',
    globalName: 'global.stageData'
  }
}

const splitStageType = (obj, stage) => {
  obj[typeof stage.reveal == 'string' ? 'mod' : 'item'].push(stage)
  return obj
}

const createTagName = stage =>
  `gamestage_${stage.name}`

const createZenScript = stages => {
  let lines = constants.zs.scriptStart.split('\n')

  const createEntry = stage => {
    let ingredients,
        symbol,
        name

    if(typeof stage.reveal == 'string')
      [ , symbol, name ] = /([@#]|)(.+)/.exec(stage.reveal)
    else {
      symbol = '#',
      name = createTagName(stage)
    }

    if(symbol == '@')
      ingredients = `loadedMods.getMod(${JSON.stringify(name)}).items`
    else
      ingredients = `[ <${symbol == '#' ? 'tag:items' : 'item'}:${name}> ]`

    switch(symbol) {
      case '@':
        
        break

      case '#'
        ingredients = ``
    }

    return `${stage.name}: ${ingredients}`
  }

  return lines.concat([
    `\nval stageItems = { ${stages.map(createEntry).join(', ')} } as IIngredient[string];`,
    constants.zs.createStagesBlock
  ]).join('\n').trim()
}

const createKubeScript = stages => {
  let data = { pickup: [], advancement: [] }

  for(let stage of stages) {
    let isolated = { name: stage.name, of: stage.of }

    switch(stage.on) {
      case constants.events.pickup:
        data.pickup.push(isolated)
        break

      case constants.events.advancement:
        data.advancement.push(isolated)
        break
    }
  }

  return `${constants.kube.globalName} = ${JSON.stringify(data)}`
}

const cleanRawStages = stages => {
  let cleanedStages = []

  for(let name in stages) {
    let stage = stages[name]
        out = stage

    if(!stage.of)
      if(stage.on == constants.events.pickup) {
        out.of = out.reveal
      } else {
        throw new Error("Stage missing 'of' descriptor")
      }

    out.name = name
    cleanedStages.push(out)
  }

  return cleanedStages
}

const generateScripts = rawStages => {
  let stages = cleanRawStages(rawStages)
      kubeScript = createKubeScript(stages),
      zenScript = createZenScript(stages)

  const write = (r, c) => writeFile(path.join(__dirname, '../../', r), c)

  Promise.all([
    write(constants.kube.path, kubeScript),
    write(constants.zs.path, zenScript)
  ])
    .then(a => console.log('Scripts generated') )
    .catch(e => console.error('Could not generate script:', e))
}

module.exports = generateScripts