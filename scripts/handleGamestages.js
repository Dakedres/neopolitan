const compile = require('./util/compile'),
      constants = require('./util/constants')
      path = require('path')

const start = location => {
  compile(location)

  for(let item in require.cache)
    delete item
}

if(require.main == module)
  start(constants.gamestagePath)
else
  module.exports = start