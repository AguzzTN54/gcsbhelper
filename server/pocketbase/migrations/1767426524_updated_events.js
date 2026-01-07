/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1687431684")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.email ?~ \"@ekraf.dev\" && @request.headers.x_arcade_token != \"\"",
    "deleteRule": "@request.auth.email ?~ \"@ekraf.dev\" && @request.headers.x_arcade_token != \"\"",
    "listRule": "@request.auth.email ?~ \"@ekraf.dev\" && @request.headers.x_arcade_token != \"\"",
    "updateRule": "@request.auth.email ?~ \"@ekraf.dev\" && @request.headers.x_arcade_token != \"\"",
    "viewRule": ""
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1687431684")

  // update collection data
  unmarshal({
    "createRule": null,
    "deleteRule": null,
    "listRule": null,
    "updateRule": null,
    "viewRule": null
  }, collection)

  return app.save(collection)
})
