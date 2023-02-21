// console.log(process.env.npm_config_platform = 'linux')
// console.log(process.env.npm_config_arch = 'x64')
// console.log(process.versions.modules = 93)
// console.log(process.versions.uv = '1.42.0')

const fs = require('fs/promises'),
      path = require('path'),
      watcher = require('@parcel/watcher')
const canAccess = require('./util/canAccess')

const constants = require('./util/constants'),
      compile = require('./util/compile')

// if(!fs.watch) {
//   console.error('You must be using node.js version 16 or higher!')
//   process.exit()
// }

// watchFile(watching, () => {
//   generateScripts(require(watching) )

//   for(let item in require.cache)
//     delete item
// })

const shouldCompile = filename =>
  constants.compile.targetExt.includes(path.parse(filename).ext)

const handleEvent = async (err, events) => {
  if(err) {
    console.error(err)
    return
  }

  for(let event of events) {
    if(shouldCompile(event.path) ) {
      switch(event.type) {

        case 'update':
        case 'create': {
          compile(event.path)
          break
        }

        case 'delete': {
          let { dir, name, base } = path.parse(event.path),
              compiledPath = path.join(dir, constants.compile.suffix(name) )

          if(canAccess(compiledPath) )
            fs.unlink(compiledPath)
              .then(() => console.log(`Cleaned compiled scripts for "${base}"`))

          break
        }
  
      }
    }
  }

  // for await (const { eventType, filename } of watcher) {
  //   if(shouldCompile(filename) ) {
  //     switch(eventType) {
  //       case 'change': {
  //         let filePath = path.join(location, filename)

  //         compile(filePath)
  //       }
  //     }
  //   }
  // }
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

  let watcherInstances = []

  for(let file of files) {
    if(!file.isDirectory())
      continue

    let location = path.join(constants.kube.path, file.name)
      
    watcherInstances.push(
      watcher.subscribe(location, handleEvent)
    )
    // handleWatcher(watcher, location)

    if(process.argv.find(item => constants.forceRecompileExpressions.includes(item) ) )
      forceRecompile(location)
  }

  Promise.all(watcherInstances)
    .then(() => console.log('Listening for changes...') )
}

fs.readdir(constants.kube.path, { withFileTypes: true }).then(start)