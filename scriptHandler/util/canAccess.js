const fs = require('fs/promises')

const canAccess = (...args) => {
  try {
    fs.access(...args)
    return true
  } catch {
    return false
  }
}

module.exports = canAccess