/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1106160442")

  // update collection data
  unmarshal({
    "createRule": "@request.method = \"POST\" && @request.auth.email ?~ \"@ekraf.dev\" && @request.headers.x_arcade_token != \"\"",
    "name": "course_labeledby_profiles",
    "updateRule": "@request.method = \"PATCH\" && @request.auth.email ?~ \"@ekraf.dev\" && @request.headers.x_arcade_token != \"\""
  }, collection)

  // add field
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

  // update field
  collection.fields.addAt(1, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_3414089001",
    "hidden": false,
    "id": "relation2170006031",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "profile",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  // update field
  collection.fields.addAt(2, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_955655590",
    "hidden": false,
    "id": "relation379482041",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "course",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1106160442")

  // update collection data
  unmarshal({
    "createRule": null,
    "name": "course_label_markedby_profiles",
    "updateRule": null
  }, collection)

  // remove field
  collection.fields.removeById("select245846248")

  // update field
  collection.fields.addAt(1, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_3414089001",
    "hidden": false,
    "id": "relation2170006031",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "profile",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // update field
  collection.fields.addAt(2, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_955655590",
    "hidden": false,
    "id": "relation379482041",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "course",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
})
