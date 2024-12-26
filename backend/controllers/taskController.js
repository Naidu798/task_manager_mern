const Task = require("../models/taskModel");

const addTask = async (req, res) => {
  try {
    const userId = req.user._id;
    const newTask = new Task({ ...req.body, user: userId });
    if (newTask) {
      const savedTask = await newTask.save();
      res.json({
        message: "Task added successfully",
        success: true,
        error: false,
        data: savedTask,
      });
    } else {
      throw Error("Task details invalid");
    }
  } catch (err) {
    res.json({
      message: err.message || err,
      success: false,
      error: false,
    });
  }
};

const updateTask = async (req, res) => {
  try {
    let { _id, name, description, status, priority, dueDate } = req.body;

    const task = await Task.findById(_id);
    if (!task) {
      throw Error("Task not found");
    }

    (task.name = name || ""),
      (task.description = description || ""),
      (task.dueDate = dueDate || ""),
      (task.status = status || "Pending"),
      (task.priority = priority || "Low");

    const updatedTask = await task.save();

    res.json({
      message: "Task updated.",
      success: true,
      error: false,
      data: updatedTask,
    });
  } catch (err) {
    res.json({
      message: err.message || err,
      success: false,
      error: true,
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findById(taskId);
    if (!task) {
      throw Error("Task not found");
    }

    await Task.findByIdAndDelete(taskId);

    res.json({
      message: "Task deleted.",
      success: true,
      error: false,
    });
  } catch (err) {
    console.log(err);
    res.json({
      message: err.message || err,
      success: false,
      error: true,
    });
  }
};

const allTasks = async (req, res) => {
  try {
    const userId = req.user._id;
    const allTasks = await Task.find({ user: userId });
    res.json({
      message: "Tasks fetched successfully",
      success: true,
      error: false,
      data: allTasks,
    });
  } catch (err) {
    res.json({
      message: err.message || err,
      success: false,
      error: true,
    });
  }
};

module.exports = { addTask, updateTask, deleteTask, allTasks };
