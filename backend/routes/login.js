router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({ error: "Invalid password" });
    }

    req.session.user = {
      id: user.id,
      name: user.name
    };

    res.json({ message: "Logged in", user: req.session.user });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});