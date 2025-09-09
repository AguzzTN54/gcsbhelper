/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3414089001")

  // update collection data
  unmarshal({
    "updateRule": "@request.auth.email ?~ \"@ekraf.dev\" && @request.headers.x_arcade_token != \"\""
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3414089001")

  // update collection data
  unmarshal({
    "updateRule": null
  }, collection)

  return app.save(collection)
})
