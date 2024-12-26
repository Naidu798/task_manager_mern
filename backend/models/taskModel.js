const mongoose = require("mongoose");

const taskModel = new mongoose.Schema(
  {
    user: String,
    name: String,
    description: String,
    dueDate: String,
    status: String,
    priority: String,
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskModel);

module.exports = Task;
