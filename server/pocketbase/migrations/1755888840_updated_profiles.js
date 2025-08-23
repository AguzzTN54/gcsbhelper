/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3414089001")

  // add field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "select2755300790",
    "maxSelect": 1,
    "name": "facilitator",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "id",
      "in"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3414089001")

  // remove field
  collection.fields.removeById("select2755300790")

  return app.save(collection)
})
