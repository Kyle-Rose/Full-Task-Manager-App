router.post("/logout", (req, res) => {
  req.session.destroy();
  res.json({ message: "Logged out" });
});