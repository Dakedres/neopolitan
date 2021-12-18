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

val modStages = { create: loadedMods.getMod("create").items, pitchperfect: loadedMods.getMod("pitchperfect").items, grimestone: getTag("gamestage_grimestone"), shale: getTag("gamestage_shale"), petrified: getTag("gamestage_petrified") } as List<IItemStack>[string];

for name in modStages {
  for item in modStages[name] {
    val res = ItemStages.restrict(item, name);
    res.preventInventory(false);
    res.preventPickup(false);
  }
}