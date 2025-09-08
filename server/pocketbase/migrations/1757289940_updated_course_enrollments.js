/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3533380876")

  // update field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "select3910207164",
    "maxSelect": 1,
    "name": "difficulty",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "easy",
      "intermediate",
      "hard"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3533380876")

  // update field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "select3910207164",
    "maxSelect": 1,
    "name": "difficulty",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "easy",
      "moderate",
      "hard"
    ]
  }))

  return app.save(collection)
})
