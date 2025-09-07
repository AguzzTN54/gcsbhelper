/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1106160442")

  // update field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "select245846248",
    "maxSelect": 1,
    "name": "label",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "trivia",
      "game",
      "wmp",
      "skill",
      "labfree",
      "completion",
      "special"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1106160442")

  // update field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "select245846248",
    "maxSelect": 1,
    "name": "label",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "trivia",
      "game",
      "wmp",
      "skill",
      "labfree",
      "completion"
    ]
  }))

  return app.save(collection)
})
