/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_955655590")

  // add field
  collection.fields.addAt(5, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text1597481275",
    "max": 0,
    "min": 0,
    "name": "token",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(6, new Field({
    "hidden": false,
    "id": "number3081106212",
    "max": null,
    "min": null,
    "name": "point",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(7, new Field({
    "hidden": false,
    "id": "bool2294531711",
    "name": "fasttrack",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  // add field
  collection.fields.addAt(8, new Field({
    "hidden": false,
    "id": "bool2345864928",
    "name": "inactive",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_955655590")

  // remove field
  collection.fields.removeById("text1597481275")

  // remove field
  collection.fields.removeById("number3081106212")

  // remove field
  collection.fields.removeById("bool2294531711")

  // remove field
  collection.fields.removeById("bool2345864928")

  return app.save(collection)
})
