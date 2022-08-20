// priority: 1

const genericStage = (mod, ...patterns) =>
  patterns.reduce((out, pattern) => {
    // Regex to grab the item wrapped in paranthenses
    out[/.*\((\w*?)\).*/.exec(pattern)[1]] = {
      reveal: [ new RegExp(`${mod}:${pattern}$`) ]
    }

    return out
  }, {})

const dynArray = items => typeof items[0] == 'object' ? items[0] : items

const materialFrom = (mod, ...names) =>
	dynArray(names).map(name => new RegExp(`${mod}:(.*[\/_]|)${name}.*?$`) )

const materialStage = (mod, ...names) =>
  dynArray(names).reduce((out, name) => {
    out[name] = {
      reveal: new RegExp(`${mod}:(.*[\/_]|)${name}.*?$`)
    }

    return out
  }, {})

const singleStage = (...items) =>
  dynArray(items).reduce((out, reveal) => {
    out[reveal.split(':')[1]] = { reveal }
    return out
  }, {})

const singleFrom = (mod, ...items) =>
  singleStage(dynArray(items).map(i => mod + ':' + i) )

const modStages = (...mods) =>
  dynArray(mods).reduce((out, mod) => {
    out[mod] = { reveal: [ '@' + mod ] }
    return out
  }, {})

const mapStages = (stages, mapper) => {
  let out = {}

  for(let key in stages) {
    out[key] = mapper(stages[key])
  }

  return out
}

const singleTrade = (weight = 1, cost = 1, uses) => item => ({
  weight,
  cost,
  uses,
  sell: Item.of(item),
})

const extraUnhidden = (reveal, extra) => ({
  reveal,
  of: reveal.concat(extra)
})

const forMods = (mods, func, ...args) => {
  let out = []

  for(let mod of mods) {
    out = out.concat(func(mod, ...args) )
  }
  
  return out
}

const itemFrom = (mod, ...names) =>
	dynArray(names).map(name => mod + ':' + name)

const getItemStacks = (query) =>
  Ingredient.of(query).getItemIds().map(id => Item.of(id))
  
const getItemIds = (query) =>
  Ingredient.of(query).getItemIds().toArray()

const mapObject = (object, callback) =>
  Object.entries(object).reduce((accumulator, [ key, value ], ...args) => {
    let callbackResult = callback(key, value, ...args)

    accumulator[callbackResult[0] ] = callbackResult[1]
    return accumulator
  }, {})