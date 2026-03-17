const express = require("express");
const router = express.Router();
const pool = require("../database/db");

pool.query(`
  CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    description TEXT,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
  )
`);

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        tasks.id,
        tasks.description,
        tasks.user_id,
        users.name AS username
      FROM tasks
      JOIN users ON tasks.user_id = users.id
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  const { description, user_id } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO tasks (description, user_id) VALUES ($1, $2) RETURNING *",
      [description, user_id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  const { description } = req.body;
  try {
    const result = await pool.query(
      "UPDATE tasks SET description = $1 WHERE id = $2 RETURNING *",
      [description, req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM tasks WHERE id = $1 RETURNING *",
      [req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json({ message: "Task deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;