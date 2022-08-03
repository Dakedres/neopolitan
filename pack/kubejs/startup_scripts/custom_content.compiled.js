// priority: 0

/*
  The following script has been compiled with Babel, if you wish to make any edits, clone https://github.com/dakedres/neopolitan-mc and
    follow the instructions provided in the "Script compilation" section of the readme.
*/

var ores = [];

var addOre = (idName, displayName, tag) => {
  ores.push({
    id: `kubejs:raw_${displayName.toLowerCase()}_ore`,
    idName: idName,
    displayName: displayName,
    tag: tag
  });
};

addOre('aluminum', 'bauxite', 'forge:ores/aluminum');
addOre('lead', 'Lead', 'forge:ores/lead'); // addOre('nickel', 'Nickel', 'forge:ores/nickel')
// addOre('silver', 'Silver', 'forge:ores/silver')

onEvent('item.registry', event => {
  for (var _ref2 of ores) {
    var id = _ref2.id;
    var idName = _ref2.idName;
    var displayName = _ref2.displayName;
    event.create(id).displayName(`Raw ${displayName} Ore`).texture(`neo:item/metal_raw_${idName}`);
  }

  var createCrushed = (idName, displayName) => {
    var id = 'crushed_' + idName;
    event.create(id).displayName(`Crushed ${displayName}`).texture(`neo:item/${id}`);
  };

  createCrushed('sunmetal', 'Sunmetal');
  createCrushed('steel', 'Steel');
});
onEvent('item.tags', event => {
  for (var _ref4 of ores) {
    var id = _ref4.id;
    var tag = _ref4.tag;
    event.add(tag, id);
  }
});