node lib/babel-rhino/build.js babel-plugin-transform-parameters-rhino
node lib/babel-rhino/build.js babel-plugin-proposal-object-rest-spread-rhino

if [ ! -f ".env" ]; then
  cp template.env .env
  echo "Created empty .env"
fi