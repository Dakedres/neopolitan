require('dotenv').config()

const fs = require('fs-extra'),
      path = require('path')

let sourceRoot = path.join(process.cwd(), 'pack')

;(async () => {
  for(let item of require('./targets.json') ) {
    let sourceDir = path.join(sourceRoot, item),
        instanceDir = path.join(process.env.DEV_INSTANCE_ROOT, item)

    if(await fs.pathExists(instanceDir) ) {
      console.warn(`Path "${item}" is already defined in instance, refusing to copy over`)
    } else if(!await fs.pathExists(sourceDir) ) {
      console.error(`Path "${item}" does not exist in source.`)
    } else {
      console.log(sourceDir, instanceDir)
      await fs.copy(
        sourceDir,
        instanceDir
      )
        .catch(console.error)
        .then(() => {
          console.log(`Copied "${item}"`)
        })
    }
  }
})()