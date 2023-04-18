const getItemIds = (query) =>
  Ingredient.of(query).getItemIds().toArray()

onEvent('rei.hide.items', event => {
	// for(let item of toHide.concat(toRemove).concat(toHide) ) {
	// 	event.hide(item)
	// }

	// for(let item of disabled ) {
	// 	event.hide(item)
	// }
	// event.hide(getItemIds('#kubejs:disabled') )
	console.log('Hiding:' + global.toHide)
	event.hide(getItemIds(global.toHide) )
	console.log('HID ITEMS')
})

const groupSingle = [
	'potion',
	'splash_potion',
	'lingering_potion',
	'tipped_arrow',
	'enchanted_book'
]

const getGroupId = (namespace, path) =>
  'kubejs:rei_groups/' + namespace + '/' + path

const getTranslateKey = (type, namespace, path) =>
	[ 'kubejs.group', type, namespace, path ].join('.')

onEvent('rei.group', event => {
	for(let groupData of global.reiGroups) {
		let { 
			tag,
			nameKey,
			namespace,
			path
		} = groupData

	  event.groupItemsByTag(
			getGroupId(namespace, path),
			Text.translate(getTranslateKey('tag', namespace, path) ),
			tag
		)
	}

	for(let id of groupSingle) {
		let item = Item.of(id),
				{ namespace, path } = Utils.id(item.id)

		event.groupSameItem(
			getGroupId(namespace, path),
			Text.translate(getTranslateKey('item', namespace, path) ),
			item
		)
	}
})