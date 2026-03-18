const express = require("express");
const path = require("path");
const cors = require("cors");
const session = require("express-session");

const usersRoutes = require("./routes/users");
const tasksRoutes = require("./routes/tasks");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(session({
  secret: "secret-key",
  resave: false,
  saveUninitialized: false
}));

app.use("/front-end", express.static(path.join(__dirname, "..", "front-end")));

app.use("/users", usersRoutes);
app.use("/tasks", tasksRoutes);

app.get("/tasks-page", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "front-end/main/tasks.html"));
});

app.use((req, res) => res.status(404).send("Not Found"));

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));

app.set("trust proxy", 1);

app.use(session({
  secret: "secret-key",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,
    sameSite: "none"
  }
}));

app.use(cors({
  origin: true,
  credentials: true
}));