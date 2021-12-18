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
import crafttweaker.api.item.IIngredient;

function createStage(name as string, items as List<IIngredient>) as void {
  for item in items {
    val res = ItemStages.restrict(item, name);
    res.preventInventory(false);
    res.preventPickup(false);
  }
}\n`,
    modStageBlock:`
for name in modStages {
  createStage(name, loadedMods.getMod(modStages[name]).items);
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

const createZenScript = stages => {
  let lines = constants.zs.scriptStart.split('\n'),
      stageTypes = stages.reduce(splitStageType, { mod: [], item: [] })

  if(stageTypes.mod) {
    const createEntry = stage =>
      `${stage.name}: ${JSON.stringify(stage.reveal)}`

    lines = lines.concat([
      `val modStages = { ${stageTypes.mod.map(createEntry).join(', ')} } as string[string];`,
      constants.zs.modStageBlock
    ])
  }

  if(stageTypes.item) {
    const createHandler = descriptor => {
      const [ , symbol, name ] = /([@#]|)(.+)/.exec(descriptor)

      return `<${symbol == '#' ? 'tag:items' : 'item'}:${name}>`
    }

    const createCall = stage =>
      `createStage(${JSON.stringify(stage.name)}, [ ${stage.reveal.map(createHandler).join(', ') } ]);`

    lines = lines.concat(stageTypes.item.map(createCall))
  }

  return lines.join('\n').trim()
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