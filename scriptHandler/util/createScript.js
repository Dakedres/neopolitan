const fs = require('fs/promises')

const createScript = (location, sections) =>
  fs.writeFile(
    location,
    sections
      .map(section => section.trim() )
      .join('\n'.repeat(2) )
  )

module.exports = createScript