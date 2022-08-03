// priority: 0

/*
  The following script has been compiled with Babel, if you wish to make any edits, clone https://github.com/dakedres/neopolitan-mc and
    follow the instructions provided in the "Script compilation" section of the readme.
*/

// priority: 0
console.info('Hello, World! (You will see this line every time client resources reload)');
/*
  - LocalStages is entirely independent from a world
  - One instance exists, whne jei.hide.items is called, it will pull from it
  - When a player joins a world, a LocalStages instance is passed to a StageManager object for that world
	- StageManager manages a one-to-many index which maps item IDs to their stages
	- When an item is picked up, that stage's refrence is set to disabled
	- Disabled stages are ignored
	- This means that StageManager should exclusively be used for adding and removing stages
	  - This is why LocalStages does not have add/remove functions, just set and get
*/

var VanillaTypes = java('mezz.jei.api.constants.VanillaTypes');

var displayMessage = function (strings) {
  var toActionbar = Array.from(arguments).length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var components = Text.join(Text.of(''), strings.map(section => {
    var sectionParts = Array.isArray(section) ? section : [section],
        out = Text.of(sectionParts[0]);
    if (sectionParts[1]) out = out[sectionParts[1]]();
    return out;
  }));
  Client.getLevel().getMinecraftPlayer().displayClientMessage(components, toActionbar);
};

var alternativeIncludes = (array, rightHand) => array.includes ? array.includes(rightHand) : array.toArray().includes();

var getItemStacks = stage => {
  var _Ingredient$of = Ingredient.of(stage.reveal),
      stacks = _Ingredient$of.stacks;

  console.log(stacks);
  return stacks.length > 0 ? stacks.map(stack => stack.getItemStack()) : [];
};

var localStagesArray, localData;

var LocalStages = /*#__PURE__*/function () {
  function LocalStages() {
    var _JsonIO$read;

    babelHelpers.classCallCheck(this, LocalStages);
    this.path = 'kubejs/data/itemstages.json';
    localData = (_JsonIO$read = JsonIO.read(this.path)) !== null && _JsonIO$read !== void 0 ? _JsonIO$read : {
      stages: []
    };
    localStagesArray = localData.stages;
  }

  babelHelpers.createClass(LocalStages, [{
    key: "write",
    value: function write() {
      JsonIO.write(this.path, {
        stages: localStagesArray.filter(stage => stage != null)
      });
    }
  }]);
  return LocalStages;
}(); // class LocalStages {
// 	constructor() {
// 		this.data
// 	}
// 	// open(event) {
// 	// 	this.data = event.world.persistentData
// 	// }
// }


var StageManager = /*#__PURE__*/function () {
  function StageManager(localStages) {
    babelHelpers.classCallCheck(this, StageManager);
    this.localStages = localStages;
    this.item = {};
    this.pickupStages = global.stageData.pickup.reduce((obj, stage, index) => {
      obj[index] = stage;
      stage.managerIndex = index;
      console.log(localStagesArray);
      if (!alternativeIncludes(localStagesArray, stage.name)) this.addItems(stage, index);
      return obj;
    }, {});
  }

  babelHelpers.createClass(StageManager, [{
    key: "addItems",
    value: function addItems(stage, stageIndex) {
      Ingredient.of(stage.of).stacks.forEach(stack => {
        var stages = this.item[stack.id];

        if (Array.isArray(stages) && !stages.includes(stageIndex)) {
          stages.push(stageIndex);
        } else {
          this.item[stack.id] = [stageIndex];
        }
      });
    }
  }, {
    key: "getStages",
    value: function getStages(id) {
      var stages = this.item[id];

      if (!stages) {
        return [];
      } else {
        return stages.map(index => {
          var stage = this.pickupStages[index];
          if (!stage.gained) return {
            stage: stage,
            index: index
          };
        });
      }
    }
  }, {
    key: "addStage",
    value: function addStage(stage, stageIndex) {
      // localStagesArray = localStagesArray.concat([ stage.name ])
      localStagesArray.push(stage.name);
      console.log(localStagesArray); // localStagesArray = [ stage.name ]

      this.localStages.write();
      this.pickupStages[stageIndex].gained = true;
      this.revealStage(stage);
      displayMessage([['Your horizons have expanded! '], ['$' + stage.name, 'gray']]);
    }
  }, {
    key: "removeStage",
    value: function removeStage(stage, stageIndex) {
      this.hideStage(stage); // localStagesArray.splice(
      // 	0,
      // 	1
      // )

      localStagesArray = localStagesArray.filter(name => name != stage.name);
      this.localStages.write();
      this.pickupStages[stageIndex].gained = false;
    }
  }, {
    key: "revealStage",
    value: function revealStage(stage) {
      var stacks = getItemStacks(stage);
      if (stacks.length > 0) global.jeiRuntime.getIngredientManager().addIngredientsAtRuntime(VanillaTypes.ITEM, stacks);
    }
  }, {
    key: "hideStage",
    value: function hideStage(stage) {
      var stacks = getItemStacks(stage);
      if (stacks.length > 0) global.jeiRuntime.getIngredientManager().removeIngredientsAtRuntime(VanillaTypes.ITEM, stacks);
    }
  }]);
  return StageManager;
}();

