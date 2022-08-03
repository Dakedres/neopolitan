// priority: 0

/*
  The following script has been compiled with Babel, if you wish to make any edits, clone https://github.com/dakedres/neopolitan-mc and
    follow the instructions provided in the "Script compilation" section of the readme.
*/

var isKube = this.global;
var Item = isKube ? Item : {
  of: id => id.split(' ').pop()
}; // Util functions

var genericStage = function (mod) {
  var _len = Array.from(arguments).length,
      patterns = new Array(_len > 1 ? _len - 1 : 0);

  for (var _key = 1; _key < _len; _key++) {
    patterns[_key - 1] = arguments[_key];
  }

  return patterns.reduce((out, pattern) => {
    // Regex to grab the item wrapped in paranthenses
    out[/.*\((\w*?)\).*/.exec(pattern)[1]] = {
      reveal: [new RegExp(`${mod}:${pattern}$`)]
    };
    return out;
  }, {});
};

var dynArray = items => typeof items[0] == 'object' ? items[0] : items;

var materialFrom = function (mod) {
  var _len2 = Array.from(arguments).length,
      names = new Array(_len2 > 1 ? _len2 - 1 : 0);

  for (var _key2 = 1; _key2 < _len2; _key2++) {
    names[_key2 - 1] = arguments[_key2];
  }

  return dynArray(names).map(name => new RegExp(`${mod}:(.*[\/_]|)${name}.*?$`));
};

var materialStage = function (mod) {
  var _len3 = Array.from(arguments).length,
      names = new Array(_len3 > 1 ? _len3 - 1 : 0);

  for (var _key3 = 1; _key3 < _len3; _key3++) {
    names[_key3 - 1] = arguments[_key3];
  }

  return dynArray(names).reduce((out, name) => {
    out[name] = {
      reveal: new RegExp(`${mod}:(.*[\/_]|)${name}.*?$`)
    };
    return out;
  }, {});
};

var singleStage = function () {
  var _len4 = Array.from(arguments).length,
      items = new Array(_len4);

  for (var _key4 = 0; _key4 < _len4; _key4++) {
    items[_key4] = arguments[_key4];
  }

  return dynArray(items).reduce((out, reveal) => {
    out[reveal.split(':')[1]] = {
      reveal: reveal
    };
    return out;
  }, {});
};

var singleFrom = function (mod) {
  var _len5 = Array.from(arguments).length,
      items = new Array(_len5 > 1 ? _len5 - 1 : 0);

  for (var _key5 = 1; _key5 < _len5; _key5++) {
    items[_key5 - 1] = arguments[_key5];
  }

  return singleStage(dynArray(items).map(i => mod + ':' + i));
};

