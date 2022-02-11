function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var genericStage = function genericStage(mod) {
  for (var _len = arguments.length, patterns = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    patterns[_key - 1] = arguments[_key];
  }

  return patterns.reduce((out, pattern) => {
    // Regex to grab the item wrapped in paranthenses
    out[/.*\((\w*?)\).*/.exec(pattern)[1]] = {
      reveal: [new RegExp("".concat(mod, ":").concat(pattern, "$"))]
    };
    return out;
  }, {});
};

var dynArray = items => typeof items[0] == 'object' ? items[0] : items;

var materialFrom = function materialFrom(mod) {
  for (var _len2 = arguments.length, names = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    names[_key2 - 1] = arguments[_key2];
  }

  return dynArray(names).map(name => new RegExp("".concat(mod, ":(.*_|)").concat(name, ".*?$")));
};

var materialStage = function materialStage(mod) {
  for (var _len3 = arguments.length, names = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
    names[_key3 - 1] = arguments[_key3];
  }

  return dynArray(names).reduce((out, name) => {
    out[name] = {
      reveal: new RegExp("".concat(mod, ":(.*_|)").concat(name, ".*?$"))
    };
    return out;
  }, {});
};

var single = function single() {
  for (var _len4 = arguments.length, items = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
    items[_key4] = arguments[_key4];
  }

  return dynArray(items).reduce((out, reveal) => {
    out[reveal.split(':')[1]] = {
      reveal: reveal
    };
    return out;
  }, {});
};

var singleFrom = function singleFrom(mod) {
  for (var _len5 = arguments.length, items = new Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
    items[_key5 - 1] = arguments[_key5];
  }

  return single(dynArray(items).map(i => mod + ':' + i));
};

var modStages = function modStages() {
  for (var _len6 = arguments.length, mods = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
    mods[_key6] = arguments[_key6];
  }

  return dynArray(mods).reduce((out, mod) => {
    out[mod] = {
      reveal: '@' + mod
    };
    return out;
  }, {});
}; // const forMods = (processor, mods, ...args) =>
//   mods.reduce((out, mod) => {
//     let data = processor(mod, ...args)
//     for(let key in data) {
//       let outValue = out[key]
//       if(outValue) {
//         outValue.reveal = outValue.reveal.concat(data[key].reveal)
//       } else {
//       }
//     }
//   }, {})


