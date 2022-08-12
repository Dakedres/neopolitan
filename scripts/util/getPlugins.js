// const compatData = require('@babel/compat-data/scripts/data/plugin-features')
const compatData = require('./pluginFeatures')

const pluginsInclude = (plugins, search) =>
  undefined != plugins.find(plugin => plugin[0] == search)

const getPlugins = (excludeStandard, includePlugins) => {
  let plugins = includePlugins

  for(let standard in compatData) {
    if(!excludeStandard.includes(standard) )
      plugins = plugins.concat(compatData[standard])
  }

  let occured = []

  return plugins
    .map(n => Array.isArray(n) ? n : [ n ])
    .map(n => {
      n[0] = '@babel/plugin-' + n[0]
      return n
    })
    .filter(v => {
      if(pluginsInclude(occured, v) ) {
        console.log('Duplicate ' + v + ' removed')
        return false
      } else {
        occured.push(v)
        return true
      }
    })
}

module.exports = getPlugins