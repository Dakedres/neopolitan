function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var isKube = this.global;
var Item = isKube ? Item : {
  of: id => id.split(' ').pop()
}; // Util functions

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

var singleStage = function singleStage() {
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

  return singleStage(dynArray(items).map(i => mod + ':' + i));
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
};

var mapStages = (stages, mapper) => {
  var out = {};

  for (var key in stages) {
    out[key] = mapper(stages[key]);
  }

  return out;
};

var singleTrade = function singleTrade() {
  var weight = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
  var cost = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  var uses = arguments.length > 2 ? arguments[2] : undefined;
  return item => ({
    weight: weight,
    cost: cost,
    uses: uses,
    sell: Item.of(item)
  });
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
// Gamestages


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
  insect_bottle: {
    reveal: /buzzier_bees:.*?_bottle$/,
    trades: [singleTrade(2)('buzzier_bees:silverfish_bottle')]
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
}, materialStage('endergetic', 'boof', 'corrock')), singleStage('endergetic:acidian_lantern')), {}, {
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
    reveal: ['quark:ravager_hide'],
    revealTrades: singleTrade(2, 24)('supplementaries:slingshot')
  },
  hemp: {
    reveal: ['immersiveengineering:hemp_fiber', 'immersiveengineering:wirecoil_structure_rope', 'supplementaries:rope', 'supplementaries:rope_arrow', 'tetra:modular_toolbelt'],
    revealTrades: [{
      cost: 1,
      sell: Item.of('8x immersiveengineering:seed'),
      // hemp seed
      weight: 5,
      uses: 2
    }]
  },
  amethyst: {
    of: _toConsumableArray(materialFrom('cavesandcliffs', 'amethyst')),
    reveal: ['supplementaries:amethyst_arrow', 'immersiveengineering:silver', 'chimes:amethyst_chimes']
  }
}, mapStages(singleStage("alexsmobs:music_disc_daze", "alexsmobs:music_disc_thime", "cavesandcliffs:music_disc_otherside", "infernalexp:music_disc_flush", "infernalexp:music_disc_soul_spunk", "quark:music_disc_chatter", "quark:music_disc_clock", "quark:music_disc_crickets", "quark:music_disc_drips", "quark:music_disc_endermosh", "quark:music_disc_fire", "quark:music_disc_ocean", "quark:music_disc_rain", "quark:music_disc_wind", "endergetic:music_disc_kilobyte"), stage => {
  stage.hidden = true;
  return stage;
})), materialStage('supplementaries', 'sign_post', 'flag')), {}, {
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
  },
  sunmetal: {
    reveal: ['#forge:ores/electrum', '#forge:ingots/electrum', '#forge:nuggets/electrum', '#forge:plates/electrum', '#forge:dusts/electrum'].concat(_toConsumableArray(materialFrom('alloyed', 'bronze')), _toConsumableArray(materialFrom('architects_palette', 'sunmetal')), _toConsumableArray(materialFrom('immersiveengineering', 'electrum')), ['immersiveengineering:coil_mv', 'moreminecarts:lightspeed_cross_rail']),
    revealTrades: [{
      cost: 1,
      sell: '3x kubejs:crushed_sunmetal',
      weight: 2,
      uses: 5
    }, {
      cost: 4,
      sell: '12x moreminecarts:lightspeed_rail',
      weight: 2,
      uses: 2
    }]
  },
  brass: {
    reveal: ['#forge:ores/brass', '#forge:ingots/brass', '#forge:nuggets/brass', '#forge:plates/brass', '#forge:dusts/brass'].concat(_toConsumableArray(materialFrom('create', 'brass'))),
    trades: singleTrade(3, 2, 2)('3x create:brass_ingot')
  }
}, materialStage('create', 'gabbro', 'dolomite')), materialStage('darkerdepths', 'grimestone', 'limestone')), materialStage('cavesandcliffs', 'deepslate')), materialStage('infernalexp', 'soul_stone')), materialStage('enhanced_mushrooms', 'red_mushroom', 'brown_mushroom', 'glowshroom')), materialStage('endergetic', 'poise')), {}, {
  honey_pot: {
    of: ['minecraft:honeycomb', 'minecraft:honey_block'],
    reveal: ['buzzier_bees:honey_pot']
  },
  candles: {
    of: ['minecraft:honeycomb', 'quark:tallow', '#buzzier_bees:candles'],
    reveal: '#buzzier_bees:candles',
    trades: [].concat(_toConsumableArray(['buzzier_bees:lily_of_the_valley_scented_candle', 'buzzier_bees:buttercup_scented_candle', 'buzzier_bees:pink_clover_scented_candle'].map(singleTrade())), [singleTrade(2, 1, 5)('2x buzzier_bees:candle')])
  },
  //   _______          _     
  //  |__   __|        | |    
  //     | | ___   ___ | |___ 
  //     | |/ _ \ / _ \| / __|
  //     | | (_) | (_) | \__ \
  //     |_|\___/ \___/|_|___/                     
  // 
  sweets: {
    reveal: ['buzzier_bees:honey_bread', 'create:honeyed_apple', 'minecraft:honey_bottle'],
    revealTrades: ['buzzier_bees:sticky_honey_wand', 'supplementaries:candy', 'buzzier_bees:glazed_porkchop', 'create:honeyed_apple'].map(singleTrade(1, 1, 8))
  },
  jar: {
    revealTrades: ['supplementaries:jar', 'supplementaries:jar_tinted'].map(singleTrade(2, 2))
  },
  cage: {
    revealTrades: [// he sell monkey
    {
      cost: 19,
      item: Item.of('supplementaries:cage', '{BlockEntityTag:{MobHolder:{EntityData:{Brain:{memories:{}},HurtByTimestamp:0,ForgeData:{specialai:{door_breaking:0b,elite_ai:{},depacify:0b,fiddling:0b,griefing:0b,aggressive:0b,dodge_arrows:0.0d,avoid_explosions:1.4d,rider:0b,call_for_help:1b},challenger_mob_checked:1b},Sitting:0b,Attributes:[{Base:0.0d,Name:"minecraft:generic.knockback_resistance"},{Base:1.0d,Name:"forge:swim_speed"},{Base:16.0d,Modifiers:[{Operation:1,UUID:[I;1227436563,-514177694,-1821864105,-708036451],Amount:0.060202893994683176d,Name:"Random spawn bonus"}],Name:"minecraft:generic.follow_range"},{Base:0.4000000059604645d,Name:"minecraft:generic.movement_speed"},{Base:0.08d,Name:"forge:entity_gravity"}],Invulnerable:0b,FallFlying:0b,ForcedAge:0,PortalCooldown:0,AbsorptionAmount:0.0f,FallDistance:0.0f,InLove:0,CanUpdate:1b,DeathTime:0s,ForcedToSit:0b,BoundingBox:[0.17500001192092896d,0.0626d,0.17500001192092896d,0.824999988079071d,0.8126d,0.824999988079071d],ForgeCaps:{"structure_gel:gel_entity":{portal:"structure_gel:empty"},"enchantwithmob:mob_enchant":{FromOwner:0b,StoredMobEnchants:[]},"citadel:extended_entity_data_citadel":{}},HandDropChances:[0.085f,0.085f],PersistenceRequired:1b,id:"alexsmobs:capuchin_monkey",Age:0,Motion:[0.0d,-0.1552320045166016d,0.0d],HasDart:0b,Health:10.0f,MonkeySitting:0b,KubeJSPersistentData:{},LeftHanded:0b,Air:300s,OnGround:1b,CitadelData:{},Rotation:[0.0f,0.0f],HandItems:[{},{}],ArmorDropChances:[0.085f,0.085f,0.085f,0.085f],Pos:[0.5d,0.0626d,0.5d],fireType:"fire",Command:0,Fire:0s,ArmorItems:[{},{},{},{}],CanPickUpLoot:0b,HurtTime:0s},Scale:0.9615385f,UUID:[I;752439093,-924955118,-1956870487,1647143017],Name:"Capuchin Monkey"}}}'),
      weight: 1
    }]
  }
}); // Trade handling


