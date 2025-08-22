/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    "createRule": null,
    "deleteRule": null,
    "fields": [
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text3208210256",
        "max": 0,
        "min": 0,
        "name": "id",
        "pattern": "^[a-z0-9]+$",
        "presentable": false,
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "_clone_BuuE",
        "max": 0,
        "min": 0,
        "name": "title",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": true,
        "system": false,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "number74588000",
        "max": null,
        "min": null,
        "name": "enrollment_count",
        "onlyInt": false,
        "presentable": false,
        "required": false,
        "system": false,
        "type": "number"
      }
    ],
    "id": "pbc_663908841",
    "indexes": [],
    "listRule": null,
    "name": "course_number",
    "system": false,
    "type": "view",
    "updateRule": null,
    "viewQuery": "SELECT\n  c.id as id,\n  c.title,\n  COUNT(e.id) as enrollment_count\nFROM courses c\nLEFT JOIN course_enrollments e ON e.course = c.id\nGROUP BY c.id;\n",
    "viewRule": null
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_663908841");

  return app.delete(collection);
})
