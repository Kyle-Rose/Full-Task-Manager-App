const express = require("express");
const { Pool } = require("pg");

const app = express();
app.use(express.json());

const pool = new Pool({
  connectionString:
    "postgresql://task_manager_qwzd_user:igHVu6x7fqbTyalj4r0sNenm8gUoqbUZ@dpg-d6s4hlq4d50c73bh1v8g-a.ohio-postgres.render.com/task_manager_qwzd",
  ssl: {
    rejectUnauthorized: false
  }
});

// create table if it doesn't exist
pool.query(`
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL
  )
`);

// add user
app.post("/users", async (req, res) => {
  const { name, email } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO users (name, email) VALUES ($1,$2) RETURNING *",
      [name, email]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});