const mongoose = require("mongoose");

// Define the Task Schema
const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Task title
  completed: { type: Boolean, default: false }, // Task status
}, { timestamps: true }); // Adds createdAt and updatedAt fields automatically

// Export the Task Model
const Task = mongoose.model("Task", TaskSchema);
module.exports = Task;
