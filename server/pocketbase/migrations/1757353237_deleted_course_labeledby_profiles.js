/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1106160442");

  return app.delete(collection);
}, (app) => {
  const collection = new Collection({
    "createRule": "@request.method = \"POST\" && @request.auth.email ?~ \"@ekraf.dev\" && @request.headers.x_arcade_token != \"\"",
    "deleteRule": null,
    "fields": [
      {
        "autogeneratePattern": "[a-z0-9]{15}",
        "hidden": false,
        "id": "text3208210256",
        "max": 15,
        "min": 15,
        "name": "id",
        "pattern": "^[a-z0-9]+$",
        "presentable": false,
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
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
      },
      {
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
      },
      {
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
          "completion",
          "special"
        ]
      },
      {
        "hidden": false,
        "id": "autodate2990389176",
        "name": "created",
        "onCreate": true,
        "onUpdate": false,
        "presentable": false,
        "system": false,
        "type": "autodate"
      },
      {
        "hidden": false,
        "id": "autodate3332085495",
        "name": "updated",
        "onCreate": true,
        "onUpdate": true,
        "presentable": false,
        "system": false,
        "type": "autodate"
      }
    ],
    "id": "pbc_1106160442",
    "indexes": [],
    "listRule": "@request.auth.email ?~ \"@ekraf.dev\" && @request.headers.x_arcade_token != \"\"",
    "name": "course_labeledby_profiles",
    "system": false,
    "type": "base",
    "updateRule": "@request.method = \"PATCH\" && @request.auth.email ?~ \"@ekraf.dev\" && @request.headers.x_arcade_token != \"\"",
    "viewRule": "@request.auth.email ?~ \"@ekraf.dev\" && @request.headers.x_arcade_token != \"\""
  });

  return app.save(collection);
})
