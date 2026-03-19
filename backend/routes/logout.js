router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to log out" });
    }

    res.clearCookie("connect.sid"); // important
    res.json({ message: "Logged out" });
  });
});