const express = require("express");
const router = express.Router();
const pool = require("../database/db");

// Ensure the tasks table exists and includes completed column
pool.query(`
  CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
  )
`);

router.get("/", async (req, res) => {
  try {
    if (!req.session.user) return res.status(401).json({ error: "Not logged in" });

    const result = await pool.query(
      "SELECT id, description, completed FROM tasks WHERE user_id = $1",
      [req.session.user.id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    if (!req.session.user) return res.status(401).json({ error: "Not logged in" });

    const { description } = req.body;
    if (!description) return res.status(400).json({ error: "Missing description" });

    const result = await pool.query(
      "INSERT INTO tasks (description, user_id) VALUES ($1, $2) RETURNING *",
      [description, req.session.user.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Update task description or completion
router.put("/:id", async (req, res) => {
  try {
    const { description, completed } = req.body;

    const result = await pool.query(
      `UPDATE tasks
       SET description = COALESCE($1, description),
           completed = COALESCE($2, completed)
       WHERE id = $3
       RETURNING *`,
      [description, completed, req.params.id]
    );

    if (result.rowCount === 0) return res.status(404).json({ error: "Task not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM tasks WHERE id=$1 RETURNING *",
      [req.params.id]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: "Task not found" });
    res.json({ message: "Task deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;