var gamestages = _objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread({}, modStages('create', 'pitchperfect')), materialStage('darkerdepths', 'limestone', 'grimstone', 'shale', 'petrified')), {}, {
  //   The above is equivalent to:
  // shale: {
  //   on: "discover",
  //   reveal: [
  //     /darkerdepths:.*?_shale$/
  //   ]
  // },
  // grimestone: {
  //   on: "discover",
  //   reveal: [
  //     /darkerdepths:grimestone.*?$/
  //   ]
  // }
  // ...ect
  //   Also an option to similar ends
  // ...genericStage('darkerdepths', '(grimestone).*?', '(.*_|)(shale).*?', '(.*_|)(petrified).*?'),
  // This doesn't work I have no idea
  insect_bottle: {
    reveal: /buzzier_bees:.*?_bottle$/
  }
}, materialStage('alexsmobs', 'crocodile', 'moose', 'kangaroo', 'dropbear')), singleFrom('alexsmobs', 'sombrero', 'mimicream')), {}, {
  void_worm: {
    //   'on' isn't even needed if it's discover
    // on: "discover",
    or: "alexsmobs:alexsmobs/void_worm_kill",
    reveal: ['#alexsmobs:void_worm_drops', 'alexsmobs:void_worm_beak', 'alexsmobs:dimensional_carver']
  },
  frontier_cap: {
    reveal: ['alexsmobs:frontier_cap', 'alexsmobs:raccoon_tail', 'alexsmobs:bear_fur']
  },
  banana: {
    reveal: ['alexsmobs:banana', 'alexsmobs:banana_peel', 'alexsmobs:sopa_de_macaco']
  },
  glowstone_canyon: {
    reveal: ['#infernalexp:glowstone_canyon_blocks']
  }
}, materialStage('endergetic', 'boof', 'corrock')), single('endergetic:acidian_lantern')), {}, {
  puffbug: {
    reveal: ['endergetic:puffbug_hive', 'endergetic:puffbug_bottle']
  },
  eumus: {
    reveal: [].concat(_toConsumableArray(materialFrom('endergetic', 'eumus')), ['endergetic:poismoss'])
  },
  bollom: {
    reveal: ['endergetic:bolloom_fruit'].concat(_toConsumableArray(materialFrom('endergetic', 'bolloom_balloon')))
  },
  // booflo: {
  //   reveal: [
  //     'endergetic:boof_block',
  //     'endergetic:boof_hide',
  //     'endergetic:booflo_vest'
  //   ]
  // }
  // Special recipes
  slingshot: {
    reveal: ['quark:ravager_hide', 'supplementaries:slingshot']
  },
  hemp: {
    reveal: ['immersiveengineering:seed', // hemp seed
    'immersiveengineering:hemp_fiber', 'immersiveengineering:wirecoil_structure_rope', 'supplementaries:rope', 'supplementaries:rope_arrow', 'tetra:modular_toolbelt']
  }
}, single.apply(void 0, ["alexsmobs:music_disc_daze", "alexsmobs:music_disc_thime", "cavesandcliffs:music_disc_otherside", "infernalexp:music_disc_flush", "infernalexp:music_disc_soul_spunk", "quark:music_disc_chatter", "quark:music_disc_clock", "quark:music_disc_crickets", "quark:music_disc_drips", "quark:music_disc_endermosh", "quark:music_disc_fire", "quark:music_disc_ocean", "quark:music_disc_rain", "quark:music_disc_wind", "endergetic:music_disc_kilobyte"])), materialStage('supplementaries', 'sign_post', 'flag')), {}, {
  // ...forMods(materialStage, [
  //   'decorative_blocks',
  //   'decorative_blocks_abnormals',
  //   'muchmoremodcompat'
  // ], [
  //   // TODO: Make sure the player can encounter each of these
  //   'seat',
  //   'palisade',
  //   'support',
  //   'beam'
  // ]),
  copper: {
    reveal: ['#forge:ores/copper', '#forge:ingots/copper', '#forge:nuggets/copper', '#forge:plates/copper', '#forge:dusts/copper', 'create:crushed_copper_ore'].concat(_toConsumableArray(materialFrom('create', 'copper')), _toConsumableArray(materialFrom('immersiveengineering', 'copper')), ['immersiveengineering:coil_lv'], _toConsumableArray(materialFrom('cavesandcliffs', 'copper')), ['chimes:copper_chimes', 'supplementaries:copper_lantern'])
  }
}, materialStage('create', 'gabbro', 'dolomite')), materialStage('darkerdepths', 'grimestone', 'limestone')), materialStage('cavesandcliffs', 'deepslate')), materialStage('infernalexp', 'soul_stone')), materialStage('enhanced_mushrooms', 'red_mushroom', 'brown_mushroom', 'glowshroom')), materialStage('endergetic', 'poise')), {}, {
  honey_pot: {
    of: ['minecraft:honeycomb', 'minecraft:honey_block'],
    reveal: ['buzzier_bees:honey_pot']
  },
  candles: {
    of: ['minecraft:honeycomb', 'quark:tallow'],
    reveal: '#buzzier_bees:candles'
  },
  //   _______          _     
  //  |__   __|        | |    
  //     | | ___   ___ | |___ 
  //     | |/ _ \ / _ \| / __|
  //     | | (_) | (_) | \__ \
  //     |_|\___/ \___/|_|___/                     
  // 
  sweets: {
    reveal: ['buzzier_bees:honey_apple', 'buzzier_bees:honey_bread', 'buzzier_bees:glazed_porkchop', 'create:honeyed_apple', 'minecraft:honey_bottle', 'buzzier_bees:sticky_honey_wand', 'supplementaries:candy']
  }
});

{
  var isKube = this.global;

  if (!isKube) {
    module.exports = [];
  }

  var constants = {
    events: {
      pickup: 'discover',
      advancement: 'advance'
    }
  };
  var data = {
    pickup: [],
    advancement: []
  },
      tags = {};

  var filterToTag = (stageName, content) => {
    if (typeof content == 'object') {
      var name = 'gamestages:' + stageName;
      tags[name] = Array.isArray(content) ? content : [content];
      return '#' + name;
    } else {
      return content;
    }
  };

  for (var name in gamestages) {
    var stage = gamestages[name];
    out = stage;
    out.name = name;
    out.reveal = filterToTag(out.name, out.reveal);
    if (!stage.on) stage.on = constants.events.pickup; // if(stage.notify == undefined)
    //   stage.notify = true

    if (!stage.of) {
      if (stage.on == constants.events.pickup) {
        out.of = out.reveal;
      } else {
        throw new Error("Stage missing 'of' descriptor");
      }
    } else {
      out.of = filterToTag(out.name, out.of);
    }

    if (isKube) {
      switch (stage.on) {
        case constants.events.advancement:
          data.advancement.push(out);
          break;

        case constants.events.pickup:
          data.pickup.push(out);
          if (out.or) data.advancement.push({
            of: out.or,
            name: name
          });
          break;
      }
    } else {
      module.exports.push(out);
    }
  }

  if (isKube) {
    global.stageData = data;
    console.log('TAG DATA');
    console.log(tags);
    onEvent('item.tags', event => {
      var _loop = function _loop(_name) {
        tags[_name].forEach(i => event.add(_name, i));
      };

      for (var _name in tags) {
        _loop(_name);
      }
    });
  }
}