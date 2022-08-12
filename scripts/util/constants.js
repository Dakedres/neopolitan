require('dotenv').config()

const path = require('path'),
      getPlugins = require('./getPlugins')

const pathArg = process.argv.filter(item => item.startsWith('--') )[2] || process.env.DEV_INSTANCE_ROOT
      targetDir = pathArg ?
        (pathArg[0] == '/' ? pathArg : path.join(process.cwd(), pathArg) ) :
        path.join(__dirname, '../../pack'),
      kubePath = path.join(targetDir, 'kubejs/'),
      plugins = getPlugins([
        'es5',
        'es2015Parameter',
        'es2015',
        'es2018'
      ], [
        // ES2015
        // "transform-template-literals",
        "transform-literals",
        // "transform-function-name",
        // "transform-arrow-functions",
        "transform-block-scoped-functions",
        "transform-classes",
        "transform-object-super",
        "transform-shorthand-properties",
        "transform-duplicate-keys",
        "transform-computed-properties",
        // "transform-for-of",
        "transform-sticky-regex",
        "transform-unicode-escapes",
        "transform-unicode-regex",
        "transform-spread",
        "transform-destructuring",
        "transform-block-scoping",
        // "transform-typeof-symbol",
        "transform-new-target",
        "transform-regenerator",

        // ES2018
        'proposal-async-generator-functions',
        'transform-dotall-regex',
        'proposal-unicode-property-regex',
        'transform-named-capturing-groups-regex',

        "external-helpers"
      ])
      .concat([
        "transform-parameters-rhino",
        [
          'proposal-object-rest-spread-rhino',
          {
            useBuiltIns: true
          }
        ],
      ])

console.log(plugins)

module.exports = {
  targetDir,
  kube: {
    path: kubePath,
    startup: 'startup_scripts',
    server: 'server_scripts',
    client: 'client_scripts'
  },
  forceRecompileExpressions: [
    '--force-recompile',
    '-r'
  ],
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
}

function getItem(resourceLocation as string) as List<IItemStack> {
  return [ BracketHandlers.getItem(resourceLocation) ];
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
    priorityRegex: /^\/\/\s*priority:\s*(\d+)$/,
    babelOptions: filename => ({
      filename,
      // "presets": [
      //   [
      //     "@babel/preset-env",
      //     {
      //       targets: {
      //         rhino: "1.7.13"
      //       },
      //       modules: false
      //     }
      //   ]
      // ]
      plugins: plugins

    }),
    header: priority => `
// priority: ${priority}

/*
  The following script has been compiled with Babel, if you wish to make any edits, clone https://github.com/dakedres/neopolitan-mc and
    follow the instructions provided in the "Script compilation" section of the readme.
*/
    `
  },

  babelHelpers: {
    filename: 'babelHelpers.js',
    allowList: [
      'toConsumableArray',
      'arrayWithoutHoles',
      'iterableToArray',
      'unsupportedIterableToArray',
      'nonIterableSpread',
      'defineProperty',
      'createClass',
      'classCallCheck'
      // 'arrayLikeToArray'
    ],
    header: `
// priority: 255
    `,
    import: `
var babelHelpers = global.babelHelpers
    `
  },

  releaseEndpoint: repo =>
    `https://api.github.com/repos/${repo}/releases`,

  packwizBootstrap: {
    repo: 'packwiz/packwiz-installer-bootstrap',
    filename: 'packwiz-installer-bootstrap.jar'
  },
  githubOptions: {
    headers: {
      'Accept': "application/vnd.github.v3+json"
    }
  }
}