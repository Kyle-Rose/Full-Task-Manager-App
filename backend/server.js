const express = require("express");
const path = require("path");
const cors = require("cors");

// Import route files
const usersRoutes = require("./routes/users");
const tasksRoutes = require("./routes/tasks");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // allow cross-origin requests
app.use(express.json()); // parse JSON bodies

// Serve static frontend files
app.use(express.static(path.join(__dirname, "front-end")));

// API routes
app.use("/users", usersRoutes);
app.use("/tasks", tasksRoutes);

// Optional: serve tasks.html directly at /tasks-page
app.get("/tasks-page", (req, res) => {
  res.sendFile(path.join(__dirname, "front-end/main/tasks.html"));
});

// Catch-all for 404 (optional)
app.use((req, res) => {
  res.status(404).send("Not Found");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});