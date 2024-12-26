const express = require("express");
const {
  addTask,
  updateTask,
  deleteTask,
  allTasks,
} = require("../controllers/taskController");
const protectRoute = require("../middleware/protectRoute");

const router = express.Router();

router.post("/add", protectRoute, addTask);
router.put("/update", protectRoute, updateTask);
router.delete("/:taskId", protectRoute, deleteTask);
router.get("/all", protectRoute, allTasks);

module.exports = router;
