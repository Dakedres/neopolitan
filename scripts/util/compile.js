// Bun workarounds until
//  - process.stderr is implemented
//  - execArgv is implemented/polyfilled/whatever
process.stderr = Bun.stderr
process.execArgv = []

const createScript = require('./createScript')

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
    

const compile = async (location) => {
  let at = path.parse(location),
      writeTo = path.join(at.dir, constants.suffix(at.name) ),
      lines = (await fs.readFile(location, constants.fileOptions) )
        .trim()
        .split('\n'),
      error,
      elapsed = Date.now(),
      // Look for a priority comment and get the priority value if applicable
      priority = constants.priorityRegex.exec(lines[0].trim() )?.[1]

  if(priority === undefined) {
    priority = 0
  } else {
    // Remove priority comment so we can add our own later
    lines.splice(0, 1)
  }

  let out = await babel.transformAsync(lines.join('\n'), constants.babelOptions(at.filename) )
        .catch(err => {
          error = err
        })

  if(error) {
    console.error(`Could not compile "${at.base}":\n `, error)
  
    await fs.writeFile(writeTo, `throw new Error(${formatError(error.toString() )})`)
    console.warn('Wrote error to file')
  } else {
    const sections = [
      constants.header(priority),
    ]

    sections.push(out.code)

    elapsed = Date.now() - elapsed
    await createScript(writeTo, sections)

    console.log(`Compiled "${at.base}"! Took ~${elapsed}ms`)
  }
}

module.exports = compile