
const createCommand = (...args) => {
  let command

  for(arg of args.reverse() ) {
    command = command ? arg.then(command) : arg
  }

  return command
}

const sendError = (source, message) => {
  source.sendFailure(Text.of([ message ]) )

  return 0
}

onEvent('command.registry', event => {
  const { commands: Commands, arguments: Arguments, builtinSuggestions: Suggestions } = event

  let powerGroupCommand = createCommand(
    Commands
      .literal('powergroup'),
      // .requires(source => {source.getServer().isSingleplayer() })
    Commands
      .argument('entity', Arguments.ENTITY.create(event) ),
    Commands
      .argument('name', Arguments.WORD.create(event) )
      .suggests((ctx, builder) => Suggestions.suggest(Object.keys(powerGroups), builder) )
      .executes(ctx => {
        let target = Arguments.ENTITY.getResult(ctx, 'entity'),
            groupName = Arguments.WORD.getResult(ctx, 'name'),
            powerGroup = powerGroups[groupName]

        if(!powerGroup)
          return sendError(ctx.source, `No such power group "${groupName}"`)

        // console.log(target)
        // console.log(groupName)
        // ctx.source.sendSuccess(Text.of([groupName]), true)

        return 1
      }),
  )

  let sketchyEvalCommand = createCommand(
    Commands
      .literal('kubeval'),
    Commands
      .argument('code', Arguments.GREEDY_STRING.create(event) )
      .executes(ctx => {
        let err,
            out = eval(Arguments.GREEDY_STRING.getResult(ctx, 'code') + '')
            
        console.log(out)

        if(err) {
          return sendError(ctx.source, 'Could not evaluate: ' + err)
        } else {
          ctx.source.sendSuccess(Text.of([ JSON.stringify(out) ]), true)

          return 1
        }
      })
  )

  // let command = Commands
  //   .literal('powergroup')
  //   .then(
  //     Commands
  //       .argument('entity', Arguments.ENTITY.create(event) )
  //       .then(
  //         Commands
  //           .argument('name', Arguments.WORD.create(event) )
  //           .suggests((ctx, builder) => Suggestions.suggest(['test','test2'], builder) )
  //           .executes(ctx => {
  //             let target = Arguments.STRING.getResult(ctx, 'entity'),
  //                 groupName = Arguments.STRING.getResult(ctx, 'name')
      
  //             console.log(ctx)
  //             ctx.source.sendSuccess(Text.of(['groupName']), true)
      
  //             return 1
  //           })
  //       )
  //   )

  event.register(powerGroupCommand)
  event.register(sketchyEvalCommand)
})