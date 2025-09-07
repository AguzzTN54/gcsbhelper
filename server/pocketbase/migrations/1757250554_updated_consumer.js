/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1245181609")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE UNIQUE INDEX `idx_tokenKey_pbc_1245181609` ON `manager` (`tokenKey`)",
      "CREATE UNIQUE INDEX `idx_email_pbc_1245181609` ON `manager` (`email`) WHERE `email` != ''"
    ],
    "name": "manager"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1245181609")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE UNIQUE INDEX `idx_tokenKey_pbc_1245181609` ON `consumer` (`tokenKey`)",
      "CREATE UNIQUE INDEX `idx_email_pbc_1245181609` ON `consumer` (`email`) WHERE `email` != ''"
    ],
    "name": "consumer"
  }, collection)

  return app.save(collection)
})
