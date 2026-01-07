/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_34140890012")

  // update collection data
  unmarshal({
    "createRule": "",
    "listRule": "@request.headers.x_arcade_token != \"\"",
    "updateRule": "",
    "viewRule": "@request.headers.x_arcade_token != \"\""
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_34140890012")

  // update collection data
  unmarshal({
    "createRule": null,
    "listRule": null,
    "updateRule": null,
    "viewRule": null
  }, collection)

  return app.save(collection)
})
