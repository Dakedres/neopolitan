function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var singleTrade = function singleTrade() {
  var weight = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
  var cost = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  var uses = arguments.length > 2 ? arguments[2] : undefined;
  return item => ({
    cost: cost,
    sell: item,
    weight: weight,
    uses: uses
  });
};

var gamestageTrades = _objectSpread({
  tetra: [singleTrade()('tetra:basic_workbench')],
  red_mushroom: singleTrade(4)('quark:mushroom_chest'),
  brown_mushroom: singleTrade(4)('enhanced_mushrooms:brown_mushroom_chest')
}, this.global.gamestageTrades);

var genericTrades = [singleTrade()('buzzier_bees:insect_bottle')];

var _loop = function _loop(stage) {
  var table = [];
  gamestageTrades[stage].forEach(raw => {
    var sell = raw.sell,
        trade = Object.assign({}, raw);
    if (typeof sell == 'string') sell = Item.of(sell);
    trade.sell = sell.toNBT();
    trade.stage = stage;
    table = table.concat(new Array(trade.weight).fill(trade));
  });
  gamestageTrades[stage] = table;
};

for (var stage in gamestageTrades) {
  _loop(stage);
}

console.log(gamestageTrades['hemp'][0]);
var blacklist = Ingredient.of('#kubejs:disabled');

var getRarity = id => Item.of(id).getItemStack()[getRarityKey](); // Can be replaced with NBT.compoundTag({}) in 1.18


var constructCompound = obj => Item.of('minecraft:stone', obj).getNbt();

var distanceBetween = (v1, v2) => {
  var dx = v1[0] - v2[0],
      dy = v1[1] - v2[1],
      dz = v1[2] - v2[2];
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
};

var getPos = entity => [entity.getX(), entity.getY(), entity.getZ()];

var handleTrader = (event, wandering) => {
  var _nbt$Offers;

  var entity = event.getEntity(),
      nbt = entity.getFullNBT(),
      recipes = (_nbt$Offers = nbt.Offers) === null || _nbt$Offers === void 0 ? void 0 : _nbt$Offers.Recipes;
  console.log(recipes.class);
  if (!recipes) return;
  recipes.toArray().forEach((v, i) => {
    if (blacklist.test(v.sell.id)) {
      recipes.remove(i); // console.log(i)
    }
  }); // console.log( entity.runCommand('execute as @e[distance=..500,type=minecraft:player] run data get entity @s UUID') )

  if (wandering) {
    var traderPos = getPos(entity);
    var players = event.getWorld().getPlayers().filter(p => distanceBetween(traderPos, getPos(p)) < 64).toArray(); // recipes.add(0, constructCompound({
    //   maxUses: 12,
    //   buyB: {
    //     id: "minecraft:air",
    //     Count: 0
    //   },
    //   buy: {
    //     id: "minecraft:emerald",
    //     Count: 1
    //   },
    //   sell: {
    //     id: "minecraft:vine",
    //     Count: 1
    //   },
    //   xp: 1,
    //   uses: 0,
    //   priceMultiplier: 0.05,
    //   specialPrice: 0,
    //   demand: 0,
    //   rewardExp: 1
    // }) )

    var tradeTable = [];

    var _iterator = _createForOfIteratorHelper(players),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var player = _step.value;
        var stages = player.getStages();

        for (var _stage in gamestageTrades) {
          if (!stages.has(_stage)) tradeTable = tradeTable.concat(gamestageTrades[_stage]);
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    var tradeCount = Math.floor(Math.random() * 2),
        diff = recipes.size(),
        attempts = 0,
        presentedStages = []; // tradeCount = (diff + tradeCount) <= 9 ? (9 - diff) : tradeCount

    while (tradeCount > 0 && attempts < 5) {
      var trade = tradeTable[Math.floor(Math.random() * tradeTable.length)];

      if (presentedStages.includes(trade.stage)) {
        attempts++;
        continue;
      }

      attempts = 0;
      presentedStages.push(trade.stage);
      var offer = {
        maxUses: trade.uses || 1,
        buy: {
          id: "minecraft:emerald",
          Count: trade.cost
        },
        buyB: {
          id: "minecraft:air",
          Count: 0
        },
        sell: trade.sell,
        xp: 1,
        uses: 0,
        priceMultiplier: 0.05,
        specialPrice: 0,
        demand: 0,
        rewardExp: 1
      };
      recipes.add(0, constructCompound(offer));
      tradeCount--;
    }
  }

  entity.setFullNBT(nbt); // entity.mergeFullNBT({
  //   Offers: {
  //     Recipes:[
  //       {
  //         maxUses: 12,
  //         buyB: {
  //           id: "minecraft:air",
  //           Count: 0
  //         },
  //         buy: {
  //           id: "minecraft:emerald",
  //           Count: 1
  //         },
  //         sell: {
  //           id: "minecraft:vine",
  //           Count: 1
  //         },
  //         xp: 1,
  //         uses: 0,
  //         priceMultiplier: 0.05,
  //         specialPrice: 0,
  //         demand: 0,
  //         rewardExp: 1
  //       }
  //     ]
  //   }
  // })
};

var mobHandlers = {
  'minecraft:wandering_trader': event => {
    handleTrader(event, true);
  },
  'minecraft:villager': handleTrader
};
onEvent('entity.spawned', event => {
  var handle = mobHandlers[event.getEntity().getType()];
  if (handle) handle(event);
});