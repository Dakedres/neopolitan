const generateScripts = require('./generateScripts'),
      compile = require('./util/compile')
      path = require('path')

const start = location => {
  Promise.all([
    generateScripts(require(location) ),
    compile(location)
  ])

  for(let item in require.cache)
    delete item
}

if(require.main == module)
  start()
else
  module.exports = start