const express = require("express");
const router = express.Router();
const pool = require("../database/db");

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: "All fields required" });

    const result = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
      [name, email, password]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { name, password } = req.body;

    if (!name || !password) {
      return res.status(400).json({ error: "Name & password required" });
    }

    const result = await pool.query(
      "SELECT * FROM users WHERE name = $1",
      [name]
    );

    const user = result.rows[0];

    if (!user || user.password !== password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // ✅ DEMO USER RESET LOGIC
    if (user.name === "demo") {
      // Delete all existing tasks for demo user
      await pool.query(
        "DELETE FROM tasks WHERE user_id = $1",
        [user.id]
      );

      // Add a default welcome task
      await pool.query(
        "INSERT INTO tasks (description, user_id) VALUES ($1, $2)",
        ["Welcome! Try adding a task.", user.id]
      );
    }

    // Save session
    req.session.user = {
      id: user.id,
      name: user.name
    };

    res.json({ message: "Logged in", name: user.name });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Logout failed" });
    }

    res.clearCookie("connect.sid");
    res.json({ message: "Logged out" });
  });
});

module.exports = router;