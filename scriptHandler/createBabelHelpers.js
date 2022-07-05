const fs = require('fs/promises'),
      path = require('path');
const createScript = require('./util/createScript');
const constants = require('./util/constants'),
      helperBuilder = require('@babel/core/lib/tools/build-external-helpers').default

const { babelHelpers, kube } = constants

const importSections = [
  babelHelpers.header,
  babelHelpers.import
]

;(async () => {
  let override = await fs.readFile(
    path.join(__dirname, 'helperOverride.js'),
    { encoding: 'utf-8' }
  )

  let targets = [
    [
      kube.startup,
      [
        babelHelpers.header,
        helperBuilder(babelHelpers.allowList),
        override,
        babelHelpers.import
      ]
    ]
  ]

  if(process.argv[3] != 'only-init') {
    targets = targets.concat([
      [ kube.server, importSections ],
      [ kube.client, importSections ]
    ])
  }

  for(let [ dirname, sections ] of targets) {
    await createScript(path.join(kube.path, dirname, babelHelpers.filename), sections)
  }

  console.log('Compiled babel helpers.')

  // console.log(helperBuilder)

})()