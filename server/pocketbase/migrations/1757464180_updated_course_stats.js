/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_663908841")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT\n  c.id AS id,\n  c.title,\n  COUNT(e.id) AS enrollment_count,\n  COUNT(CASE WHEN e.difficulty = 'hard' THEN 1 END) AS diff_hard,\n  COUNT(CASE WHEN e.difficulty = 'medium' THEN 1 END) AS diff_medium,\n  COUNT(CASE WHEN e.difficulty = 'easy' THEN 1 END) AS diff_easy\nFROM courses c\nLEFT JOIN course_enrollments e ON e.course = c.id\nGROUP BY c.id;\n"
  }, collection)

  // remove field
  collection.fields.removeById("_clone_XItK")

  // remove field
  collection.fields.removeById("number3082410506")

  // add field
  collection.fields.addAt(1, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_DMkB",
    "max": 0,
    "min": 0,
    "name": "title",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "number1034508212",
    "max": null,
    "min": null,
    "name": "diff_medium",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_663908841")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT\n  c.id AS id,\n  c.title,\n  COUNT(e.id) AS enrollment_count,\n  COUNT(CASE WHEN e.difficulty = 'hard' THEN 1 END) AS diff_hard,\n  COUNT(CASE WHEN e.difficulty = 'moderate' THEN 1 END) AS diff_moderate,\n  COUNT(CASE WHEN e.difficulty = 'easy' THEN 1 END) AS diff_easy\nFROM courses c\nLEFT JOIN course_enrollments e ON e.course = c.id\nGROUP BY c.id;\n"
  }, collection)

  // add field
  collection.fields.addAt(1, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_XItK",
    "max": 0,
    "min": 0,
    "name": "title",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "number3082410506",
    "max": null,
    "min": null,
    "name": "diff_moderate",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // remove field
  collection.fields.removeById("_clone_DMkB")

  // remove field
  collection.fields.removeById("number1034508212")

  return app.save(collection)
})
