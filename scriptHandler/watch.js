const fs = require('fs/promises'),
      path = require('path')

const handleGamestages = require('./handleGamestages'),
      constants = require('./util/constants'),
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

const handleWatcher = async (watcher, location) => {
  for await (const { eventType, filename } of watcher) {
    if(constants.compile.targetExt.includes(path.parse(filename).ext) ) {
      switch(eventType) {
        // case 'rename': {
        //   const compiledFile = path.join(location, constants.compile.suffix(path.parse(filename).name) )

        //   try {
        //     await fs.access(compiledFile)
        //     console.log(compiledFile)
        //   } catch(err) {}
        // }

        case 'change': {
          let filePath = path.join(location, filename)

          if(filePath == constants.gamestagePath)
            handleGamestages(filePath)
          else
            compile(filePath)
        }
      }
    }
  }
}

const start = files => {
  for(let file of files) {
    if(!file.isDirectory())
      continue

    let location = path.join(constants.kubePath, file.name),
        watcher = fs.watch(location)

    handleWatcher(watcher, location)
  }
}

fs.readdir(constants.kubePath, { withFileTypes: true }).then(start)