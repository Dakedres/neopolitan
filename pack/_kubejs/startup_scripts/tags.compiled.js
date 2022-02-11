function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var materialFrom = function materialFrom(mod) {
  for (var _len = arguments.length, names = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    names[_key - 1] = arguments[_key];
  }

  return (typeof names[0] == 'object' ? names[0] : names).map(name => new RegExp("".concat(mod, ":(.*_|)").concat(name, ".*?$")));
};

var hemp = 'immersiveengineering:seed';
var blossomSaplings = ['quark:blue_blossom_sapling', 'quark:pink_blossom_sapling', 'quark:orange_blossom_sapling', 'quark:red_blossom_sapling'];
var seasons = {
  spring: 'sereneseasons:summer_crops',
  summer: 'sereneseasons:spring_crops',
  autumn: 'sereneseasons:autumn_crops'
};
var instruments = ["pitchperfect:banjo", "pitchperfect:bass", "pitchperfect:bass_drum", "pitchperfect:bit", // "pitchperfect:chimes",
"pitchperfect:cow_bell", "pitchperfect:didgeridoo", "pitchperfect:electric_piano", "pitchperfect:flute", "pitchperfect:glockenspiel", "pitchperfect:guitar", "pitchperfect:harp", "pitchperfect:snare_drum", "pitchperfect:sticks", "pitchperfect:vibraphone", "pitchperfect:xylophone"];
onEvent('item.tags', event => {
  var equalMetal = (left, right) => [["forge:nuggets/".concat(left), "#forge:nuggets/".concat(right)], ["forge:ingots/".concat(left), "#forge:ingots/".concat(right)], ["forge:plates/".concat(left), "#forge:plates/".concat(right)]].map(a => event.add.apply(event, _toConsumableArray(a)));

  var addFrom = function addFrom(mod) {
    for (var _len2 = arguments.length, names = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      names[_key2 - 1] = arguments[_key2];
    }

    return names.forEach(name => {
      console.log('TAG ' + name);
      event.add([mod, name].join(':'), materialFrom(mod, name));
    });
  };

  event.add(seasons.autumn, hemp);
  blossomSaplings.forEach(item => {
    event.add(seasons.spring, item);
    event.add(seasons.summer, item);
  });
  event.add('instruments', instruments);
  event.add('quark:vertical_slab', /^.*?:.*?_vertical_slab$/); // event.add('alexsmobs:grizzly_foodstuffs', [
  //   'buzzier_bees:honey_apple',
  //   'buzzier_bees:glazed_porkchop',
  //   'create:honeyed_apple',
  //   'buzzier_bees:sticky_honey_wand',
  // ])

  equalMetal('constantan', 'brass');
  equalMetal('nickel', 'zinc');
  event.add('forge:plates/nickel', '#forge:ingots/zinc'); // event.add('supplementaries:sign_post', materialFrom('supplementaries', 'sign_post') )

  addFrom('supplementaries', 'sign_post', 'flag');
});