require('dotenv').config()

const fs = require('fs-extra'),
      path = require('path')

let sourceRoot = path.join(process.cwd(), 'pack')

;(async () => {
  for(let item of require('./targets.json') ) {
    let sourceDir = path.join(sourceRoot, item),
        instanceDir = path.join(process.env.DEV_INSTANCE_ROOT, item)

    await fs.remove(sourceDir)
  
    await fs.copy(
      instanceDir,
      sourceDir
    )
      .catch(console.error)
      .then(() => {
        console.log(`Copied ${item}`)
      })
  }
})()