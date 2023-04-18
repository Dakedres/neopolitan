const materialFrom = (mod, name) =>
	new RegExp(`${mod}:(.*_|)${name}.*?$`)


const data = {
    quark: {
      decoration: {
        building: [
          {
            item: materialFrom('quark', 'shingles'),
            data: 'dymm.doc.quark.decoration.building.clay_shingles.block'
          }
        ]
      },
      exploration: {
        tools: [
          {
            item: 'quark:forgotten_hat',
            data: 'dymm.doc.quark.mod.world.archaeologist.hat'
          }
        ]
      }
    },
    alexsmobs: {
      decoration: {
        building: [
          {
            item: 'what',
            data: 'hm'
          }
        ]
      },
      mobs: {

      }
    }
  }

const categories = [
  'quark.*'
]

{
  const getValues = obj => {
    let out = []

    for(let key in obj)
      out.push(obj[key])

    return out
  }

  const flatten = (array) => {
    let out = []

    for(let value of array )
      out = out.concat(value)

    return out
  }

  // array of keys
  const navigateTo = function self(path, objs) {
    // console.log(path, objs)

    if(path.length > 0) {
      let key = path.shift(),
          out = []

      for(let obj of objs) {
        out = out.concat(key == '*' ? getValues(obj) : [ obj[key] ])
      }

      return self(path, out)
    } else {
      return objs
    }    
  }

  const flattenObject = function self(obj) {
    let out = []

    for(let key in obj) {
      let val = obj[key]

      if(typeof val == 'object' && !Array.isArray(val) ) {
        out = out.concat(flatten(self(val) ) )
      } else {
        out.push(val)
      }
    }

    return out
  }

  let entries = flatten(
    flatten(
      categories.map(path => navigateTo(path.split('.'), [ data ]) )
    ).map(flattenObject)
  )

  console.log(entries)

  onEvent('jei.information', info => {
    for(let { item, data } of entries) {
      console.log(item)
      console.log(data)

      info.add(item, Text.translate(data).toString().split('\n') )
      // info.add(item, [ 'what' ])
    }
  })
}