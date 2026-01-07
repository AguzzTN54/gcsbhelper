/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3414089001")

  // update collection data
  unmarshal({
    "name": "event_profiles"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3414089001")

  // update collection data
  unmarshal({
    "name": "profiles"
  }, collection)

  return app.save(collection)
})
