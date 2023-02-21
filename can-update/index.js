const { fail } = require('assert')

require('dotenv').config()

const fs = require('fs/promises'),
      path = require('path'),
      TOML = require('@iarna/toml'),
      fetch = require('node-fetch-cjs').default

const modDir = path.join(__dirname, '../pack/mods/'),
      cfModEndpoint = modId => `https://api.curseforge.com/v1/mods/${modId}/files`,
      mrModEndpoint = (projectId, versions, loader) => `https://api.modrinth.com/v2/project/${projectId}/version?game_versions=${JSON.stringify(versions)}&loaders=[${JSON.stringify(loader)}]`

const config = {
  versions: [ "1.19.2", "1.19" ],
  loader: "forge"
}

// fetch(cfModEndpoint + '403858/files', {
//   headers: {
//     'Accept': 'application/json',
//     'x-api-key': process.env.CF_API_KEY
//   }
// })
//   .catch(err => console.error(err))
//   .then(d => d.json() )
//   .then(d => console.log(d.data.filter(file => file.sortableGameVersions.find(v => v.gameVersionName == '1.19.2') )) )

// fetch('https://api.modrinth.com/v2/project/' + 'gvQqBUqZ/version?game_versions=["1.19.2"]', {
//   headers: {
//     'Accept': 'application/json'
//   }
// })
//   .catch(err => console.error(err))
//   .then(d => d.json() )
//   .then(d => console.log(d))

const testCurse = async modId => {
  let files = await fetch(cfModEndpoint(modId), {
    headers: {
      'Accept': 'application/json',
      'x-api-key': process.env.CF_API_KEY
    }
  })
    .catch(err => console.error(err))
    .then(res => {
      if(res.ok )
        return res.json()
      else
        console.error(`CF API call failed with status ${res.status}: ${res.statusText}`)
    })


  for(let file of files.data) {
    // if(file.sortableGameVersions.find(v => {
    //   return config.versions.includes(v.gameVersion)
    //       && config.loader == v.gameVersionName.toLowerCase()
    // }) )
      // return true
    if(file.gameVersions.find(v => config.versions.includes(v)) ) {
      return true
    }
  }
}

const testModrinth = async projectId => {
  let versions = await fetch(mrModEndpoint(projectId, config.versions, config.loader), {
    headers: {
      'Accept': 'application/json'
    }
  })
    .catch(err => console.error(err))
    .then(res => res.json() )

  return versions.length > 0
}

const testModlist = async (mods) => {
  let out = {
    fail: [],
    pass: []
  }

  for(let { filename, toml } of mods) {
    let data = TOML.parse(toml)

    if(!data.update)
      continue

    let [ key, value ] = Object.entries(data.update)[0]

    const sortMod = (pass) => {
      out[pass ? 'pass' : 'fail'].push({
        name: data.name,
        filename: data.filename,
        id: filename.split('.')[0],
      })
    }

    switch(key) {
      case 'modrinth':
        sortMod(await testModrinth(value['mod-id']))
        break

      case 'curseforge':
        sortMod(await testCurse(value['project-id']))
        break
    }
  }

  return out
}

fs.readdir(modDir, { withFileTypes: true })
  .then(async dirents => {
    let files = dirents
          .filter(d => d.isFile()),
        tomls = files
          .filter(d => d.name.endsWith('.pw.toml') )
          .map(d => fs.readFile(path.join(modDir, d.name) ).then(buf => ({
            filename: d.name,
            toml: buf
          })) )
        // jars = files
        //   .filter(d => d.name.endsWith('.jar') )
        //   .map(d => d.name)

    let data = await testModlist(await Promise.all(tomls) )

    console.log(data)
  })
  .catch(console.error)

// console.log(testCurse(238086))