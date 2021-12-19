const { writeFile } = require('fs/promises'),
      path = require('path'),
      constants = require('./util/constants')

const createZenScript = stages => {
  let lines = constants.zenScript.scriptStart.split('\n')

  const createEntry = stage => {
    let ingredients,
        [ , symbol, name ] = /([@#]|)(.+)/.exec(stage.reveal)

    name = JSON.stringify(name)

    switch(symbol) {
      case '#':
        ingredients = `getTag(${name})`; break

      case '@':
        ingredients = `loadedMods.getMod(${name}).items`; break

      default:
        ingredients = `getItem(${name})`
    }
    
    return `${stage.name}: ${ingredients}`
  }

  lines = lines.concat([
    `val modStages = { ${stages.map(createEntry).join(', ')} } as List<IItemStack>[string];`,
    constants.zenScript.modStageBlock
  ])

  return lines.join('\n').trim()
}

const generateScripts = stages => {
  let zenScript = createZenScript(stages)

  writeFile(constants.zenScript.path, zenScript)
    .then(() => console.log('Gamestages generated!') )
    .catch(e => console.error('Could not generate script:', e))
}

module.exports = generateScripts