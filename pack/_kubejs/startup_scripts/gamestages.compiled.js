function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var materialStage = function materialStage(mod) {
  for (var _len = arguments.length, patterns = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    patterns[_key - 1] = arguments[_key];
  }

  return patterns.reduce((out, pattern) => {
    // Regex to grab the item wrapped in paranthenses
    out[/.*\((\w*?)\).*/.exec(pattern)[1]] = {
      on: 'discover',
      reveal: [new RegExp("".concat(mod, ":").concat(pattern, "$"))]
    };
    return out;
  }, {});
};

var modStages = function modStages() {
  for (var _len2 = arguments.length, mods = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    mods[_key2] = arguments[_key2];
  }

  return mods.reduce((out, mod) => {
    out[mod] = {
      on: 'discover',
      reveal: '@' + mod
    };
    return out;
  }, {});
};

var gamestages = _objectSpread(_objectSpread({}, modStages('create', 'pitchperfect')), materialStage('darkerdepths', '(grimestone).*?', '(.*_|)(shale).*?', '(.*_|)(petrified).*?'));

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

    if (!stage.of) {
      if (stage.on == constants.events.pickup) {
        out.of = out.reveal = filterToTag(out.name, out.reveal);
      } else {
        throw new Error("Stage missing 'of' descriptor");
      }
    } else {
      out.of = filterToTag(out.name, out.of);
    }

    if (isKube) {
      switch (stage.on) {
        case constants.events.pickup:
          data.pickup.push(out);
          break;

        case constants.events.advancement:
          data.advancement.push(out);
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