var allStages = global.stageData.pickup.concat(global.stageData.advancement),
    gainedStages = new LocalStages(),
    stageManager;

var createStageManager = () => stageManager = new StageManager(gainedStages);

onEvent('jei.hide.items', event => {
  // console.log(gainedStages.stages.toArray().includes('bricks') )
  console.log('JEI Hide items received!');
  console.log(localStagesArray);
  global.stageData.pickup.filter(stage => !alternativeIncludes(localStagesArray, stage.name)).forEach(stage => {
    console.log('Hiding!');
    console.log(stage);
    getItemStacks(stage).forEach(item => event.hide(item.id));
  });
  createStageManager();
});
onEvent('player.data_from_server.gamestage_pickup', event => {
  console.log(stageManager);
  stageManager.getStages(event.data.item.id).forEach(stage => {
    if (stage) stageManager.addStage(stage.stage, stage.index);
  });
});
onEvent('player.data_from_server.gamestage_command', event => {
  var args = event.data.args.split(' ');

  var print = s => displayMessage(s, false),
      printError = m => print([[m, 'red']]); // try {


  var getStageByName = name => {
    return allStages.find(stage => stage.name == name);
  };

  var handleStage = callback => {
    var stage = getStageByName(args.shift());

    if (stage) {
      console.log('callbacked');
      callback(stage);
    } else {
      printError('No matching itemstage');
    }
  };

  switch (args.shift()) {
    case 'list':
      {
        var hidden = 0,
            out = [];

        if (localStagesArray.length > 0) {
          var list = localStagesArray // .filter(name => {
          // 	if(name == null) {
          // 		return
          // 	} else if (!getStageByName(name) ) {
          // 		hidden++
          // 		return
          // 	}
          // 	return true
          // })
          .map(s => `"${s}"`);
          if (list.length > 0) out.push(list.join(', '));
        } else {
          out.push('No itemstages found');
        }

        if (hidden) {
          out.push(`${hidden} gained stages are no longer present.`);
        }

        print([out.join(' ')]);
        break;
      }

    case 'add':
      {
        handleStage(stage => {
          stageManager.addStage(stage, stage.managerIndex);
          print([`Itemstage "${stage.name}" added`]);
        });
        break;
      }

    case 'remove':
      {
        handleStage(stage => {
          stageManager.removeStage(stage, stage.managerIndex);
          console.log(localStagesArray);
          print([`Itemstage "${stage.name}" removed`]);
        });
        break;
      }

    case 'reload':
      {
        gainedStages.open();
        print(['Stages reloaded. You may still need to run /reload to force JEI to update hidden items.']);
        break;
      }

    case 'listall':
      {
        print([allStages.map(n => n.name).join(', ')]);
        break;
      }

    default:
      {
        print([['No matching subcommand', 'red']]);
        break;
      }
  } // } catch(err) {
  // 	printError('Error attempting to execute that command: ' + error.toString())
  // 	throw err
  // }

});
createStageManager();
displayMessage(['You will need to run /reload or F3+T immediately for itemstages to operate properly.'], false);