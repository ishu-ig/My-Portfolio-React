const RecordRouter  = require("express").Router()
const {
  getRecord,
  getSingleRecord,
  createRecord,
  updateRecord,
  deleteRecord,
  toggleRecord,
} = require("../Controllers/AchievementController");

// Public
RecordRouter.get("/",          getRecord);
RecordRouter.get("/:id",       getSingleRecord);

// Admin (add your auth middleware here if needed)
RecordRouter.post("/",         createRecord);
RecordRouter.put("/:id",       updateRecord);
RecordRouter.delete("/:id",    deleteRecord);
RecordRouter.patch("/:id/toggle", toggleRecord);

module.exports = RecordRouter;