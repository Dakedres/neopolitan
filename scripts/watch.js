const fs = require('fs/promises'),
      path = require('path')

const constants = require('./util/constants'),
      compile = require('./util/compile')

if(!fs.watch) {
  console.error('You must be using node.js version 16 or higher!')
  process.exit()
}

// watchFile(watching, () => {
//   generateScripts(require(watching) )

//   for(let item in require.cache)
//     delete item
// })

const shouldCompile = filename =>
  constants.compile.targetExt.includes(path.parse(filename).ext)

const handleWatcher = async (watcher, location) => {
  for await (const { eventType, filename } of watcher) {
    if(shouldCompile(filename) ) {
      switch(eventType) {
        case 'change': {
          let filePath = path.join(location, filename)

          compile(filePath)
        }
      }
    }
  }
}

const forceRecompile = async location => {
  let files = await fs.readdir(location, { withFileTypes: true }) 

  for(let file of files) {
    if(file.isFile() && shouldCompile(file.name) )
      compile(path.join(location, file.name) )
  }
}

const start = files => {
  // compile(path.join(constants.kube.path, 'startup_scripts/script.es6') )

  for(let file of files) {
    if(!file.isDirectory())
      continue

    let location = path.join(constants.kube.path, file.name),
        watcher = fs.watch(location)

    handleWatcher(watcher, location)

    if(process.argv.find(item => constants.forceRecompileExpressions.includes(item) ) )
      forceRecompile(location)
  }
}

fs.readdir(constants.kube.path, { withFileTypes: true }).then(start)