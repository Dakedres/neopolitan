onEvent('player.inventory.changed', event => {
  event.player.sendData('gamestage_pickup', { item: event.item })
})

onEvent('player.chat', (event) => {
  let command = '!gs '

  // Check if message equals creeper, ignoring case
  if(event.message.startsWith(command) ) {
    event.player.sendData('gamestage_command', {
      args: event.message.slice(command.length).trim()
    })

    event.cancel()
  }
})