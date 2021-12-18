const babel = require('@babel/core'),
      fs = require('fs/promises'),
      path = require('path'),
      constants = require('./constants').compile

const compile = async location => {
  let at = path.parse(location),
      code = await fs.readFile(location, constants.fileOptions),
      elapsed = Date.now(),
      out = await babel.transformAsync(code, constants.babelOptions(at.filename) )

  elapsed = Date.now() - elapsed
  await fs.writeFile(path.join(at.dir, constants.suffix(at.name) ), out.code, constants.fileOptions)
  console.log(`Compiled ${at.base}! Took ~${elapsed}ms`)
}

module.exports = compile