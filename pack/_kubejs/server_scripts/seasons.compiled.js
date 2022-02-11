function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

// let distribute = (base, dist) => {
//   let range = [ base - dist, base + dist ]
//   return num =>
//     num <= range[0] ? 0 : (num <= range[1] ? 1 : 2) 
// }
// let withinRange = distribute(.5, .15)
// let getSeason = (...date) => {
//   let now = new Date(),
//       biWeek = Math.floor(
//         //     Day in ms                 I have no idea
//         (now / (24 * 60 * 60 * 1000) )
//         // - 2
//         + 6
//       ) / 14,
//       currentWeek =
//         Math.ceil(
//           biWeek
//         ) % 4, // % 4
//       season = [ 'SPRING', 'SUMMER', 'AUTUMN', 'WINTER' ][currentWeek],
//       // subseason = Math.round( ( (now.getDay() * 24 + now.getHours()) / 144 ) * 2 )
//       biWeekDec = biWeek % 1
//       subseason = biWeekDec == 0 ? 2 : withinRange(biWeekDec)
//   return { season, subseason }
// }
var hoursMs = 60 * 60 * 1000;
var constants = {
  seasons: ['AUTUMN', 'WINTER', 'SPRING', 'SUMMER'],
  // hoursMs: 60 * 60 * 1000,
  hoursMs: hoursMs,
  dayMs: 24 * hoursMs,
  formatSerene: (season, subseason) => ['EARLY', 'MID', 'LATE'][subseason] + '_' + season,
  formatBW: (season, subseason) => season + ' ' + ['START', 'MID', 'LATE'][subseason]
}; // One week seasons

var getSeason = function getSeason() {
  for (var _len = arguments.length, date = new Array(_len), _key = 0; _key < _len; _key++) {
    date[_key] = arguments[_key];
  }

  var now = _construct(Date, date),
      currentWeek = Math.ceil(Math.floor( //     Day in ms                 I have no idea
  now / constants.dayMs - 2) / 7) % 4,
      season = constants.seasons[currentWeek],
      subseason = Math.round((now.getDay() * 24 + now.getHours()) / 144 * 2);

  return [season, subseason];
}; // const onDay = (...date) => {
//   // for(let i = 0; i < 24; i++) {
//   //   console.log(`${i}hr `, getSeason(...date, i) )
//   // }
//   for(let i = 0; i < 240; i++) {
//     console.log(`${i}min `, getSeason(...date, 9, i) )
//   }
// }
// onDay(2021, 11, 21)
// setInterval(() => {
//   console.log(
//     getSeason(Date.now() )
//   )
// }, 10 * 1000)
// const aroundDate = (span, ...inp) => {
//   for(let i = 0; i < span; i++) {
//     let date = inp[2] - (span / 2) + i
//     console.log('date:', date, getSeason(...inp.slice(0, 2), date) )
//   }
// }
// aroundDate(10, 2021, 11, 7)
// aroundDate(10, 2021, 11, 17)
// aroundDate(10, 2021, 11, 27)
// aroundDate(10, 2022, 0, 6)
//### SCHEDULE BASED SEASON TIMING
// const scheduleNext = (event, callback) => {
//   let now = Date.now(),
//       nextHour = (parseInt(now / hoursMs) + 1) * hoursMs
//   nextHour -= now
//   event.getServer().schedule( (nextHour / SECOND) * SECOND, event, callback)
//   console.log('scheduled event')
//   console.log(nextHour - now)
// }
// console.log('SEASON LOAD')
// function setSeason(event) {
//   console.log('aaaaa')
//   console.log(getSeason())
//   scheduleNext(event, this)
// }
// onEvent('server.load', event => {
//   setSeason(event)
// })
// ### TICK BASED SEASON TIMING 


var now = Date.now(),
    nextHour = Infinity,
    awaitingJoin = false;

var setNext = () => nextHour = (parseInt(now / hoursMs) + 1) * hoursMs;

onEvent('world.load', event => {
  // We need to wait for a player to join or else we get a
  //  server-client desync if they join immediately
  awaitingJoin = true;
});
onEvent('player.logged_in', event => {
  if (awaitingJoin) nextHour = Date.now() + 2000;
}); // onEvent('player.chat', function (event) {
//   if (event.message.startsWith('$reload')) {
//     event.player.tell(nextHour)
//     nextHour = 0
//     event.cancel()
//   }
// })

onEvent('server.tick', event => {
  if (Date.now() > nextHour) {
    now = Date.now();
    setNext();
    var data = getSeason(now); // console.log(data)

    event.server.runCommandSilent("season set ".concat(constants.formatSerene.apply(constants, _toConsumableArray(data)))); // event.server.runCommand(`betterweather setseason ${constants.formatBW(...data)}`)
  }
});