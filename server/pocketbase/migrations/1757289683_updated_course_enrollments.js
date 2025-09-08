/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3533380876")

  // add field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "select245846248",
    "maxSelect": 1,
    "name": "label",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "skill",
      "game",
      "trivia",
      "wmp",
      "labfree",
      "completion",
      "special"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3533380876")

  // remove field
  collection.fields.removeById("select245846248")

  return app.save(collection)
})