var ensureArray = i => Array.isArray(i) ? i : [i];

{
  var allTrades = {},
      currTrades;

  var convertTrades = (trades, content) => {
    if (trades) {
      var newTrades = ensureArray(trades);
      currTrades = currTrades ? currTrades.concat(newTrades) : newTrades;

      var _out = newTrades.map(_ref => {
        var sell = _ref.sell;
        return typeof sell === 'object' ? sell.getId() : sell;
      });

      return content ? _out.concat(ensureArray(content)) : _out;
    } else return content;
  };

  for (var name in gamestages) {
    var stage = gamestages[name];
    currTrades = stage.trades;
    stage.reveal = convertTrades(stage.revealTrades, stage.reveal);
    stage.of = convertTrades(stage.ofTrades, stage.of);
    console.log('THE:' + name);
    console.log(stage.revealTrades);
    if (currTrades) allTrades[name] = currTrades;
    gamestages[name] = stage;
  }

  if (isKube) this.global.gamestageTrades = allTrades;
} // Gamestage handling

{
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
      var _name = 'gamestages:' + stageName;

      tags[_name] = ensureArray(content);
      return '#' + _name;
    } else {
      return content;
    }
  };

  for (var _name2 in gamestages) {
    var _stage = gamestages[_name2];
    out = _stage;
    out.name = _name2;
    out.reveal = filterToTag(out.name, out.reveal);
    if (!_stage.on) _stage.on = constants.events.pickup; // if(stage.notify == undefined)
    //   stage.notify = true

    if (!_stage.of) {
      if (_stage.on == constants.events.pickup) {
        out.of = out.reveal;
      } else {
        throw new Error("Stage missing 'of' descriptor");
      }
    } else {
      out.of = filterToTag(out.name, out.of);
    }

    if (isKube) {
      switch (_stage.on) {
        case constants.events.advancement:
          data.advancement.push(out);
          break;

        case constants.events.pickup:
          data.pickup.push(out);
          if (out.or) data.advancement.push({
            of: out.or,
            hidden: out.hidden,
            name: _name2
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
      var _loop = function _loop(_name3) {
        tags[_name3].forEach(i => event.add(_name3, i));
      };

      for (var _name3 in tags) {
        _loop(_name3);
      }
    });
  }
}