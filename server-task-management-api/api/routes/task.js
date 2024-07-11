const express = require("express");
const taskRouter = express.Router();
const Task = require("../models/task");
const auth = require("../middlewares/auth");
const userModel = require("../models/user");

// Create a new task
taskRouter.post("/", auth, async (req, res) => {
  try {
    // Check if the authenticated user exists in userModel
    const existingUser = await userModel.findOne({ _id: req.userId });
    if (!existingUser) {
      return res.status(404).json({ message: "Authenticated user not found" });
    }
    // Ensure userId is extracted from auth middleware
    const { title, description, dueDate, priority } = req.body;
    const newTask = new Task({
      title,
      description,
      dueDate,
      priority,
      userId: req.userId,
    });

    await newTask.save();
    res.status(201).send(newTask);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all tasks
taskRouter.get("/", auth, async (req, res) => {
  const useridd = req;
  try {
    const tasks = await Task.find({ userId: req.userId });
    res.send(tasks);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get a specific task by taskId
taskRouter.get("/:taskId", auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);

    if (!task) {
      return res.status(404).send({ message: "Task not found" });
    }
    if (!task.userId.equals(req.userId)) {
      return res
        .status(403)
        .send({ message: "Unauthorized to access this task" });
    }
    res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a task by taskId
taskRouter.patch("/:taskId", auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(404).send({ message: "Task not found" });
    }
    if (!task.userId.equals(req.userId)) {
      return res
        .status(403)
        .send({ message: "Unauthorized to update this task" });
    }
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.taskId,
      req.body,
      { new: true }
    );
    res.send(updatedTask);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a task by taskId
taskRouter.delete("/:taskId", auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(404).send({ message: "Task not found" });
    }
    if (!task.userId.equals(req.userId)) {
      return res
        .status(403)
        .send({ message: "Unauthorized to delete this task" });
    }
    await Task.findByIdAndDelete(req.params.taskId);
    res.send({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update task status by taskId
taskRouter.put("/:taskId/update-status", auth, async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(404).send({ message: "Task not found" });
    }
    if (!task.userId.equals(req.userId)) {
      return res
        .status(403)
        .send({ message: "Unauthorized to update status of this task" });
    }
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.taskId,
      { status },
      { new: true }
    );
    res.send(updatedTask);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Update task priority by taskId
// taskRouter.put("/:taskId/update-priority", auth, async (req, res) => {
//   try {
//     const { priority } = req.body;
//     const task = await Task.findById(req.params.taskId);
//     if (!task) {
//       return res.status(404).send({ message: "Task not found" });
//     }
//     if (!task.userId.equals(req.userId)) {
//       return res.status(403).send({ message: "Unauthorized to update priority of this task" });
//     }
//     const updatedTask = await Task.findByIdAndUpdate(req.params.taskId, { priority }, { new: true });
//     res.send(updatedTask);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

module.exports = taskRouter;
