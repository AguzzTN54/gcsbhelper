/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3414089001")

  // remove field
  collection.fields.removeById("url376926767")

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3414089001")

  // add field
  collection.fields.addAt(7, new Field({
    "exceptDomains": [],
    "hidden": false,
    "id": "url376926767",
    "name": "avatar",
    "onlyDomains": [],
    "presentable": false,
    "required": false,
    "system": false,
    "type": "url"
  }))

  return app.save(collection)
})
