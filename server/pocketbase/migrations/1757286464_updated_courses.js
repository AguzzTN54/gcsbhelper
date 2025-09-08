/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_955655590")

  // update collection data
  unmarshal({
    "listRule": "@request.auth.email ?~ \"@ekraf.dev\" && @request.headers.x_arcade_token != \"\""
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_955655590")

  // update collection data
  unmarshal({
    "listRule": "@request.method = \"GET\" && @request.auth.email ?~ \"@ekraf.dev\" && @request.headers.x_arcade_token != \"\""
  }, collection)

  return app.save(collection)
})
