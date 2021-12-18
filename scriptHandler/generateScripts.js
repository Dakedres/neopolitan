const { writeFile } = require('fs/promises'),
      path = require('path'),
      constants = require('./util/constants')

const createZenScript = stages => {
  let lines = constants.zenScript.scriptStart.split('\n')

  const createEntry = stage => {
    let ingredients,
        [ , symbol, name ] = /([@#]|)(.+)/.exec(stage.reveal)

    switch(symbol) {
      case '#':
        ingredients = `getTag(${JSON.stringify(name)})`; break

      case '@':
        ingredients = `loadedMods.getMod(${JSON.stringify(name)}).items`; break

      default:
        ingredients = `<items:${name}>`
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