var modStages = function () {
  var _len6 = Array.from(arguments).length,
      mods = new Array(_len6);

  for (var _key6 = 0; _key6 < _len6; _key6++) {
    mods[_key6] = arguments[_key6];
  }

  return dynArray(mods).reduce((out, mod) => {
    out[mod] = {
      reveal: ['@' + mod]
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

var singleTrade = function () {
  var weight = Array.from(arguments).length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
  var cost = Array.from(arguments).length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  var uses = Array.from(arguments).length > 2 ? arguments[2] : undefined;
  return item => ({
    weight: weight,
    cost: cost,
    uses: uses,
    sell: Item.of(item)
  });
};

var extraUnhidden = (reveal, extra) => ({
  reveal: reveal,
  of: reveal.concat(extra)
});

var forMods = function (mods, func) {
  var out = [];
  var _len7 = Array.from(arguments).length,
      args = new Array(_len7 > 2 ? _len7 - 2 : 0);

  for (var _key7 = 2; _key7 < _len7; _key7++) {
    args[_key7 - 2] = arguments[_key7];
  }

  for (var mod of mods) {
    out = out.concat(func.apply(void 0, [mod].concat(args)));
  }

  return out;
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


var woodTypeHolders = ['quark', 'everycomp', 'immersive_weathering', 'supplementaries'];
var gamestages = babelHelpers.objectSpread(babelHelpers.objectSpread(babelHelpers.objectSpread(babelHelpers.objectSpread(babelHelpers.objectSpread(babelHelpers.objectSpread(babelHelpers.objectSpread(babelHelpers.objectSpread(babelHelpers.objectSpread(babelHelpers.objectSpread(babelHelpers.objectSpread({}, modStages('create', 'pitchperfect')), materialStage('alexsmobs', ['crocodile', 'moose', 'kangaroo', 'dropbear', 'rocky', 'catfish', 'bison', 'strad', 'cosmic_cod', 'flying_fish', 'platypus', 'mimic_octopus'])), singleFrom('alexsmobs', ['sombrero', 'mimicream', 'mysterious_worm', 'devils_hole_pupfish_bucket', 'fedora', 'maraca'])), {}, {
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
  comb_jelly: {
    reveal: ['alexsmobs:comb_jelly_bucket', 'alexsmobs:rainbow_jelly', 'quark:rainbow_rune', 'alexsmobs:rainbow_glass']
  },
  lost_tentacle: {
    reveal: ['alexsmobs:lost_tentacle', 'alexsmobs:squid_grapple']
  },
  // flying_fish: {
  //   reveal: [
  //     'alexsmobs:flying_fish'
  //   ]
  // },
  skelewag: {
    reveal: ['alexsmobs:pupfish_locator', 'alexsmobs:fish_bones', 'alexsmobs:skelewag_sword', 'alexsmobs:shield_of_the_deep']
  },
  rattlesnake: {
    reveal: ['alexsmobs:rattlesnake_rattle', 'alexsmobs:poison_bottle']
  },
  shark: {
    reveal: [].concat(babelHelpers.toConsumableArray(materialFrom('alexsmobs', 'shark')), ['alexsmobs:shield_of_the_deep'])
  },
  capsid: {
    reveal: ['alexsmobs:enderiophage_rocket', 'alexsmobs:capsid']
  },
  glowstone_canyon: {
    reveal: ['#infernalexp:glowstone_canyon_blocks']
  },
  snake_skin: {
    reveal: ['alexsmobs:shed_snake_skin', 'alexsmobs:vine_lasso']
  },
  // // Endergetic
  // ...materialStage('endergetic', 'boof', 'corrock'),
  // ...singleStage('endergetic:acidian_lantern'),
  // puffbug: {
  //   reveal: [
  //     'endergetic:puffbug_hive',
  //     'endergetic:puffbug_bottle'
  //   ]
  // },
  // eumus: {
  //   reveal: [
  //     ...materialFrom('endergetic', 'eumus'),
  //     'endergetic:poismoss'
  //   ]
  // },
  // bollom: {
  //   reveal: [
  //     'endergetic:bolloom_fruit',
  //     ...materialFrom('endergetic', 'bolloom_balloon')
  //   ]
  // },
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
    // revealTrades: singleTrade(2, 24)('supplementaries:slingshot')
    revealTrades: [{
      weight: 2,
      cost: 24,
      extra: 'quark:ravager_hide',
      sell: 'supplementaries:slingshot'
    }]
  }
}, mapStages(singleStage("alexsmobs:music_disc_daze", "alexsmobs:music_disc_thime", "infernalexp:music_disc_flush", "infernalexp:music_disc_soul_spunk", "quark:music_disc_chatter", "quark:music_disc_clock", "quark:music_disc_crickets", "quark:music_disc_drips", "quark:music_disc_endermosh", "quark:music_disc_fire", "quark:music_disc_ocean", "quark:music_disc_rain", "quark:music_disc_wind", "endergetic:music_disc_kilobyte"), stage => {
  stage.hidden = true;
  return stage;
})), materialStage('supplementaries', 'flag')), {}, {
  sign_post: {
    reveal: ['#supplementaries:sign_post']
  },
  vertical_planks: {
    reveal: [/quark:vertical_.*?_planks/],
    trades: ['oak', 'spruce', 'acacia', 'azalea'].map(type => singleTrade(3)(`32x quark:vertical_${type}_planks`))
  },
  azalea: {
    reveal: forMods(woodTypeHolders, materialFrom, 'azalea')
  },
  blossom: {
    reveal: forMods(woodTypeHolders, materialFrom, 'blossom')
  },
  copper: babelHelpers.objectSpread({}, extraUnhidden(['#forge:ores/copper', '#forge:ingots/copper', '#forge:nuggets/copper', '#forge:plates/copper', '#forge:dusts/copper', 'create:crushed_copper_ore'].concat(babelHelpers.toConsumableArray(materialFrom('create', 'copper')), ['chimes:copper_chimes', 'supplementaries:copper_lantern']), babelHelpers.toConsumableArray(materialFrom('minecraft', 'copper_ore')))),
  brass: {
    reveal: ['#forge:ores/brass', '#forge:ingots/brass', '#forge:nuggets/brass', '#forge:plates/brass', '#forge:dusts/brass'].concat(babelHelpers.toConsumableArray(materialFrom('create', 'brass'))),
    trades: [singleTrade(3, 2, 2)('3x create:brass_ingot')]
  },
  corundum: {
    reveal: ['#quark:corundum', 'quark:rainbow_rune']
  }
}, materialStage('decorative_blocks', ['stone_pillar', 'brazier'])), ['supports', 'palisades', 'seats', 'beams'].reduce((obj, query, i) => {
  var tag = '#decorative_blocks:' + query;
  var counts = [12, 20, 8, 18];
  obj[query] = {
    reveal: [tag],
    trades: ['oak', 'dark_oak', 'jungle', 'birch'].map(type => `decorative_blocks:${type}_${query.slice(0, -1)}`).concat(['everycomp:db/quark/blossom_support']).map(id => singleTrade()(`${counts[i]}x ${id}`))
  };
  return obj;
}, {})), materialStage('create', 'gabbro', 'dolomite')), materialStage('infernalexp', 'soul_stone')), materialStage('enhanced_mushrooms', 'red_mushroom', 'brown_mushroom', 'glowshroom')), {}, {
  // ...materialStage('endergetic', 'poise'),
  // honey_pot: {
  //   of: [
  //     'minecraft:honeycomb',
  //     'minecraft:honey_block'
  //   ],
  //   reveal: [
  //     'buzzier_bees:honey_pot',
  //   ]
  // },
  // candles: {
  //   of: [
  //     'minecraft:honeycomb',
  //     'quark:tallow',
  //     '#buzzier_bees:candles'
  //   ],
  //   reveal: '#buzzier_bees:candles',
  //   trades: [
  //     ...[
  //       'buzzier_bees:lily_of_the_valley_scented_candle',
  //       'buzzier_bees:buttercup_scented_candle',
  //       'buzzier_bees:pink_clover_scented_candle',
  //     ].map(singleTrade() ),
  //     singleTrade(2, 1, 5)('2x buzzier_bees:candle')
  //   ]
  // },
  //   _______          _     
  //  |__   __|        | |    
  //     | | ___   ___ | |___ 
  //     | |/ _ \ / _ \| / __|
  //     | | (_) | (_) | \__ \
  //     |_|\___/ \___/|_|___/                     
  // 
  chocolate: {
    reveal: [// 'buzzier_bees:honey_bread',
    'create:chocolate_bucket'],
    revealTrades: ['create:chocolate_glazed_berries', 'create:bar_of_chocolate'].map(singleTrade(1, 1, 8))
  },
  jar: {
    revealTrades: ['supplementaries:jar', 'supplementaries:jar_tinted'].map(singleTrade(2, 2))
  },
  cage: {
    revealTrades: [// he sell monkey
    {
      cost: 19,
      sell: Item.of('supplementaries:cage', '{BlockEntityTag:{MobHolder:{EntityData:{Brain:{memories:{}},HurtByTimestamp:0,ForgeData:{specialai:{door_breaking:0b,elite_ai:{},depacify:0b,fiddling:0b,griefing:0b,aggressive:0b,dodge_arrows:0.0d,avoid_explosions:1.4d,rider:0b,call_for_help:1b},challenger_mob_checked:1b},Sitting:0b,Attributes:[{Base:0.0d,Name:"minecraft:generic.knockback_resistance"},{Base:1.0d,Name:"forge:swim_speed"},{Base:16.0d,Modifiers:[{Operation:1,UUID:[I;1227436563,-514177694,-1821864105,-708036451],Amount:0.060202893994683176d,Name:"Random spawn bonus"}],Name:"minecraft:generic.follow_range"},{Base:0.4000000059604645d,Name:"minecraft:generic.movement_speed"},{Base:0.08d,Name:"forge:entity_gravity"}],Invulnerable:0b,FallFlying:0b,ForcedAge:0,PortalCooldown:0,AbsorptionAmount:0.0f,FallDistance:0.0f,InLove:0,CanUpdate:1b,DeathTime:0s,ForcedToSit:0b,BoundingBox:[0.17500001192092896d,0.0626d,0.17500001192092896d,0.824999988079071d,0.8126d,0.824999988079071d],ForgeCaps:{"structure_gel:gel_entity":{portal:"structure_gel:empty"},"enchantwithmob:mob_enchant":{FromOwner:0b,StoredMobEnchants:[]},"citadel:extended_entity_data_citadel":{}},HandDropChances:[0.085f,0.085f],PersistenceRequired:1b,id:"alexsmobs:capuchin_monkey",Age:0,Motion:[0.0d,-0.1552320045166016d,0.0d],HasDart:0b,Health:10.0f,MonkeySitting:0b,KubeJSPersistentData:{},LeftHanded:0b,Air:300s,OnGround:1b,CitadelData:{},Rotation:[0.0f,0.0f],HandItems:[{},{}],ArmorDropChances:[0.085f,0.085f,0.085f,0.085f],Pos:[0.5d,0.0626d,0.5d],fireType:"fire",Command:0,Fire:0s,ArmorItems:[{},{},{},{}],CanPickUpLoot:0b,HurtTime:0s},Scale:0.9615385f,UUID:[I;752439093,-924955118,-1956870487,1647143017],Name:"Capuchin Monkey"}}}'),
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
        return (typeof sell === 'object' ? sell : Item.of(sell)).getId();
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

  if (isKube) global.gamestageTrades = allTrades;
} // Gamestage handling

{
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
  }

  global.stageData = data;
  console.log('TAG DATA');
  console.log(tags); // console.log(Item.of(tags['gamestages:supports']) )
  // console.log(Item.of('#decorative_blocks:supports') )
  // tags['gamestages:supports'] = ['#decorative_blocks:supports']

  onEvent('item.tags', event => {
    var _loop = function (_name3) {
      tags[_name3].forEach(i => event.add(_name3, i));
    };

    for (var _name3 in tags) {
      _loop(_name3);
    }
  });
}