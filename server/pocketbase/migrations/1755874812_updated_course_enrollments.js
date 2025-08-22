/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3533380876")

  // remove field
  collection.fields.removeById("autodate2990389176")

  // add field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "date2625885481",
    "max": "",
    "min": "",
    "name": "earned",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "date"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3533380876")

  // add field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "autodate2990389176",
    "name": "earned",
    "onCreate": true,
    "onUpdate": false,
    "presentable": false,
    "system": false,
    "type": "autodate"
  }))

  // remove field
  collection.fields.removeById("date2625885481")

  return app.save(collection)
})
