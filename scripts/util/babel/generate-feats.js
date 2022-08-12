const feats = require('./plugin-features.js')

module.exports = Object.entries(feats).reduce((a, v) => { a[v[0]] = Object.keys(v[1]); return a }, {})