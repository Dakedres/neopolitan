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

const hoursMs = 60 * 60 * 1000

const constants = {
  seasons: ['AUTUMN', 'WINTER', 'SPRING', 'SUMMER'],
  // hoursMs: 60 * 60 * 1000,
  hoursMs: hoursMs,
  dayMs: 24 * hoursMs,
  formatSerene: (season, subseason) =>
    ['EARLY', 'MID', 'LATE'][subseason] + '_' + season,
  formatBW: (season, subseason) =>
    season + ' ' + ['START', 'MID', 'LATE'][subseason]
}

// One week seasons
const getSeason = (...date) => {
  var now = new Date(...date),
      currentWeek = Math.ceil(
        Math.floor(
          //     Day in ms                 I have no idea
          now / constants.dayMs - 2
        ) / 7
      ) % 4,
      season = constants.seasons[currentWeek],
      subseason = Math.round( (now.getDay() * 24 + now.getHours()) / 144 * 2 )
  
  return [ season, subseason ]
}

// const onDay = (...date) => {
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

let now = Date.now(),
    nextHour = Infinity,
    awaitingJoin = false

const setNext = () =>
  nextHour = (parseInt(now / hoursMs) + 1) * hoursMs

onEvent('world.load', event => {
  // We need to wait for a player to join or else we get a
  //  server-client desync if they join immediately
  awaitingJoin = true
})

onEvent('player.logged_in', event => {
  if(awaitingJoin) nextHour = Date.now() + 2000
})

// onEvent('player.chat', function (event) {
//   if (event.message.startsWith('$reload')) {
//     event.player.tell(nextHour)
//     nextHour = 0
//     event.cancel()
//   }
// })

onEvent('server.tick', event => {
  if(Date.now() > nextHour) {
    now = Date.now()
    setNext()

    let data = getSeason(now)

    // console.log(data)
    event.server.runCommandSilent(`execute in minecraft:overworld season set ${constants.formatSerene(...data)}`)
    // event.server.runCommand(`betterweather setseason ${constants.formatBW(...data)}`)
  }
})