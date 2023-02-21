const fs = require('fs/promises')
const path = require('path')
const child = require('child_process')

const runCommand = (...args) =>
  new Promise((resolve, reject) => {
    const process = child.spawn(...args)

    process.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });

    process.on('close', (code) => {
      console.log(`child process close all stdio with code ${code}`);
    });

    process.on('exit', (code) => {
      console.log(`child process exited with code ${code}`);
    });

    process.on('error', console.error)

    process.stderr.on('data', (data) => {
      console.error(`grep stderr: ${data}`);
    });
  })

fs.readFile(path.join(__dirname, './wishlist.txt'), { encoding: 'utf-8' }).then(async str => {
  let lines = str
    .split('\n')
    .map(l => l.split(' ') )

  process.chdir(path.join(__dirname, 'pack'))

  process.env.PATH += ':~/.gvm/scripts/gvm'

  // process.env.GVM_ROOT = '/home/dakedres/.gvm'
  // await runCommand('ls', [ '$GVM_ROOT' ], {
  //   env: {
  //     GVM_ROOT: '/home/dakedres/.gvm'
  //   }
  // })
  await runCommand('gvm', [ 'use', '18' ])

  console.log('done')

  for(let entry of lines) {
    entry.splice(1, 0, 'install')
    let process = child.spawn('packwiz', entry )

    await new Promise((resolve, reject) => {
      
      
    })
  }
})