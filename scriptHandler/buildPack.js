const path = require('path'),
      fs = require('fs/promises'),
      constants = require('./util/constants'),
      ADMZip = new require('adm-zip'),
      fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// import 'path'
// import 'fs'
// import 'node-fetch'

// import * as constants from './util/constants'

const accessDir = relpath => {
  let loc = path.join(__dirname, relpath)

  return fs.access(loc)
    .catch(async err => {
      await fs.mkdir(loc, { recursive: true })

      return loc
    })
    .then(() => loc)
}

const githubFetch = endpoint =>
  fetch(endpoint, constants.githubOptions)

const createReleaseName = target =>
  [ 'Neopolitan', target.name, 'Auto-Update', 'r' + target.version ].join('-')

const target = {
  buildDir: '../build/multimc',
  distDir: '../dist/auto-update',
  bootstrapPath: '.minecraft',
  name: 'MultiMC',
  version: 0
}

;(async () => {
  const { packwizBootstrap } = constants

  let zip = new ADMZip(),
      bootstrapper = await githubFetch(constants.releaseEndpoint(packwizBootstrap.repo) )
        .then(r => r.json())
        .then(releases =>
          releases[0].assets.find(a => a.name == packwizBootstrap.filename)
        )

  if(bootstrapper) {
    bootstrapper = await fetch(bootstrapper.url)
      // .then(r => r.body())
  } else {
    throw new Error('Could not retrieve packwiz installer bootstrap')
  }

  zip.addLocalFolder(await accessDir(target.buildDir) )
  zip.addFile(path.join(target.bootstrapPath, packwizBootstrap.filename), bootstrapper)

  zip.writeZip(
    path.join(await accessDir(target.distDir), createReleaseName(target) + '.zip')
  )
})()