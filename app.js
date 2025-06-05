const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

// Middleware setup
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/todoDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Schema and model
const taskSchema = new mongoose.Schema({
  name: String,
});
const Task = mongoose.model("Task", taskSchema);

// Routes
app.get("/", async (req, res) => {
  try {
    const tasks = await Task.find(); // Use async/await instead of callbacks
    res.render("index", { tasks: tasks });
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).send("Database Error");
  }
});

app.post("/add", async (req, res) => {
  try {
    const newTask = new Task({ name: req.body.task });
    await newTask.save(); // Wait for save to complete
    res.redirect("/");
  } catch (err) {
    console.error("Error saving task:", err);
    res.status(500).send("Failed to save task");
  }
});
app.post("/update", async (req, res) => {
  const { taskId, updatedTask } = req.body;
  try {
    await Task.findByIdAndUpdate(taskId, { name: updatedTask });
    res.redirect("/");
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).send("Failed to update task");
  }
});
app.post("/delete", async (req, res) => {
  try {
    const taskId = req.body.taskId;
    await Task.findByIdAndDelete(taskId);
    res.redirect("/");
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).send("Failed to delete task");
  }
});



// Start the server
app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
