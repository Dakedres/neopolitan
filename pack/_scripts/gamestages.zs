import mods.itemstages.ItemStages;
import stdlib.List;
import crafttweaker.api.item.IItemStack;
import crafttweaker.api.BracketHandlers;

function getTag(resourceLocation as string) as List<IItemStack> {
  var out = new List<IItemStack>();

  for definition in <tagmanager:items>.getTag(BracketHandlers.getResourceLocation(resourceLocation) ).elements {
    out.add(definition.defaultInstance);
  }

  return out;
}

function getItem(resourceLocation as string) as List<IItemStack> {
  return [ BracketHandlers.getItem(resourceLocation) ];
}

val modStages = {
  create: loadedMods.getMod("create").items,
  pitchperfect: loadedMods.getMod("pitchperfect").items,
  limestone: getTag("gamestages:limestone"),
  grimstone: getTag("gamestages:grimstone"),
  shale: getTag("gamestages:shale"),
  petrified: getTag("gamestages:petrified"),
  insect_bottle: getTag("gamestages:insect_bottle"),
  crocodile: getTag("gamestages:crocodile"),
  moose: getTag("gamestages:moose"),
  kangaroo: getTag("gamestages:kangaroo"),
  dropbear: getTag("gamestages:dropbear"),
  sombrero: getItem("alexsmobs:sombrero"),
  mimicream: getItem("alexsmobs:mimicream"),
  void_worm: getTag("gamestages:void_worm"),
  frontier_cap: getTag("gamestages:frontier_cap"),
  banana: getTag("gamestages:banana"),
  glowstone_canyon: getTag("gamestages:glowstone_canyon"),
  boof: getTag("gamestages:boof"),
  corrock: getTag("gamestages:corrock"),
  acidian_lantern: getItem("endergetic:acidian_lantern"),
  puffbug: getTag("gamestages:puffbug"),
  eumus: getTag("gamestages:eumus"),
  bollom: getTag("gamestages:bollom"),
  slingshot: getTag("gamestages:slingshot"),
  hemp: getTag("gamestages:hemp"),
  music_disc_daze: getItem("alexsmobs:music_disc_daze"),
  music_disc_thime: getItem("alexsmobs:music_disc_thime"),
  music_disc_otherside: getItem("cavesandcliffs:music_disc_otherside"),
  music_disc_flush: getItem("infernalexp:music_disc_flush"),
  music_disc_soul_spunk: getItem("infernalexp:music_disc_soul_spunk"),
  music_disc_chatter: getItem("quark:music_disc_chatter"),
  music_disc_clock: getItem("quark:music_disc_clock"),
  music_disc_crickets: getItem("quark:music_disc_crickets"),
  music_disc_drips: getItem("quark:music_disc_drips"),
  music_disc_endermosh: getItem("quark:music_disc_endermosh"),
  music_disc_fire: getItem("quark:music_disc_fire"),
  music_disc_ocean: getItem("quark:music_disc_ocean"),
  music_disc_rain: getItem("quark:music_disc_rain"),
  music_disc_wind: getItem("quark:music_disc_wind"),
  music_disc_kilobyte: getItem("endergetic:music_disc_kilobyte"),
  sign_post: getTag("gamestages:sign_post"),
  flag: getTag("gamestages:flag"),
  copper: getTag("gamestages:copper"),
  sunmetal: getTag("gamestages:sunmetal"),
  brass: getTag("gamestages:brass"),
  gabbro: getTag("gamestages:gabbro"),
  dolomite: getTag("gamestages:dolomite"),
  grimestone: getTag("gamestages:grimestone"),
  deepslate: getTag("gamestages:deepslate"),
  soul_stone: getTag("gamestages:soul_stone"),
  red_mushroom: getTag("gamestages:red_mushroom"),
  brown_mushroom: getTag("gamestages:brown_mushroom"),
  glowshroom: getTag("gamestages:glowshroom"),
  poise: getTag("gamestages:poise"),
  honey_pot: getTag("gamestages:honey_pot"),
  candles: getTag("buzzier_bees:candles"),
  sweets: getTag("gamestages:sweets"),
  jar: getTag("gamestages:jar")
} as List<IItemStack>[string];

for name in modStages {
  for item in modStages[name] {
    val res = ItemStages.restrict(item, name);
    res.preventInventory(false);
    res.preventPickup(false);
  }
}