const express = require("express");
const path = require("path");
const cors = require("cors");
const session = require("express-session");

const usersRoutes = require("./routes/users");
const tasksRoutes = require("./routes/tasks");

const app = express();

// ✅ MUST USE THIS
const PORT = process.env.PORT || 3000;

// ✅ CORS
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());

// ✅ TRUST PROXY (Render requires this)
app.set("trust proxy", 1);

// ✅ SESSIONS
app.use(session({
  secret: process.env.SESSION_SECRET || "secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,
    sameSite: "none"
  }
}));

// ✅ SERVE FRONTEND
app.use(express.static(path.join(__dirname, "..", "front-end")));

// ✅ ROUTES
app.use("/users", usersRoutes);
app.use("/tasks", tasksRoutes);
app.use("/logout", require("./routes/logout"));

// ✅ DEFAULT ROUTE → LOGIN PAGE
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "front-end/login/login.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});