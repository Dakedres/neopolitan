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

var materialStage = function materialStage(mod) {
  for (var _len2 = arguments.length, names = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    names[_key2 - 1] = arguments[_key2];
  }

  return names.reduce((out, name) => {
    out[name] = {
      reveal: new RegExp("".concat(mod, ":(.*_|)").concat(name, ".*?$"))
    };
    return out;
  }, {});
};

var single = function single() {
  for (var _len3 = arguments.length, items = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    items[_key3] = arguments[_key3];
  }

  return items.reduce((out, reveal) => {
    out[reveal.split(':')[1]] = {
      reveal: reveal
    };
    return out;
  }, {});
};

var modStages = function modStages() {
  for (var _len4 = arguments.length, mods = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
    mods[_key4] = arguments[_key4];
  }

  return mods.reduce((out, mod) => {
    out[mod] = {
      reveal: '@' + mod
    };
    return out;
  }, {});
};

var gamestages = _objectSpread(_objectSpread(_objectSpread(_objectSpread({}, modStages('create', 'pitchperfect')), materialStage('darkerdepths', 'limestone', 'grimstone', 'shale', 'petrified')), {}, {
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
  void_worm: {
    //   'on' isn't even needed if it's discover
    // on: "discover",
    or: "alexsmobs:alexsmobs/void_worm_kill",
    reveal: ['#alexsmobs:void_worm_drops', 'alexsmobs:void_worm_beak', 'alexsmobs:dimensional_carver']
  }
}, single('#buzzier_bees:candles')), {}, {
  // This doesn't work I have no idea
  insect_bottle: {
    reveal: /buzzier_bees:.*?_bottle$/
  }
});

console.log(gamestages);
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
      var name = 'gamestage_' + stageName;
      tags[name] = content;
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
    if (!stage.on) stage.on = constants.events.pickup;

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