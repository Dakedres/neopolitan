const path = require('path')

const pathArg = process.argv[2]
      targetDir = pathArg ?
        (pathArg[0] == '/' ? pathArg : path.join(process.cwd(), pathArg) ) :
        path.join(__dirname, '../../pack'),
      kubePath = path.join(targetDir, 'kubejs/')

module.exports = {
  targetDir,
  kubePath,
  gamestagePath: path.join(kubePath, 'startup_scripts/gamestages.es6'),
  zenScript: {
    path: path.join(targetDir, 'scripts/gamestages.zs'),
    scriptStart: `
import mods.itemstages.ItemStages;
import stdlib.List;
import crafttweaker.api.item.IItemStack;
import crafttweaker.api.BracketHandlers;

function getTag(resourceLocation as string) as List<IItemStack> {
  var out = new List<IItemStack>();

  for definition in <tagmanager:items>.getTag(BracketHandlers.getResourceLocation(resourceLocation) ).elements {
    out.add(definition.defaultInstance);
  }

  return out;
}\n`,
    modStageBlock:`
for name in modStages {
  for item in modStages[name] {
    val res = ItemStages.restrict(item, name);
    res.preventInventory(false);
    res.preventPickup(false);
  }
}\n`
  },
  compile: {
    targetExt: [ '.es', '.es6' ],
    suffix: filename => `${filename}.compiled.js`,
    fileOptions: { encoding: 'utf-8' },
    babelOptions: filename => ({
      filename,
      "presets": [
        [
          "@babel/preset-env",
          {
            targets: {
              rhino: "1.7.13"
            },
            modules: false
          }
        ]
      ]
    })
  }
}