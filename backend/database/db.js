// database/db.js
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: "postgresql://task_manager_qwzd_user:igHVu6x7fqbTyalj4r0sNenm8gUoqbUZ@dpg-d6s4hlq4d50c73bh1v8g-a.ohio-postgres.render.com/task_manager_qwzd",
  ssl: { rejectUnauthorized: false }
});

module.exports = pool;