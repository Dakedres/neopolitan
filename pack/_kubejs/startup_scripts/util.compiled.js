var createTable = inp => {
  var table = [];

  for (var i in inp) {
    table = table.concat(new Array(inp[i].weight).fill(i));
  }

  return () => inp[table[Math.floor(Math.random() * table.length)]];
};

var makeCage = inp => "{BlockEntityTag:{MobHolder:".concat(inp, "}");

var mobs = [{
  id: "minecraft:cat",
  createNBT: () => {
    '{EntityData:{Brain:{memories:{}},HurtByTimestamp:0,ForgeData:{specialai:{door_breaking:0b,elite_ai:{},depacify:0b,fiddling:0b,griefing:0b,aggressive:0b,dodge_arrows:0.0d,avoid_explosions:1.4d,rider:0b,call_for_help:1b},challenger_mob_checked:1b},Sitting:0b,Attributes:[{Base:0.0d,Name:"minecraft:generic.knockback_resistance"},{Base:1.0d,Name:"forge:swim_speed"},{Base:16.0d,Modifiers:[{Operation:1,UUID:[I;1227436563,-514177694,-1821864105,-708036451],Amount:0.060202893994683176d,Name:"Random spawn bonus"}],Name:"minecraft:generic.follow_range"},{Base:0.4000000059604645d,Name:"minecraft:generic.movement_speed"},{Base:0.08d,Name:"forge:entity_gravity"}],Invulnerable:0b,FallFlying:0b,ForcedAge:0,PortalCooldown:0,AbsorptionAmount:0.0f,FallDistance:0.0f,InLove:0,CanUpdate:1b,DeathTime:0s,ForcedToSit:0b,BoundingBox:[0.17500001192092896d,0.0626d,0.17500001192092896d,0.824999988079071d,0.8126d,0.824999988079071d],ForgeCaps:{"structure_gel:gel_entity":{portal:"structure_gel:empty"},"enchantwithmob:mob_enchant":{FromOwner:0b,StoredMobEnchants:[]},"citadel:extended_entity_data_citadel":{}},HandDropChances:[0.085f,0.085f],PersistenceRequired:1b,id:"alexsmobs:capuchin_monkey",Age:0,Motion:[0.0d,-0.1552320045166016d,0.0d],HasDart:0b,Health:10.0f,MonkeySitting:0b,KubeJSPersistentData:{},LeftHanded:0b,Air:300s,OnGround:1b,CitadelData:{},Rotation:[0.0f,0.0f],HandItems:[{},{}],ArmorDropChances:[0.085f,0.085f,0.085f,0.085f],Pos:[0.5d,0.0626d,0.5d],fireType:"fire",Command:0,Fire:0s,ArmorItems:[{},{},{},{}],CanPickUpLoot:0b,HurtTime:0s},Scale:0.9615385f,UUID:[I;752439093,-924955118,-1956870487,1647143017],Name:"Capuchin Monkey"}';

    var names = ['Book', 'Mochi', 'June'];
  }
}];