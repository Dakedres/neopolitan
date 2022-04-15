const babel = require('@babel/core'),
      fs = require('fs/promises'),
      path = require('path'),
      constants = require('./constants').compile,
      canAccess = require('./canAccess')

const formatError = str => 
  JSON.stringify(
    // Remove formatting unicode
    str.replace(/\x1b\[\d+m/g, '') + '\n'
  )
    

const compile = async location => {
  let at = path.parse(location),
      writeTo = path.join(at.dir, constants.suffix(at.name) ),
      code = await fs.readFile(location, constants.fileOptions),
      elapsed = Date.now(),
      error,
      out = await babel.transformAsync(code, constants.babelOptions(at.filename) )
        .catch(err => {
          error = err
        })

  if(error) {
    console.error(`Could not compile "${at.base}":\n `, error)
  
    // if(canAccess(writeTo) ) {

    // }
    // await fs.readFile(writeTo)
    await fs.writeFile(writeTo, `throw new Error(${formatError(error.toString() )})`)
    console.warn('Wrote error to file')
  } else {
    elapsed = Date.now() - elapsed
    await fs.writeFile(writeTo, out.code, constants.fileOptions)

    console.log(`Compiled "${at.base}"! Took ~${elapsed}ms`)
  }
}

module.exports = compile